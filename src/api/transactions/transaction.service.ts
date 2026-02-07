import {computed, inject, Injectable, Signal} from '@angular/core'
import {Subscription} from 'rxjs'
import {formatYMD, getDateRange} from '../../lib/reusable/date-utils'
import {OrMultimap} from '../../lib/reusable/types/Multimap.type'
import {HashmapBaseService} from '../base-api/hashmap-base-api/hashmap-base.service'
import {ContactTransactionsService} from '../contact-transactions/contact-transactions.service'
import {ContactService} from '../contacts/contact.service'
import {Transaction} from './transaction.model'
import {TransactionStore} from './transaction.store'

@Injectable({providedIn: 'root'})
export class TransactionService extends HashmapBaseService<TransactionStore, Transaction, Transaction|string[]> {

  private static readonly FETCH_BY_DATE_URL_SUFFIX = 'fetch-by-date'

  private readonly contactService = inject(ContactService)
  protected override readonly store = inject(TransactionStore)
  private readonly contactTransactionService = inject(ContactTransactionsService)

  private readonly queriedDates = new Set<string>()

  constructor() {
    super(inject(TransactionStore))
  }

  selectForDate(startDate: Signal<Date>,endDate: Signal<Date>) {
    return computed(() => getDateRange(startDate(), endDate()).flatMap(date => this.selectHashMap().get(date)))
  }

  override refetch(params: {startDate: Date, endDate: Date}): Subscription | undefined {
    const datesToFetch = this.getUncachedDates(params.startDate, params.endDate)
    if (datesToFetch.length === 0) {
      return undefined
    }
    this.patchApiRequestConfig({urlSuffix: TransactionService.FETCH_BY_DATE_URL_SUFFIX})
    return this.post(datesToFetch)
  }

  override finishSavingWithSuccess(response: OrMultimap<Transaction>): void {
    if (!this.getApiRequestConfig().urlSuffix) {
      this.contactService.patchBalance(response)
      this.contactTransactionService.upsertTransactions(response)
    }
    super.finishSavingWithSuccess(response)
  }

  override finishDeletingWithSuccess(transaction: Transaction): void {
    this.contactService.patchBalance(transaction)
    super.finishDeletingWithSuccess(transaction)
  }

  private getUncachedDates(start: Date, end: Date): string[] {
    const cachedDates = this.store.keys()
    const result = new Set<string>()
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateString = formatYMD(d)
      if (!cachedDates.has(dateString) && !this.queriedDates.has(dateString)) {
        result.add(dateString)
        this.queriedDates.add(dateString)
      }
    }
    return Array.from(result)
  }

}
