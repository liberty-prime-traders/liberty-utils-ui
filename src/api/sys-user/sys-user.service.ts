import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {SysUser} from './sys-user.model'
import {SysUserStore} from './sys-user.store'

@Injectable({providedIn: 'root'})
export class SysUserService extends BaseService<SysUser> {
  constructor(protected readonly userStore: SysUserStore) {
    super(userStore)
  }
}
