import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  private url = 'https://postingo.herokuapp.com';
  // private url = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router,private _snackBar: MatSnackBar){

  }
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['blue-snackbar']
    });
  }

  openErrorSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['red-snackbar'],
    });
  }


  register(data) {

    console.log(data);


    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http
      .post(`${this.url}/user/signup`, data)
      .subscribe(data => {
        this.openSnackBar(`Signup Successfull`,'Close');

        // this.toastr.success(`User Created Succesfully`, 'Success');
        this.router.navigate(['login']);
      }, error => {
        this.authStatusListener.next(false);
        if (error.error.error.errors.email != undefined) {
        this.openErrorSnackBar(`Email already taken`,'Close');
          // this.toastr.error(`Your email id is already used. Please sign-in`, 'Error');
        }
        if (error.error.error.errors.mobileno != undefined) {
        this.openErrorSnackBar(`Mobile no already taken`,'Close');

          // this.toastr.error(`Your mobile no is already taken`, 'Error');
        }

      });
  }
  login(data) {


    const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    this.http
      .post<{ token: string; firstname: string; expiresIn: number; userId: string }>(
        `${this.url}/user/login`,
        data
      )
      .subscribe(response => {
        console.log(response);

        const token = response.token;
        this.token = token;
        const firstname = response.firstname;
        console.log(firstname);

        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate);
          this.openSnackBar(`Welcome ${firstname}`,'Close')
          // this.toastr.success(firstname, 'Welcome');
            this.router.navigate(['/records']);
          }
      }, error => {
          this.authStatusListener.next(false);
          this.openErrorSnackBar(`Incorrect email or password `,`Cancel`)

          // this.toastr.error(`Please check your email Id and Passsword`, 'Error');

        });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/login"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }




  resetPassword(data) {
    // var options = {
    //   API_KEY:"RxLb26ngkrqWNiJsEcoIAB3Kypj4DY97vUPzlVae5SG1uQ0mMH7ra9jk6N5yMUFbcxGe82YAQCzXPmKO",
    //   language: 'english',
    //   route:'qt',
    //   variables: '{AA}',
    //   sender_id: 'SMSIND',
    //   variable_value:'',
    //   // numbers: '9535220552'
    //  };





    const headers = new Headers();
    headers.append('authorization', 'RxLb26ngkrqWNiJsEcoIAB3Kypj4DY97vUPzlVae5SG1uQ0mMH7ra9jk6N5yMUFbcxGe82YAQCzXPmKO');
    headers.append('content-type', 'application/x-www-form-urlencoded');
    headers.append('cache-control', 'no-cache');
     return this.http
      .post(`${this.url}/user/reset`, data);

  }
}
