import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'dailySnapshotLabel'})
export class DailySnapshotLabelsPipe implements PipeTransform {
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
		['location', 'Location'],
    ['relaySales', 'Relay Sales'],
    ['transactionCosts', 'Transaction Costs']
	]);

	transform(value?: string): string|undefined {
		return value ? this.columnMap.get(value) ?? value : undefined;
	}
}
