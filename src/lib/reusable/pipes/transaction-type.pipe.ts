import {Pipe, PipeTransform} from '@angular/core'
import {TransactionType, TransactionTypeLabel} from '../../../api/transactions/transaction-type.enum'

@Pipe({name: 'transactionType'})
export class TransactionTypePipe  implements PipeTransform {

  transform(type: TransactionType): string {
    return TransactionTypeLabel[type]
  }
}
