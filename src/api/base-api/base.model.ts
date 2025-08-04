import {EntityId, EntityMap} from '@ngrx/signals/entities'

export interface BaseModel extends EntityMap<any>{
  id: EntityId | undefined
}
