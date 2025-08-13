import {BaseModel} from '../base-api/base.model'
import {TransactionType} from './transaction-type.enum'

export interface Transaction extends BaseModel{
  userId?: string;
  contactName?: string,
  transactionType?: TransactionType,
  transactionDate?: Date,
  amount?: number,
  description?: string,
  location?: string
}
