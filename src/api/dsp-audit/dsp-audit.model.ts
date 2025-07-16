import {BaseModel} from '../base-api/base.model';

export interface DspAudit extends BaseModel {
	changedBy?: string
	changedOn?: Date
	fieldName?: string
	oldValue?: string
	newValue?: string
}
