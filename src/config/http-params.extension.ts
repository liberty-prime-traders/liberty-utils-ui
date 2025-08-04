import {HttpParams} from '@angular/common/http'

declare module '@angular/common/http' {
	interface HttpParams {
		setNonNull(key: string, value: string): HttpParams
	}
}

HttpParams.prototype.setNonNull = function(this: HttpParams, key: string, value: string) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let httpParams = this
  if (value) {
    httpParams = this.set(key, value)
  }
  return httpParams
}
