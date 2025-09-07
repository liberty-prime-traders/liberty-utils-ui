import {DatePipe} from '@angular/common'
import {Component, computed, inject, OnInit, Signal} from '@angular/core'
import {RouterLink} from '@angular/router'
import {Card} from 'primeng/card'
import {ProgressSpinner} from 'primeng/progressspinner'
import {TableModule} from 'primeng/table'
import {Summary} from '../../../../api/summary/summary.model'
import {SummaryService} from '../../../../api/summary/summary.service'
import {AvatarComponent} from '../../../reusable/components/avatar/avatar.component'
import {MoneyComponent} from '../../../reusable/components/money.component'
import {TransactionTypePipe} from '../../../reusable/pipes/transaction-type.pipe'

@Component({
  selector: 'dbt-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    Card,
    DatePipe,
    TableModule,
    RouterLink,
    TransactionTypePipe,
    ProgressSpinner,
    AvatarComponent,
    MoneyComponent
  ],
  standalone: true
})

export class DashboardComponent implements OnInit {
  private readonly summaryService = inject(SummaryService)
  readonly summary: Signal<Summary> = computed(() => this.summaryService.selectFirst() ?? {} as Summary)
  readonly summaryLoading = this.summaryService.selectLoading

  ngOnInit(): void {
    this.summaryService.fetch()
  }
}
