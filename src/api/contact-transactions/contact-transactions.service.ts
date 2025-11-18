import {HttpParams} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Subscription} from 'rxjs'
import {OrMultimap} from '../../lib/reusable/types/Multimap.type'
import {HashmapBaseService} from '../base-api/hashmap-base-api/hashmap-base.service'
import {ProcessingStatus} from '../processing-status.enum'
import {Transaction} from '../transactions/transaction.model'
import {ContactTransactionsStore} from './contact-transactions.store'

@Injectable({ providedIn: 'root'})
export class ContactTransactionsService extends HashmapBaseService<ContactTransactionsStore,Transaction> {

  constructor() {
    super(inject(ContactTransactionsStore))
  }

  override refetch(params?: { userId: string }): Subscription | undefined {
    const key = `${params?.userId}`
    if (this.store.has(key)) {
      this.setProcessingStatus(ProcessingStatus.SUCCESS)
      return undefined
    }
    return super.refetch(params)
  }

  override getHttpParams(params: { userId: string }): HttpParams {
    return new HttpParams().setNonNull('userId', params.userId)
  }

  removeFromTransactionCache(userId: string, id: EntityId): void {
    this.store.deleteFromCollection(userId, id)
  }

  upsertTransactions(transactions: OrMultimap<Transaction>) {

  }
}
