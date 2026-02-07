import {computed, Signal} from '@angular/core'
import {patchState, signalStoreFeature, withMethods, withProps, withState} from '@ngrx/signals'
import {EntityId} from '@ngrx/signals/entities'
import {Multimap} from '../../../lib/reusable/types/Multimap.type'
import {withBaseStateMethods} from '../base-state.methods'
import {BaseModel} from '../base.model'
import {createInitialHashmapState, HashmapBaseState} from './hashmap-base.state'

export const withHashmapBaseStore = <V extends BaseModel>() => signalStoreFeature(
  withState<HashmapBaseState<V>>(createInitialHashmapState<V>()),
  withBaseStateMethods(),
  withProps((store) => ({
    keys: computed(() => store.hashMap().keys()),
    entities: computed(() => store.hashMap().values())
  })),
  withMethods((store) => ({

    get(key: Signal<string>): Signal<V[]> {
      return computed(() => store.hashMap().get(key()))
    },

    has(key: string): boolean {
      return store.hashMap().has(key)
    },

    resetMap(map?: Multimap<V>) {
      patchState(store, { hashMap: new Multimap(map) })
    },

    resetCollection(key:string, value: V[]) {
      const hashMap = store.hashMap().set(key, value)
      patchState(store, { hashMap })
    },

    patchMap(map: Multimap<V>) {
      const hashMap = store.hashMap().merge(map)
      patchState(store, {hashMap})
    },

    patchCollection(key: string, collection: V[]) {
      const hashMap = store.hashMap().patch(key, collection)
      patchState(store, { hashMap })
    },

    deleteEntry(key: string) {
      const hashMap = store.hashMap().delete(key)
      patchState(store, { hashMap })
    },

    deleteFromCollection(key: string, id: EntityId) {
      const hashMap = store.hashMap().deleteById(key, id)
      patchState(store, { hashMap })
    },

    resetStore() {
      patchState(store, {...createInitialHashmapState<V>()})
    }

  }))
)
