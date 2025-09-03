import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Summary} from './summary.model'
import {SummaryStore} from './summary.store'

@Injectable({providedIn: 'root'})
export class SummaryService extends BaseService<Summary> {

  constructor(protected override readonly store: SummaryStore) {
    super(store)
  }
}
