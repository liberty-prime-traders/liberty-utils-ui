import {Component, computed, inject, OnInit, Signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {UIChart} from 'primeng/chart'
import {ProgressSpinner} from 'primeng/progressspinner'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {ContactService} from '../../../../api/contacts/contact.service'
import {Summary} from '../../../../api/summary/summary.model'
import {SummaryService} from '../../../../api/summary/summary.service'
import {MoneyComponent} from '../../../reusable/components/money.component'

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

  readonly tabItems = [
    {label: 'Debtors', icon: 'pi pi-arrow-up-right'},
    {label: 'Creditors', icon: 'pi pi-arrow-down-right'}
  ];

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
