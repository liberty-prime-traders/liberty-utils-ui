import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Subscription} from 'rxjs'

@Injectable({providedIn: 'root'})
export class SysUserService {
	private readonly basePath = '/secured/users'
	private readonly httpClient = inject(HttpClient)
	
	createUser(): Subscription {
		return this.httpClient.post<never>(this.basePath, {}).subscribe()
	}
}
