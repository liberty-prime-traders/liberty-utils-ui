import {computed} from '@angular/core'
import {patchState, signalStoreFeature, withMethods, withProps, withState} from '@ngrx/signals'
import {
  EntityId, removeAllEntities,
  removeEntity, SelectEntityId,
  setAllEntities,
  upsertEntity,
  withEntities
} from '@ngrx/signals/entities'
import {ProcessingStatus} from '../processing-status.enum'
import {BaseModel} from './base.model'
import {BaseState, createInitialState} from './base.state'

export const withBaseStore = <ENTITY extends BaseModel>(selectId: SelectEntityId<ENTITY>) => signalStoreFeature(
  withState<BaseState>(createInitialState()),
  withEntities<ENTITY>(),
  withProps((store) => ({
    selectFirst: computed(() => store.entities()[0])
  })),
  withMethods((store) => ({

    setAll(entities: ENTITY[]) {
      patchState(store, setAllEntities(entities, {selectId}))
    },

    upsert(entity: ENTITY) {
      patchState(store, upsertEntity(entity, {selectId}))
    },

    setProcessingStatus(processingStatus: ProcessingStatus) {
      patchState(store, {processingStatus})
    },

    setError<T>(error: T) {
      patchState(store, {failureMessages: parseError(error)})
      this.setProcessingStatus(ProcessingStatus.FAILURE)
    },

    resetStore() {
      patchState(store, {...createInitialState()})
      patchState(store, removeAllEntities())
    },

    setLoading(loading: boolean) {
      patchState(store, {loading})
    },

    remove(id: EntityId) {
      patchState(store, removeEntity(id))
    }

  }))
)

const parseError = (error: any): string[] => {
  if (error === null || error.status !== 400) {
    return ['Unknown Error, Contact Admin']
  }
  let err = []
  if (error.status === 400) {
    if (typeof error.error === 'string') {
      err = [error.error]
    } else if (error.error instanceof Array) {
      err = error.error
    } else if ('message' in error.error) {
      err = [error.error['message']]
    }
  }
  return err
}
