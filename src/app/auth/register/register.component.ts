import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css',
  '../../../page.css'
]
})
export class RegisterComponent implements OnInit {

  check;
  isLoading = false ;
  form: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {

    this.form = new FormGroup({
      firstname: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      lastname: new FormControl('', {
        validators: [Validators.required]
      }),
      email: new FormControl('', {
        validators: [Validators.required]
      }),
      mblno: new FormControl('', {
        validators: [Validators.required]
      }),
      password: new FormControl('', {
        validators: [Validators.required]
      }),

    });
  }
  onRegister(Data) {
    if (this.form.invalid) {
      return;
    }
    // if(this.form.invalid){
    // const invalid = [];
    // const controls = this.form.controls;
    // for (const name in controls) {
    //   console.log(name);

    //     if (controls[name].invalid) {
    //         invalid.push(name);
    //     }
    // }
    // console.log(invalid);

    // return invalid;
  // }

     this.authService.register(Data.value);


  }

}
