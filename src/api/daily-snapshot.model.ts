import {EntityId} from '@ngrx/signals/entities'

export interface DailySnapshotModel {
	id: EntityId
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
