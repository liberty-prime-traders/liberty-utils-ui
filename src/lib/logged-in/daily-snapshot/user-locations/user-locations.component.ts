import {DatePipe, TitleCasePipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {Button} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {SysUser} from '../../../../api/sys-user/sys-user.model';
import {SysUserService} from '../../../../api/sys-user/sys-user.service';
import {LibertyLocation} from '../../../../api/user-locations/liberty-location.enum';
import {UserLocationService} from '../../../../api/user-locations/user-location.service';
import {EnumToDropdownPipe} from '../../../pipes/enum-to-dropdown.pipe';

@Component({
	selector: 'dsp-user-locations',
	imports: [
		TableModule,
		DatePipe,
		TitleCasePipe,
		DropdownModule,
		EnumToDropdownPipe,
		Button
	],
	templateUrl: './user-locations.component.html'
})
export class UserLocationsComponent implements OnInit {
	private readonly userLocationService = inject(UserLocationService);
	private readonly sysUserService = inject(SysUserService);

	readonly LIBERTY_LOCATIONS = LibertyLocation;
	readonly userLocations = this.userLocationService.selectAll;
	readonly loading = this.userLocationService.selectLoading;
	readonly allUsers = this.sysUserService.selectAll;

	ngOnInit() {
		this.userLocationService.fetch();
		this.sysUserService.refetch();
	}

	assignUserToLocation(user: SysUser, location: SelectItem<LibertyLocation>) {
		this.userLocationService.post({userId: user?.id, location: location?.value});
	}
}
