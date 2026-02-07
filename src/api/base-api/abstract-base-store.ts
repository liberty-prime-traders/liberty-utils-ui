import {HttpErrorResponse} from '@angular/common/http'
import {Signal} from '@angular/core'
import {ProcessingStatus} from '../processing-status.enum'

export interface AbstractBaseStore {
  loading: Signal<boolean>
  hasCache: Signal<boolean>
  processingStatus: Signal<ProcessingStatus>
  failureMessages: Signal<string[]>
  basePath: string
  setProcessingStatus: (processingStatus: ProcessingStatus) => void
  setHasCache: (hasCache: boolean) => void
  clearError(): void
  setError(error: HttpErrorResponse): void
  resetStore(): void
  setLoading(loading: boolean): void
}
