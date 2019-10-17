import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuth = false;
  private authListener = new Subject<boolean>();
  private userEmail: string;
  emailListener = new Subject<string>();

  constructor(private zone: NgZone, private _snackbar: MatSnackBar, private ipcService: ElectronService) { }

  onLogin(email: string, password: string) {
    this.userEmail = email;
    this.emailListener.next(email);
    const user = {email, password};
    this.ipcService.ipcRenderer.send('login', user);
    this.ipcService.ipcRenderer.once('loggedin', (event, arg) => {
      if (arg === 'Login successful') {
        this.zone.run(() => {
          this.isAuth = true;
          this.authListener.next(true);
        });
      } else {
        this.zone.run(() => {
          this.openSnackBar(arg);
        });
      }
    });
  }

  onSignup(email: string, password: string) {
    this.userEmail = email;
    this.emailListener.next(email);
    const user = {email, password};
    this.ipcService.ipcRenderer.send('signup', user);
    this.ipcService.ipcRenderer.once('signedup', (event, arg) => {
      if (arg === 'Signup successful') {
        this.zone.run(() => {
          this.isAuth = true;
          this.authListener.next(true);
          this.openSnackBar('Welcome!');
        });
      } else {
        this.zone.run(() => {
          this.openSnackBar(arg);
        });
      }
    });
  }

  getUserEmail() {
    return this.userEmail;
  }

  getAuthListener() {
    return this.authListener.asObservable();
  }

  getEmailListener() {
    return this.emailListener.asObservable();
  }

  getIsAuth() {
    return this.isAuth;
  }

  onLogout() {
    this.isAuth = false;
    this.userEmail = null;
    this.authListener.next(false);
  }

  private openSnackBar(message: string) {
    this._snackbar.open(message, 'OK', {
      duration: 5000
    });
  }
}
