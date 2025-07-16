import {EntityId, EntityState} from '@ngrx/signals/entities';

export interface BaseModel extends EntityState<BaseModel>{
  id: EntityId
}
