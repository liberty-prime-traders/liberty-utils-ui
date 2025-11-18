import {Injectable} from '@angular/core'
import {CollectionBaseService} from '../base-api/collection-base-api/collection-base.service'
import {SysUser} from './sys-user.model'
import {SysUserStore} from './sys-user.store'

@Injectable({providedIn: 'root'})
export class SysUserService extends CollectionBaseService<SysUser> {

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(protected readonly userStore: SysUserStore) {
    super(userStore)
  }
}
