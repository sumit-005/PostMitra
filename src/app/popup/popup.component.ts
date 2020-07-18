import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { DataService } from '../shared/data.service';
import * as moment from 'moment';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})

export class PopupComponent implements OnInit {

  colorTheme = 'theme-blue';
  accountno;
  name;
  amount;
  totalAmount;
  _id;
  joiningDate ;
  userData: any;
  minDate: Date;
  maxDate: Date;
  form: FormGroup;
  public flag: boolean = true;
  date: FormControl;

  constructor(
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    public dataservice: DataService
  ) {

    // const currentYear = new Date().getFullYear();
    // this.minDate = new Date(currentYear - 20, 0, 2);
    // this.maxDate = new Date();
  }

  ngOnInit() {

    // this.joiningDate = new FormControl( moment(this.joiningDate).format('DD-MM-YYYY'));
    // console.log('this.joiningDate', this.joiningDate.value)
    // const datearray = this.joiningDate.split("-");
    // this.joiningDate = datearray[2] + '-' + datearray[1] + '-' + datearray[0];
    // console.log('newdate', this.joiningDate);


  }

  onEdit(form: NgForm) {

    if (form.invalid) {
      return;
    }

    console.log(form.value);

    this.userData = form.value;

    this.userData = { _id: this._id, ...this.userData };



    this.dataservice.updateUser(this.userData, this._id);
    this.dataservice.refresh();
    this.modalRef.hide();

  }


  onDelete() {
    this.dataservice.DeleteUser(this._id)
      .subscribe((res) => {
        this.dataservice.refresh();
        this.modalRef.hide();
      });
  }

  edit(flag) {
    if (flag)
      this.flag = false;
    else
      this.flag = true;
  }


}
