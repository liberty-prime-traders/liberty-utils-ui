import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {mergeMap, Observable, throwError} from 'rxjs'
import {DspOktaService} from './dsp-okta.service'
import {environment} from '../environments/environment'

@Injectable()
export class DspHttpInterceptor implements HttpInterceptor {
	private readonly dspOktaService = inject(DspOktaService)
	
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	    return this.dspOktaService.accessToken$.pipe(
		    mergeMap(accessToken => {
			    if (!accessToken?.accessToken) {
				    console.error('No access token available')
				    return throwError(() => 'Access token missing')
			    }
			    req = req.clone({
				    url: `${environment.BASE_URL}${req.url}`,
				    setHeaders: {
					    'Authorization': `Bearer ${accessToken.accessToken}`
				    }
			    })
			    return next.handle(req)
		    })
	    )
    }
	
}
