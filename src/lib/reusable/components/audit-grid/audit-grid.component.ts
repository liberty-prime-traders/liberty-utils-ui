import {DatePipe} from '@angular/common'
import {Component, computed, effect, inject, input, OnInit, untracked} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {FilterService} from 'primeng/api'
import {TableModule} from 'primeng/table'
import {DspAuditService} from '../../../../api/dsp-audit/dsp-audit.service'
import {GridFilterComponent} from '../grid-filter/grid-filter.component'
import {AuditFieldLabelPipe} from '../../pipes/audit-field-label.pipe'
import {AuditFieldLabelService} from '../../services/audit-field-label.service'

@Component({
	selector: 'dsp-audit-grid',
	templateUrl: './audit-grid.component.html',
  imports: [
    TableModule,
    DatePipe,
    AuditFieldLabelPipe,
    GridFilterComponent
  ]
})
export class AuditGridComponent implements OnInit {
	private readonly dspAuditService = inject(DspAuditService)
	private readonly filterService = inject(FilterService)
	private readonly auditFieldLabelService = inject(AuditFieldLabelService)

	readonly fieldNameStartsWithFilter = {label: 'Starts With', value: 'fieldNameStartsWith'}
	readonly auditRecords = computed(() => this.dspAuditService.selectAll())
	readonly loading = this.dspAuditService.selectLoading

  readonly urlSuffix = input.required<string>()
  readonly auditSourceId = input.required<EntityId | undefined>()

	private readonly refetchAudit = effect(() => {
    const auditSourceId = this.auditSourceId()
    if (auditSourceId) {
      untracked(() => this.dspAuditService.refetchAudits(this.urlSuffix(), String(auditSourceId)))
    }
  })

	ngOnInit() {
		this.registerFieldNameFilter()
	}

	private registerFieldNameFilter() {
		this.filterService.register(this.fieldNameStartsWithFilter.value, (fieldName: string, searchText: string) => {
			if (!searchText || !fieldName || searchText.trim() === '') {
				return true
			}
			const transformedFieldName = this.auditFieldLabelService.getLabel(fieldName)
			if (transformedFieldName) {
				return transformedFieldName.toLowerCase().startsWith(searchText.toLowerCase())
			}
			return false
		})
	}
}
