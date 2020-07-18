import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/data.service';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css',
    '../../../page.css'
  ]
})
export class ResetComponent implements OnInit {

  isLoading = false;
  check = false;
  flag = false;
  mblno= '';
  form: FormGroup;
  form1: FormGroup;
  form2: FormGroup;
  final= false;
  verficiation = true;

  private otp;

  constructor(private authService: AuthService, private dataService : DataService) { }

  ngOnInit() {


    this.form = new FormGroup({
      mblno: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(10), Validators.minLength(10)]
      }),
    });
    this.form1 = new FormGroup({
      otp: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(6), Validators.minLength(6)]
      }),
    });
    this.form2 = new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required]
      }),
    });
    this.check = false;


  }


  onSubmit(data){

    this.otp = 123456
    if(this.otp === data.value.otp){
      this.final = true;
    }
  }

  private otpGenerate(){

    setTimeout(()=>{ this.verficiation= false;

    console.log(this.verficiation);
    }, 200000);
     return  Math.floor(100000 + Math.random() * 900000)
   }

  onreset(Data) {

    if (this.form.invalid) {
      this.authService.openErrorSnackBar('Invalid Form ', 'Cancel');
      return;
    }
    console.log(this.verficiation);

    this.otp= this.otpGenerate();
    this.isLoading = true;
this.flag = true;
    const details = {otp:this.otp,...Data.value}
  //   this.authService.resetPassword(details)
  //   .subscribe(data => {
  //     console.log('data', data)

  //     if(data){

  //     this.flag= true;
  //     this.dataService.openSnackBar('Password Details sent to Your Mobile no','Close')}
  //     else{
  //       this.verficiation = true;
  //       this.dataService.openErrorSnackBar('Mobile Number Not Registered','Close');
  //     }
  //   });
  }

  onChangePassword(data){

    console.log(data.value,this.mblno);

    const pass= {
      data: data.value,
      mobileno: this.mblno
    }
    this.dataService.changePassword(data)


  }



}
