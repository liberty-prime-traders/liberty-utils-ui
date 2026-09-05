import {Injectable} from '@angular/core'
import {AuditFieldLabelService} from '../../reusable/services/audit-field-label.service'

@Injectable()
export class DailySnapshotFieldLabelService extends AuditFieldLabelService {
  private readonly columnMap = new Map<string, string>([
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
  ])

  getLabel(fieldName: string): string {
    return this.columnMap.get(fieldName) ?? fieldName
  }
}
