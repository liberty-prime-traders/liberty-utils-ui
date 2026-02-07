import {Injectable} from '@angular/core'
import {CollectionBaseStore, createBaseStore} from '../base-api/collection-base-api/collection-base.store'
import {UserLocation} from './user-location.model'

@Injectable({providedIn: 'root'})
export class UserLocationStore extends createBaseStore<UserLocation>() implements CollectionBaseStore<UserLocation>{
	readonly basePath = 'user-location'
}
