import {Pipe} from '@angular/core'

@Pipe({name: 'dailySnapshotLabel'})
export class DailySnapshotLabelsPipe {
	private readonly columnMap: Map<string, string> = new Map<string, string>([
		['cogs', 'COGS'],
		['cogsReturned', 'COGS Returned'],
		['expenses', 'Expenses'],
		['outflowCash', 'Cash Outflow'],
		['inflowJointAccount', 'Joint Account Inflow'],
		['inflowPersonalAccount', 'Personal Account Inflow'],
		['startBalanceCash', 'Cash Starting Balance'],
		['endBalanceCash', 'Cash Ending Balance'],
		['inflowCreditSales', 'Credit Sales Inflow'],
		['snapshotDate', 'Snapshot Date'],
		['location', 'Location']
	])
	
	transform(value?: string): string|undefined {
		return value ? this.columnMap.get(value) ?? value : undefined
	}
}
