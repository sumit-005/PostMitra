import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../../page.css'
  ]
})
export class LoginComponent implements OnInit {

  check;


  constructor( private authService: AuthService) { }

  ngOnInit() {
  this.check = false;

  }

  onLogin(form: NgForm) {

    if (form.invalid) {
      return;
    }


    this.authService.login(form.value);
  }

}
