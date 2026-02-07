import {Injectable} from '@angular/core'
import {CollectionBaseStore, createBaseStore} from '../base-api/collection-base-api/collection-base.store'
import {Contact} from './contact.model'

@Injectable({providedIn: 'root'})
export class ContactStore extends createBaseStore<Contact>() implements CollectionBaseStore<Contact> {
  readonly basePath = 'contacts'
}
