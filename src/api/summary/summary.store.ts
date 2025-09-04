import {Injectable} from '@angular/core'
import {Summary} from './summary.model'
import {BaseStore, createBaseStore} from '../base-api/base.store'

@Injectable({providedIn: 'root'})
export class SummaryStore extends createBaseStore<Summary>() implements BaseStore<Summary> {
  readonly basePath = 'summary'
}
