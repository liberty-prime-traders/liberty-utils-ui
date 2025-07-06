import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {DailySnapshotModel} from './daily-snapshot.model'

@Injectable({providedIn: 'root'})
export class DspStore extends createBaseStore<DailySnapshotModel>() implements BaseStore<DailySnapshotModel> {
  readonly basePath = 'snapshot'
}

