import {inject, Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {UserLocation} from './user-location.model'
import {UserLocationStore} from './user-location.store'

@Injectable({providedIn: 'root'})
export class UserLocationService extends BaseService<UserLocation> {
	constructor() {
		super(inject(UserLocationStore))
	}
}
