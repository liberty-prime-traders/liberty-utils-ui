import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {mergeMap, Observable, throwError} from 'rxjs'
import {LbuOktaService} from './lbu-okta.service'
import {LbuEnvironment} from '../environments/environment'

@Injectable()
export class LbuHttpInterceptor implements HttpInterceptor {
	private readonly dspOktaService = inject(LbuOktaService)

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
	    return this.dspOktaService.accessToken$.pipe(
		    mergeMap(accessToken => {
			    if (!accessToken?.accessToken) {
				    console.error('No access token available')
				    return throwError(() => 'Access token missing')
			    }
			    req = req.clone({
				    url: `${LbuEnvironment.getBaseUrl()}${req.url}`,
				    setHeaders: {
					    'Authorization': `Bearer ${accessToken.accessToken}`
				    }
			    })
			    return next.handle(req)
		    })
	    )
    }

}
