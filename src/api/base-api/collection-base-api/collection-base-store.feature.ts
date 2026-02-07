import {computed} from '@angular/core'
import {patchState, signalStoreFeature, withMethods, withProps, withState} from '@ngrx/signals'
import {
  EntityId,
  removeAllEntities,
  removeEntity,
  SelectEntityId,
  setAllEntities,
  upsertEntities,
  upsertEntity,
  withEntities
} from '@ngrx/signals/entities'
import {withBaseStateMethods} from '../base-state.methods'
import {BaseModel} from '../base.model'
import {BaseState, createInitialState} from '../base.state'

export const withCollectionBaseStore = <ENTITY extends BaseModel>(selectId: SelectEntityId<ENTITY>) => signalStoreFeature(
  withState<BaseState>(createInitialState()),
  withEntities<ENTITY>(),
  withProps((store) => ({
    selectFirst: computed(() => store.entities()[0])
  })),
  withBaseStateMethods(),
  withMethods((store) => ({

    setAll(entities: ENTITY[]) {
      patchState(store, setAllEntities(entities, {selectId}))
    },

    upsertMany(entities: ENTITY[]) {
      patchState(store, upsertEntities(entities, {selectId}))
    },

    upsert(entity: ENTITY) {
      patchState(store, upsertEntity(entity, {selectId}))
    },

    resetStore() {
      patchState(store, {...createInitialState()})
      patchState(store, removeAllEntities())
    },

    remove(id: EntityId) {
      patchState(store, removeEntity(id))
    }
  }))
)


