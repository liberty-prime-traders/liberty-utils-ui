import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Transaction} from './transaction.model'
import {TransactionStore} from './transaction.store'

@Injectable({providedIn: 'root'})
export class TransactionService extends BaseService<Transaction> {
  constructor(protected override readonly store: TransactionStore) {
    super(store)
  }
}
