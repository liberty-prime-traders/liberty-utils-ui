import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {SysUser} from './sys-user.model'

@Injectable({providedIn: 'root'})
export class SysUserStore extends createBaseStore<SysUser>() implements BaseStore<SysUser> {
  readonly basePath = 'users'
}
