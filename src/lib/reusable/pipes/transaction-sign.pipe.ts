import { Pipe, PipeTransform } from '@angular/core'
import {TransactionType} from '../../../api/transactions/transaction-type.enum'

@Pipe({
  name: 'transactionSign',
  standalone: true
})
export class TransactionSignPipe implements PipeTransform {
  transform(type: TransactionType): string {
    return type === TransactionType.DEBIT ? '-' : '+'
  }
}
