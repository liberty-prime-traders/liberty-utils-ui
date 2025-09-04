import {Transaction} from '../transactions/transaction.model'
import {BaseModel} from '../base-api/base.model'

export interface Summary extends BaseModel {
  timeFetched: string,
  latestTransactions: Transaction[]
  totalContacts: number
  totalDebtors: number
  totalCreditors: number
  totalDebt: number
  totalCredit: number
  topDebtors: { id: string, name: string; amount: number; date: string }[]
  topCreditors: { id: string, name: string; amount: number; date: string }[]
}
