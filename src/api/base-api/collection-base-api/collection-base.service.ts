import {EntityId} from '@ngrx/signals/entities'
import {isNil} from 'lodash-es'
import {ProcessingStatus} from '../../processing-status.enum'
import {BaseModel} from '../base.model'
import {MutatorUtils} from '../mutator.utils'
import {CollectionBaseStore} from './collection-base.store'


export abstract class CollectionBaseService<
  RESPONSE extends BaseModel,
  STORE extends CollectionBaseStore<RESPONSE> = CollectionBaseStore<RESPONSE>
> extends MutatorUtils<RESPONSE, STORE> {

  readonly selectFirst = this.store.selectFirst
  readonly selectAll = this.store.entities

  protected constructor(protected override readonly _store: STORE) {
    super(_store)
  }

  protected override finishSavingWithSuccess = (response: RESPONSE | RESPONSE[], idParam?: EntityId)=> {
    const result = this.prepareResponse(response, idParam)
    if (Array.isArray(result)) {
      if (this.apiRequestConfig().upsertOnSuccess) {
        this.store.upsertMany(result)
      } else {
        this.store.setAll(result)
      }
    } else if (!isNil(result)) {
      this.store.upsert(result)
    }
    this.store.setHasCache(true)
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

  protected override finishDeletingWithSuccess = (id: EntityId)=> {
    this.store.remove(id)
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

  protected prepareResponse(body: RESPONSE | RESPONSE[], idParam?: EntityId): any {
    return idParam ? [{...body, id: idParam}] : body
  }

}
