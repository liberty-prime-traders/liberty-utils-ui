import {HttpErrorResponse} from '@angular/common/http'
import {patchState, signalStoreFeature, withMethods} from '@ngrx/signals'
import {parseError} from '../../lib/reusable/http-utils'
import {ProcessingStatus} from '../processing-status.enum'

export const withBaseStateMethods = () => signalStoreFeature(
  withMethods((store) => ({
    setProcessingStatus: (status: ProcessingStatus) => patchState(store, { processingStatus: status }),
    setHasCache: (hasCache: boolean) => patchState(store, { hasCache }),
    clearError: () => patchState(store, { failureMessages: [] }),
    setLoading: (loading: boolean) => patchState(store, { loading }),
    setError: (error: HttpErrorResponse) => patchState(store, {
      failureMessages: parseError(error),
      processingStatus: ProcessingStatus.FAILURE
    })
  }))
);
