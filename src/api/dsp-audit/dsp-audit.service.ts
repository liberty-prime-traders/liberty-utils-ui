import {HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BaseService} from '../base-api/base.service';
import {DspAudit} from './dsp-audit.model';
import 'config/http-params.extension';
import {DspAuditStore} from './dsp-audit.store';

@Injectable({providedIn: 'root'})
export class DspAuditService extends BaseService<DspAudit> {
	constructor() {
		super(inject(DspAuditStore));
	}
	
	override getHttpParams(snapshotId?: string): HttpParams {
		return new HttpParams().setNonNull('snapshotId', snapshotId);
	}
}
