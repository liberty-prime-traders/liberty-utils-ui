import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Button} from 'primeng/button';

@Component({
	selector: 'dsp-logged-out',
	imports: [
		Button,
		RouterLink
	],
	templateUrl: './logged-out.component.html',
})
export class LoggedOutComponent {
}
