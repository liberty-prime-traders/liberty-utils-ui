import {EntityId} from '@ngrx/signals/entities'

export interface DailySnapshotModel {
	id: EntityId;
	snapshotDate?: string;
	createdOn?: Date;
	startBalanceCash?: number;
	startBalanceJointAccount?: number;
	startBalancePersonalAccount?: number;
	endBalanceCash?: number;
	endBalanceJointAccount?: number;
	endBalancePersonalAccount?: number;
	outflowCash?: number;
	outflowJointAccount?: number;
	outflowPersonalAccount?: number;
	inflowCash?: number;
	inflowJointAccount?: number;
	inflowPersonalAccount?: number;
	totalInflow?: number;
	totalOutflow?: number;
	netChange?: number;
}
