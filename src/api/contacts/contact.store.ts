import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {Contact} from './contact.model'

@Injectable({providedIn: 'root'})
export class ContactStore extends createBaseStore<Contact>() implements BaseStore<Contact> {
  readonly basePath = 'contacts'
}
