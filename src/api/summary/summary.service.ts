import {inject, Injectable} from '@angular/core'
import {CollectionBaseService} from '../base-api/collection-base-api/collection-base.service'
import {Summary} from './summary.model'
import {SummaryStore} from './summary.store'

@Injectable({providedIn: 'root'})
export class SummaryService extends CollectionBaseService<Summary> {
  constructor() {
    super(inject(SummaryStore))
  }
}
