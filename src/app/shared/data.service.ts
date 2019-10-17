import { Injectable, NgZone } from '@angular/core';
import { PresentForm } from './form.model';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private presentables: PresentForm[] = [];
  private pbUpdated = new Subject<PresentForm[]>();

  constructor(private zone: NgZone, private _snackbar: MatSnackBar, private ipcService: ElectronService) { }

  onCreatePresentable(postData: PresentForm) {
    this.zone.run(() => {
      this.ipcService.ipcRenderer.send('creating', postData);
      this.ipcService.ipcRenderer.once('created', (event, arg) => {
        if (arg.error) {
          this.openSnackBar(arg.error);
        }
        console.log(arg);
      });
    });
  }

  onGetPresentables(user: string) {
    this.ipcService.ipcRenderer.send('getting', user);
    this.ipcService.ipcRenderer.once('got', (event, arg) => {
      if (arg.error) {
        this.openSnackBar(arg.error);
      }
      this.zone.run(() => {
        this.presentables = arg.map(pres => {
          return {
            ...pres,
            led: {
              ...pres.led,
              w1: pres.led.w1 ? pres.led.w1 : '-',
              w5: pres.led.w5 ? pres.led.w5 : '-',
            },
            opw: {
              ...pres.opw,
              w5: pres.opw.w5 ? pres.opw.w5 : '-'
            }
          };
        });
        this.pbUpdated.next(this.presentables);
      });
    });
  }

  onDeletePresentable(presId: number, user: string) {
    this.zone.run(() => {
      const postData = {presId, user};
      this.ipcService.ipcRenderer.send('deleting', postData);
      this.ipcService.ipcRenderer.once('deleted', (event, arg) => {
        if (arg.error) {
          this.openSnackBar(arg.error);
        }
        console.log(arg);
        this.onGetPresentables(user);
      });
    });
  }

  onUpdatePresentable(putData: any, presId: number) {
    this.zone.run(() => {
      const postData = {presId, ...putData};
      this.ipcService.ipcRenderer.send('updating', postData);
      this.ipcService.ipcRenderer.once('updated', (event, arg) => {
        if (arg.error) {
          this.openSnackBar(arg.error);
        }
        console.log(arg);
      });
    });
  }

  getPbUpdateListener() {
    return this.zone.run(() => {
      return this.pbUpdated.asObservable();
    });
  }

  private openSnackBar(message: string) {
    this._snackbar.open(message, 'OK', {
      duration: 5000
    });
  }
}
