import {inject, Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {BaseService} from '../base-api/base.service'
import {ContactTransactionsService} from '../contact-transactions/contact-transactions.service'
import {ContactService} from '../contacts/contact.service'
import {TransactionRequest} from './transaction-request'
import {Transaction, TransactionsByDate} from './transaction.model'
import {TransactionStore} from './transaction.store'

@Injectable({providedIn: 'root'})
export class TransactionService extends BaseService<TransactionsByDate, Transaction | TransactionRequest> {

  private readonly contactService = inject(ContactService)
  protected override readonly store = inject(TransactionStore)
  private readonly contactTransactionService = inject(ContactTransactionsService)

  constructor() {
    super(inject(TransactionStore))
  }

  readonly getForDateRangeAndUser = (startDate: Date, endDate: Date, userId?: string) =>
    this.store.getForDateRangeAndUser(startDate, endDate, userId)

  override refetch(params: {startDate: string, endDate: string}): Subscription | undefined {
    const datesToFetch = this.getUncachedDates(params.startDate, params.endDate)
    if (datesToFetch.size === 0) {
      return undefined
    }
    this.patchApiRequestConfig({urlSuffix: 'fetch-by-date'})
    return this.post({datesToFetch})
  }

  override finishSavingWithSuccess(response: TransactionsByDate): void {
    if (!this.getApiRequestConfig().urlSuffix) {
      this.contactService.patchBalance(response)
      this.contactTransactionService.upsertTransactionsInCache(response)
    }
    super.finishSavingWithSuccess(response)
  }

  override finishDeletingWithSuccess(id: string): void {
    this.contactTransactionService.removeFromTransactionCache(id)
    super.finishDeletingWithSuccess(id)
  }

  private getUncachedDates(start: string, end: string): Set<string> {
    const result = new Set<string>()
    const cachedDates = this.store.getCachedDates()
    for (let d = new Date(start); d <=  new Date(end); d.setDate(d.getDate() + 1)) {
      const dateString = d.toLocaleDateString()
      if (!cachedDates.has(dateString)) {
        result.add(dateString)
      }
    }
    return result
  }
}
