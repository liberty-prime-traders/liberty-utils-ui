import {Injectable} from '@angular/core'
import {Summary} from './summary.model'
import {CollectionBaseStore, createBaseStore} from '../base-api/collection-base-api/collection-base.store'

@Injectable({providedIn: 'root'})
export class SummaryStore extends createBaseStore<Summary>() implements CollectionBaseStore<Summary> {
  readonly basePath = 'summary'
}
