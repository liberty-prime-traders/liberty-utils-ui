import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Contact} from './contact.model'
import {ContactStore} from './contact.store'

@Injectable({providedIn: 'root'})
export class ContactService extends BaseService<Contact> {

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(protected override readonly store: ContactStore) {
    super(store)
  }
}
