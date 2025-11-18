import {Injectable} from '@angular/core'
import {CollectionBaseStore, createBaseStore} from '../base-api/collection-base-api/collection-base.store'
import {SysUser} from './sys-user.model'

@Injectable({providedIn: 'root'})
export class SysUserStore extends createBaseStore<SysUser>() implements CollectionBaseStore<SysUser> {
  readonly basePath = 'users'
}
