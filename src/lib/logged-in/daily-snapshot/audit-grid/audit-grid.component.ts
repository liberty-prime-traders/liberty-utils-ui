import {DatePipe} from '@angular/common';
import {Component, computed, effect, inject, input, OnInit, signal} from '@angular/core';
import {FilterService, SortMeta} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {DspAuditService} from '../../../../api/dsp-audit/dsp-audit.service';
import {DailySnapshotModel} from '../../../../api/dsp/daily-snapshot.model';
import {DailySnapshotLabelsPipe} from '../../../pipes/daily-snapshot-labels.pipe';

@Component({
	selector: 'dsp-audit-grid',
	templateUrl: './audit-grid.component.html',
	imports: [
		TableModule,
		DatePipe,
		DailySnapshotLabelsPipe
	],
	providers: [DailySnapshotLabelsPipe]
})
export class AuditGridComponent implements OnInit {
	private readonly dspAuditService = inject(DspAuditService);
	private readonly filterService = inject(FilterService);
	private readonly dailySnapshotLabelsPipe = inject(DailySnapshotLabelsPipe);

	readonly fieldNameStartsWithFilter = {label: 'Starts With', value: 'fieldNameStartsWith'};
	readonly auditRecords = computed(() => this.dspAuditService.selectAll());
	readonly loading = this.dspAuditService.selectLoading;
	readonly multiSortMeta: SortMeta[] = [
		{field: 'fieldName', order: 1},
		{field: 'changedOn', order: 2}
	];

	private readonly auditFetched = signal(false);
	readonly snapshotRecord = input<DailySnapshotModel>();

	constructor() {
		effect(() => {
			const snapshotId = this.snapshotRecord()?.id;
			if (snapshotId && !this.auditFetched()) {
				this.dspAuditService.refetch(String(snapshotId));
				this.auditFetched.set(true);
			}
		});
	}

	ngOnInit() {
		this.registerFieldNameFilter();
	}

	private registerFieldNameFilter() {
		this.filterService.register(this.fieldNameStartsWithFilter.value, (fieldName: string, searchText: string) => {
			if (!searchText || !fieldName || searchText.trim() === '') {
				return true;
			}
			const transformedFieldName = this.dailySnapshotLabelsPipe.transform(fieldName);
			if (transformedFieldName) {
				return transformedFieldName.toLowerCase().startsWith(searchText.toLowerCase());
			}
			return false;
		});
	}
}
