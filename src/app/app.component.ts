import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PresDialogComponent } from './pres-dialog/pres-dialog.component';
import { DataService } from './shared/data.service';
import { PresentForm } from './shared/form.model';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { BottomsheetService } from './bottomsheet/bottomsheet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  presentables: PresentForm[] = [];
  subs = [new Subscription()];
  authed = false;
  connected: boolean;
  isLoading = false;
  userEmail: string;

  constructor(private zone: NgZone, private bottomSheetService: BottomsheetService, private dialog: MatDialog, private dataService: DataService, private authService: AuthService) {}

  ngOnInit() {
    this.zone.run(() => {
      this.subs = [
        this.dataService.getPbUpdateListener().subscribe((presentables: PresentForm[]) => {
          this.presentables = presentables;
        }),
        this.authService.getAuthListener().subscribe(value => {
          console.log(value);
          this.authed = value;
        }),
        this.authService.getEmailListener().subscribe(value => {
          this.userEmail = value;
          this.dataService.onGetPresentables(value);
        })
      ];
    });
  }

  openDialog() {
    this.dialog.open(PresDialogComponent, {
      width: '70%',
      height: '45%',
      autoFocus: false,
      closeOnNavigation: true
    });
  }

  getPresentables() {
    this.isLoading = true;
    this.dataService.onGetPresentables(this.userEmail);
    this.isLoading = false;
  }

  logout() {
    this.bottomSheetService.openLogoutSheet();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
