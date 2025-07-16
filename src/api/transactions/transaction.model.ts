import {BaseModel} from '../base-api/base.model';
import {TransactionType} from './transaction-type.enum';

export interface Transaction extends BaseModel{
  userID?: string;
  contactName?: string,
  transactionType?: TransactionType,
  transactionDate?: number,
  amount?: number,
  description?: string
}
