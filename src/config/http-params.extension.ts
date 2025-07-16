import {HttpParams} from '@angular/common/http';

declare module '@angular/common/http' {
	interface HttpParams {
		setNonNull(key: string, value: any): HttpParams
	}
}

HttpParams.prototype.setNonNull = function(this: HttpParams, key: string, value: any) {
  let httpParams = this;
  if (value) {
    httpParams = this.set(key, value);
  }
  return httpParams;
};
