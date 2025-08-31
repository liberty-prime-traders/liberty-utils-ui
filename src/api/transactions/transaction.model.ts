import {BaseModel} from '../base-api/base.model'
import {TransactionType} from './transaction-type.enum'

export interface Transaction extends BaseModel{
  userId?: string;
  contactName?: string,
  contactBalance?: number,
  transactionType?: TransactionType,
  transactionDate?: string,
  amount?: number,
  description?: string,
  location?: string
}
