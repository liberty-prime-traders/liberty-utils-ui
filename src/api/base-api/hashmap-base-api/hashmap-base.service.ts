import {Signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {get} from 'lodash-es'
import {Multimap, OrMultimap} from '../../../lib/reusable/types/Multimap.type'
import {ProcessingStatus} from '../../processing-status.enum'
import {BaseModel} from '../base.model'
import {MutatorUtils} from '../mutator.utils'
import {HashmapBaseStore} from './hashmap-base-store'

export abstract class HashmapBaseService<STORE extends HashmapBaseStore<V>, V extends BaseModel, PAYLOAD = V>
  extends MutatorUtils<OrMultimap<V>, HashmapBaseStore<V>, PAYLOAD> {

  readonly selectHashMap = this.store.hashMap
  readonly get = (key: Signal<string>) => this.store.get(key)

  protected constructor(protected override readonly _store: STORE){
    super(_store)
  }

  protected override finishSavingWithSuccess(response: OrMultimap<V>) {
    if (Multimap.isAssignableFrom(response)) {
      this.store.patchMap(new Multimap(response))
    } else {
      const mapKey = this.store.mapKey as string
      this.store.patchCollection(get(response, mapKey),  [response])
    }
    this.store.setHasCache(true)
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

  protected override finishDeletingWithSuccess(key: string, id: EntityId){
    this.store.deleteFromCollection(key, id)
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }
}
