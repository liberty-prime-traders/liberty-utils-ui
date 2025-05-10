import {BaseModel} from '../base-api/base.model'

export interface DailySnapshotModel extends BaseModel {
	snapshotDate?: string
	createdOn?: Date
	startBalanceCash?: number
	endBalanceCash?: number
	outflowCash?: number
	cogs?: number
	cogsReturned?: number
	expenses?: number
	inflowJointAccount?: number
	inflowPersonalAccount?: number
	inflowCash?: number
	inflowCreditSales?: number
	grossInflow?: number
	netInflow?: number
	grossOutflow?: number
	inflowBothAccounts?: number
}
