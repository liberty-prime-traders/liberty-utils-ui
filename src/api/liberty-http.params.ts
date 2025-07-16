import {HttpParams} from '@angular/common/http';

export interface LibertyHttpParams extends Partial<HttpParams> {
	id?: string
	pathParams?: string
}
