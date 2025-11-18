import {Injectable} from '@angular/core'
import {createHashMapBaseStore, HashmapBaseStore} from '../base-api/hashmap-base-api/hashmap-base-store'
import {Transaction} from './transaction.model'

@Injectable({providedIn: 'root'})
export class TransactionStore extends createHashMapBaseStore<Transaction>() implements HashmapBaseStore<Transaction> {
  readonly basePath = 'transaction'
  readonly mapKey = 'transactionDate'
}
