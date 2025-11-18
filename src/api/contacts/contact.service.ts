import {Injectable} from '@angular/core'
import {CollectionBaseService} from '../base-api/collection-base-api/collection-base.service'
import {Transaction} from '../transactions/transaction.model'
import {Contact} from './contact.model'
import {ContactStore} from './contact.store'

@Injectable({providedIn: 'root'})
export class ContactService extends CollectionBaseService<Contact> {

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(protected override readonly store: ContactStore) {
    super(store)
  }

  patchBalance(transaction: Transaction) {
    this.store.upsert({id: transaction.userId, balance: transaction.contactBalance})

  }
}
