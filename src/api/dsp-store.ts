import {patchState, signalStore, withMethods, withState} from '@ngrx/signals'
import {EntityId, removeEntity, setAllEntities, upsertEntity, withEntities} from '@ngrx/signals/entities'
import {DailySnapshotModel} from './daily-snapshot.model'
import {createInitialState, DspState} from './dsp.state'
import {ProcessingStatus} from './processing-status.enum'

export const DspStore = signalStore(
	{providedIn: 'root'},
	withState<DspState>(createInitialState()),
	withEntities<DailySnapshotModel>(),
	withMethods((store) => ({
		
		setAll(entities: DailySnapshotModel[]) {
			patchState(store, setAllEntities(entities))
			this.setProcessingStatus(ProcessingStatus.SUCCESS)
		},
		
		upsert(dailySnapshot: DailySnapshotModel) {
			patchState(store, upsertEntity(dailySnapshot))
			this.setProcessingStatus(ProcessingStatus.SUCCESS)
		},
		
		setProcessingStatus(processingStatus: ProcessingStatus) {
			patchState(store, {processingStatus})
		},
		
		setError<T>(error: T) {
			patchState(store, {failureMessages: parseError(error)})
			this.setProcessingStatus(ProcessingStatus.FAILURE)
		},
		
		setLoading(loading: boolean) {
			patchState(store, {loading})
		},
		
		remove(id: EntityId) {
			patchState(store, removeEntity(id))
		}
		
	}))
)

const parseError = (error: any): string[] => {
	if (error === null || error.status !== 400) {
		return ['Unknown Error, Contact Admin']
	}
	let err = []
	if (error.status === 400) {
		if (typeof error.error === 'string') {
			err = [error.error]
		} else if (error.error instanceof Array) {
			err = error.error
		} else if ('message' in error.error) {
			err = [error.error['message']]
		}
	}
	return err
}
