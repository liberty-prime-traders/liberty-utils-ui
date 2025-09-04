import {Component, inject, OnInit} from '@angular/core'
import {CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common'
import {Card} from 'primeng/card'
import {TableModule} from 'primeng/table'
import {RouterLink} from '@angular/router'
import {TransactionSignPipe} from '../../../reusable/pipes/transaction-sign.pipe'
import {Avatar} from 'primeng/avatar'
import {InitialsPipe} from '../../../reusable/pipes/initials.pipe'
import {SummaryService} from '../../../../api/summary/summary.service'

@Component({
  selector: 'dt-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    DecimalPipe,
    Card,
    DatePipe,
    TableModule,
    RouterLink,
    TransactionSignPipe,
    CurrencyPipe,
    Avatar,
    InitialsPipe
  ],
  standalone: true
})

export class DashboardComponent implements OnInit {
  private readonly summaryService = inject(SummaryService)
  readonly summary = this.summaryService.selectFirst
  readonly summaryLoading = this.summaryService.selectLoading

  ngOnInit(): void {
    this.summaryService.fetch()
  }
}
