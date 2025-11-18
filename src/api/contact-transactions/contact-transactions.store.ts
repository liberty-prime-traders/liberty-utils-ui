import {Injectable} from '@angular/core'
import {createHashMapBaseStore, HashmapBaseStore} from '../base-api/hashmap-base-api/hashmap-base-store'
import {Transaction} from '../transactions/transaction.model'

@Injectable({providedIn: 'root'})
export class ContactTransactionsStore extends createHashMapBaseStore<Transaction>() implements HashmapBaseStore<Transaction> {
  readonly mapKey = 'userId'
  readonly basePath = 'transaction'
}
