import {NgClass} from '@angular/common'
import {Component, input} from '@angular/core'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {InputText} from 'primeng/inputtext'
import {Table} from 'primeng/table'
import {BaseModel} from '../../../../api/base-api/base.model'

@Component({
	selector: 'lbu-grid-filter',
	templateUrl: 'grid-filter.component.html',
	imports: [
		IconField,
		InputIcon,
		InputText,
		NgClass
	]
})
export class GridFilterComponent<T extends BaseModel> {
	readonly dataTable = input.required<Table<T>>()
	readonly margin = input<string>('m-2')
	readonly placeholder = input<string>('Search')
}
