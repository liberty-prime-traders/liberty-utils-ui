import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {MessageService} from 'primeng/api'
import {throwError} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class BalanceRefreshService {
  private readonly httpClient = inject(HttpClient)
  private readonly messageService= inject(MessageService)

  triggerRefresh(): void {
    this.httpClient.post('/secured/contacts/refresh-balances', {}).pipe(
      tap(() => {
        this.messageService.add({summary: 'Balances refreshed successfully', severity: 'success'})
        setTimeout(() => window.location.reload(), 500)
      }),
      catchError((e: HttpErrorResponse) => {
        this.messageService.add({summary: 'Failed to refresh contact balances', severity: 'error'})
        return throwError(() => e)
      }),
      first()
    ).subscribe()
  }
}
