import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Transaction} from '../transactions/transaction.model'
import {Contact} from './contact.model'
import {ContactStore} from './contact.store'

@Injectable({providedIn: 'root'})
export class ContactService extends BaseService<Contact> {

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(protected override readonly store: ContactStore) {
    super(store)
  }

  patchBalance(transaction: Transaction) {
    this.store.upsert({id: transaction.userId, balance: transaction.contactBalance})
  }
}
