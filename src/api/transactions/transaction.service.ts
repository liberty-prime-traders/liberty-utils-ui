import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Transaction} from './transaction.model'
import {TransactionStore} from './transaction.store'

@Injectable({providedIn: 'root'})
export class TransactionService extends BaseService<Transaction> {

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(protected override readonly store: TransactionStore) {
    super(store)
  }
}
