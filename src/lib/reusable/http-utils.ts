import {HttpErrorResponse} from '@angular/common/http'

export const parseError = (error: HttpErrorResponse): string[] => {
  if (error === null || error.status === undefined) {
    return ['Unknown Error, Contact Admin']
  }
  let err = []
  if (typeof error.error === 'string') {
    err = [error.error]
  } else if (error.error instanceof Array) {
    err = error.error
  } else if ('message' in error.error) {
    err = [error.error['message']]
  }

  return err
}
