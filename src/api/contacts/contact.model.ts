import {BaseModel} from '../base-api/base.model'
import {ContactType} from './contact-type.enum'

export interface Contact extends BaseModel{
  fullName?: string,
  email?: string,
  phoneNumber?: string,
  contactType?: ContactType,
  balance?: number
}
