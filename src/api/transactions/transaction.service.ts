import {inject, Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Transaction} from './transaction.model'
import {TransactionStore} from './transaction.store'
import {HttpParams} from '@angular/common/http'

@Injectable({providedIn: 'root'})
export class TransactionService extends BaseService<Transaction> {

  constructor() {
    super(inject(TransactionStore))
  }

  override getHttpParams(params: {startDate: string, endDate: string}): HttpParams {
    return new HttpParams()
      .setNonNull('startDate', params.startDate)
      .setNonNull('endDate', params.endDate)
  }
}
