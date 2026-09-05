import {Injectable} from '@angular/core'
import {AuditFieldLabelService} from '../../../reusable/services/audit-field-label.service'

@Injectable()
export class TransactionFieldLabelService extends AuditFieldLabelService {
  private readonly columnMap = new Map<string, string>([
    ['userId', 'Contact ID'],
    ['contactName', 'Contact Name'],
    ['contactBalance', 'Contact Balance'],
    ['transactionType', 'Transaction Type'],
    ['transactionDate', 'Transaction Date'],
    ['amount', 'Amount'],
    ['description', 'Description'],
    ['location', 'Location']
  ])

  getLabel(fieldName: string): string {
    return this.columnMap.get(fieldName) ?? fieldName
  }
}
