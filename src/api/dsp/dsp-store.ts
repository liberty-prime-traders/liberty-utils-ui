import {Injectable} from '@angular/core'
import {CollectionBaseStore, createBaseStore} from '../base-api/collection-base-api/collection-base.store'
import {DailySnapshotModel} from './daily-snapshot.model'

@Injectable({providedIn: 'root'})
export class DspStore extends createBaseStore<DailySnapshotModel>() implements CollectionBaseStore<DailySnapshotModel> {
	readonly basePath = 'snapshot'
}

