import {Signal} from '@angular/core'
import {signalStore} from '@ngrx/signals'
import {EntityId} from '@ngrx/signals/entities'
import {Multimap} from '../../../lib/reusable/types/Multimap.type'
import {AbstractBaseStore} from '../abstract-base-store'
import {BaseModel} from '../base.model'
import {withHashmapBaseStore} from './hashmap-base-store.feature'

export interface HashmapBaseStore<V extends BaseModel> extends AbstractBaseStore {
  hashMap: Signal<Multimap<V>>
  has(key: string): boolean
  get(key: Signal<string>): Signal<V[]>
  keys: Signal<Set<string>>
  readonly mapKey: keyof V
  uniqueId?: keyof V
  resetMap: (map: Multimap<V>) => void
  resetCollection: (key: string, value: V[]) => void
  patchMap: (map: Multimap<V>) => void
  patchCollection: (key: string, collection: V[]) => void
  deleteEntry: (key: string) => void
  deleteFromCollection: (key: string, id: EntityId) => void
}

export function createHashMapBaseStore<V extends BaseModel>() {
  return signalStore(withHashmapBaseStore<V>())
}
