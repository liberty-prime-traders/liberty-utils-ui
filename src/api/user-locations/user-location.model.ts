import {EntityId} from '@ngrx/signals/entities';
import {BaseModel} from '../base-api/base.model';
import {LibertyLocation} from './liberty-location.enum';

export interface UserLocation extends BaseModel {
	userName?: string
	userId?: EntityId
	location?: LibertyLocation
	startOn?: Date
	endOn?: Date
}
