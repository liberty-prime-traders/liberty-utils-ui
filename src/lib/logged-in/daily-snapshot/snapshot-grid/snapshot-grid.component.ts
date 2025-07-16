import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';
import {Component, computed, inject, model, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PrimeTemplate} from 'primeng/api';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {DatePicker} from 'primeng/datepicker';
import {Divider} from 'primeng/divider';
import {Drawer} from 'primeng/drawer';
import {TableFilterEvent, TableModule} from 'primeng/table';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {DailySnapshotModel} from '../../../../api/dsp/daily-snapshot.model';
import {DspService} from '../../../../api/dsp/dsp.service';
import {GridFilterComponent} from '../../../reusable/grid-filter/grid-filter.component';
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component';
import {AuditGridComponent} from '../audit-grid/audit-grid.component';
import {SnapshotFormComponent} from '../snapshot-form/snapshot-form.component';

@Component({
	selector: 'dsp-snapshot-grid',
  imports: [
    AuditGridComponent,
    Button,
    Card,
    CurrencyPipe,
    DatePicker,
    DatePipe,
    Divider,
    Drawer,
    PrimeTemplate,
    SnapshotFormComponent,
    TableModule,
    FormsModule,
    ToggleSwitch,
    ReactiveFormsModule,
    TitleCasePipe,
    GridFilterComponent
  ],
	templateUrl: 'snapshot-grid.component.html'
})
export class SnapshotGridComponent extends HasSubscriptionComponent implements OnInit {

	private readonly dspService = inject(DspService);

	private readonly now = new Date();
	private readonly year = this.now.getFullYear();
	private readonly month = this.now.getMonth();

	readonly showAudit = model(false);
	readonly today = new Date(this.year, this.month, this.now.getDate());
	startDate = new Date(this.year, this.month, 1);
	endDate = this.today;

	readonly showAddForm = model(false);
	readonly recordInFocus = signal<DailySnapshotModel | undefined>(undefined);
	readonly snapShotRecords = this.dspService.selectAll;
	readonly loading = this.dspService.selectLoading;
	private readonly filteredTotalNetInflow = signal<number|undefined>(undefined);
	readonly totalNetInflow = computed(() => this.filteredTotalNetInflow() ?? this.unfilteredTotalNetInflow());
	private readonly unfilteredTotalNetInflow = computed(() => this.snapShotRecords().reduce(
		(acc, snapshot) => acc + (snapshot.netInflow ?? 0), 0)
	);

	ngOnInit() {
		this.fetchSnapshots();
	}

	fetchSnapshots() {
		this.dspService.refetch({
				startDate: this.dateToString(this.startDate),
				endDate: this.dateToString(this.endDate)
		});
	}

	openDrawer(snapshot?: DailySnapshotModel) {
		this.dspService.resetProcessingStatus();
		this.recordInFocus.set(snapshot);
		this.showAddForm.set(true);
	}

	onFilter(filterEvent: TableFilterEvent) {
		const sum = filterEvent?.filteredValue?.reduce(
			(acc: number, snapshot: DailySnapshotModel) => acc + (snapshot.netInflow ?? 0), 0
		);
		this.filteredTotalNetInflow.set(sum);
	}

	private dateToString(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth()+1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
}
