import {Component, computed, inject, OnInit, Signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {Summary} from '../../../../api/summary/summary.model'
import {SummaryService} from '../../../../api/summary/summary.service'
import {ProgressSpinner} from 'primeng/progressspinner'
import {Card} from 'primeng/card'
import {MoneyComponent} from '../../../reusable/components/money.component'
import {ContactService} from '../../../../api/contacts/contact.service'
import {UIChart} from 'primeng/chart'

@Component({
  selector: 'dt-report',
  templateUrl: './reports.component.html',
  imports: [
    FormsModule,
    TabPanel,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    ProgressSpinner,
    Card,
    MoneyComponent,
    UIChart
  ],
  standalone: true
})
export class ReportsComponent implements OnInit{
  private readonly summaryService = inject(SummaryService)
  private readonly contactService = inject(ContactService)
  readonly $summary: Signal<Summary> = computed(() => this.summaryService.selectFirst() ?? {} as Summary)
  readonly summaryLoading = this.summaryService.selectLoading
  readonly $totalContacts = computed(() => this.contactService.selectAll().length)

  readonly tabItems = [
    {label: 'Overview', icon: 'pi pi-chart-bar'},
    {label: 'Debtors', icon: 'pi pi-arrow-up-right'},
    {label: 'Creditors', icon: 'pi pi-arrow-down-right'}
  ];

  readonly $overviewData = computed(() => ({
    labels: ['Owed to you', 'You owe'],
    datasets: [
      {
        data: [
          this.$summary().totalOwedToMe,
          Math.abs(this.$summary().totalOwedByMe)
        ],
        backgroundColor: ['#4CAF50', '#F44336']
      }
    ]
  }))

  readonly barOptions = {
    plugins: {
      legend: {
        display: false
      }
    }
  }

  readonly $creditorsData = computed(() => ({
    labels: this.$summary().topCreditors.map(c => c.fullName),
    datasets: [
      {
        data: this.$summary().topCreditors.map(c => Math.abs(c.amount)),
      }
    ]
  }))


  readonly debtorsData = computed(() => ({
    labels: this.$summary().topDebtors.map(d => d.fullName),
    datasets: [
      {
        data: this.$summary().topDebtors.map(d => Math.abs(d.amount)),
      }
    ]
  }))

  readonly pieOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  ngOnInit(): void {
    this.summaryService.fetch()
    this.contactService.fetch()
  }

}
