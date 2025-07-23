import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Contact} from './contact.model'
import {ContactStore} from './contact.store'

@Injectable({providedIn: 'root'})
export class ContactService extends BaseService<Contact> {
  constructor(protected override readonly store: ContactStore) {
    super(store)
  }
}
