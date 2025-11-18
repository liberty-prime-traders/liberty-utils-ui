import {inject, Injectable} from '@angular/core'
import {CollectionBaseService} from '../base-api/collection-base-api/collection-base.service'
import {UserLocation} from './user-location.model'
import {UserLocationStore} from './user-location.store'

@Injectable({providedIn: 'root'})
export class UserLocationService extends CollectionBaseService<UserLocation> {
	constructor() {
		super(inject(UserLocationStore))
	}
}
