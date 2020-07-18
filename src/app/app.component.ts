import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public onlineOffline: boolean = navigator.onLine;
  public userIsAuthenticated = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {


    this.userIsAuthenticated = this.authService.getIsAuth();
    console.log('userIsAuthenticated', this.userIsAuthenticated)
    this.authService.autoAuthUser();
    if(this.onlineOffline)
    localStorage.setItem('status','online');
    else
    localStorage.setItem('status','offline')


  }


}
