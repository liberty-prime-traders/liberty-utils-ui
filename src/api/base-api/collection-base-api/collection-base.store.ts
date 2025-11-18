import {Signal} from '@angular/core'
import {signalStore} from '@ngrx/signals'
import {EntityId} from '@ngrx/signals/entities'
import {AbstractBaseStore} from '../abstract-base-store'
import {BaseModel} from '../base.model'
import {withCollectionBaseStore} from './collection-base-store.feature'

export interface CollectionBaseStore<ENTITY extends BaseModel> extends AbstractBaseStore {
  entities: Signal<ENTITY[]>
  selectFirst: Signal<ENTITY | undefined>
	setAll: (entities: ENTITY[]) => void
	upsert: (entity: ENTITY) => void
  upsertMany: (entities: ENTITY[]) => void
	remove(id: EntityId): void
}

export function createBaseStore<ENTITY extends BaseModel>() {
  return signalStore(withCollectionBaseStore<ENTITY>(entity => entity.id!))
}
