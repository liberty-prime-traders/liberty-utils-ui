import {Transaction} from '../transactions/transaction.model'
import {BaseModel} from '../base-api/base.model'
import {ContactSummary} from './contact-summary.model'

export interface Summary extends BaseModel {
  timeFetched: string,
  latestTransactions: Transaction[]
  totalDebtors: number
  totalCreditors: number
  totalOwedToMe: number
  totalOwedByMe: number
  myNetStanding: number
  topDebtors: ContactSummary[]
  topCreditors: ContactSummary[]
}
