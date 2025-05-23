import {BaseModel} from '../base-api/base.model'
import {SysUserStatus} from './sys-user-status.enum'

export interface SysUser extends BaseModel {
	status: SysUserStatus;
	oktaId: string;
	firstName: string;
	lastName: string;
	mobilePhone?: string;
	secondEmail?: string;
	email: string;
}
