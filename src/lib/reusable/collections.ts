import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../../api/base-api/base.model'

export namespace LibertyCollections {

  export const  deduplicateMap =  <K, V extends BaseModel>(map: Map<K, V[]>): Map<K, V[]> => {
    const result = new Map<K, V[]>()
    for (const [k, values] of map) {
      result.set(k, deduplicateArray(values))
    }
    return result
  }


  export const deduplicateArray = <V extends BaseModel>(values: V[]): V[] => {
    if (!Array.isArray(values)) {
      return [values]
    }
    const seen = new Set<EntityId | undefined>()
    return values.filter(v => {
      if (seen.has(v.id)) return false
      seen.add(v.id)
      return true
    })
  }
}
