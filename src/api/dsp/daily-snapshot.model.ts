import {BaseModel} from '../base-api/base.model'
import {LibertyLocation} from '../user-locations/liberty-location.enum'

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
	grossInflow?: number
	netInflow?: number
	grossOutflow?: number
	inflowBothAccounts?: number
	location?: LibertyLocation
}
