import {Signal} from '@angular/core'
import {signalStore} from '@ngrx/signals'
import {EntityId} from '@ngrx/signals/entities'
import {ProcessingStatus} from '../processing-status.enum'
import {withBaseStore} from './base-store.feature'
import {BaseModel} from './base.model'

export interface BaseStore<ENTITY extends BaseModel> {
	entities: Signal<ENTITY[]>
	loading: Signal<boolean>
	selectFirst: Signal<ENTITY | undefined>
	processingStatus: Signal<ProcessingStatus>
	failureMessages: Signal<string[]>
	basePath: string
	setAll: (entities: ENTITY[]) => void
	upsert: (entity: ENTITY) => void
	setProcessingStatus: (processingStatus: ProcessingStatus) => void
	setError<T>(error: T): void
	resetStore(): void
	setLoading(loading: boolean): void
	remove(id: EntityId): void
}

export function createBaseStore<ENTITY extends BaseModel>() {
  return signalStore(withBaseStore<ENTITY>(entity => entity.id))
}
