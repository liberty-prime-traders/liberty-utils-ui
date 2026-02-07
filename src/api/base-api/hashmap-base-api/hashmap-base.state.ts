import {Multimap} from '../../../lib/reusable/types/Multimap.type'
import {BaseModel} from '../base.model'
import {BaseState, createInitialState} from '../base.state'

export interface HashmapBaseState<V extends BaseModel> extends BaseState {
  hashMap: Multimap<V>
}

export const createInitialHashmapState =
  <V extends BaseModel>(): HashmapBaseState<V> => ({...createInitialState(), hashMap: new Multimap()})
