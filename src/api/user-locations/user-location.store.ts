import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {UserLocation} from './user-location.model'

@Injectable({providedIn: 'root'})
export class UserLocationStore extends createBaseStore<UserLocation>() implements BaseStore<UserLocation>{
	readonly basePath = 'user-location'
}
