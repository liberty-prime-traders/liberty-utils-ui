import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {Transaction} from '../transactions/transaction.model'

@Injectable({providedIn: 'root'})
export class ContactTransactionStore extends createBaseStore<Transaction>() implements BaseStore<Transaction> {
  readonly basePath = 'transaction'
}
