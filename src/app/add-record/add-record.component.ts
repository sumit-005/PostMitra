import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { Router } from '@angular/router';
import { fast2sms } from 'fast2sms';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material';




export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },

};

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.component.html',
  styleUrls: ['./add-record.component.css',
    '../records/records.component.css'
  ],
  providers: [
    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddRecordComponent implements OnInit {

  form: FormGroup;
  idate: any;
  currentTime: any;
  minDate: Date;
  maxDate: Date;
  flag: Boolean = true;
  date = new FormControl(new Date());
  importRecords: any = [];
  events: string[] = [];
  headers = [];
  totalMonths: any;
  TotalAmount;
  todayDate;
  amount: any
  loader = false;
  totalamount: any;

  viewTable: boolean = false;
  jdate;

  // date = new FormControl(moment().format('DD-MM-YYYY'));


  constructor(protected dataService: DataService, private router: Router) {

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date();

  }

  ngOnInit() {


    this.importRecords = null;

    this.form = new FormGroup({

      name: new FormControl('', {
        validators: [Validators.required]
      }),
      accountno: new FormControl('', {
        validators: [Validators.required]
      }),
      joiningDate: new FormControl('', {
        validators: [Validators.required]
      }),
      amount: new FormControl('', {
        validators: [Validators.required]
      }),
      totalAmount: new FormControl('', {
        validators: [Validators.required]
      }),

    });
  }


  files: File[] = [];

  config;
  accept = '.xlsx,.xls'
  mutiple = false;

  onSelect($event) {


    this.files.push(...$event.addedFiles);

    if (this.files.length > 1) {
      this.files.splice(1);
      console.log('files', this.files)
      this.dataService.openErrorSnackBar('Import Only SingleFile', 'Close');

    }

    if (this.files.length === 1) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {

        const bstr: string = e.target.result;
        const data = <any[]>this.dataService.importFromFile(bstr);
        this.headers = ['no', 'name', 'accountno', 'amount', 'totalAmount', 'cardnumber', 'default', 'joiningDate'];



        const importedData = data.slice(1, -1);

        let filterdData = importedData.filter(arr => {
          return arr.length === 8 || arr.length === 5
        });

        filterdData = filterdData.slice(1);

        this.importRecords = filterdData.map(arr => {

          console.log(arr.length);

          if (arr.length) {

          }

          const obj: any = {};
          for (let i = 0; i < this.headers.length; i++) {

            const k = this.headers[i];
            obj[k] = arr[i];
          }
          return obj;
        });

      };
      reader.readAsBinaryString(this.files[0]);
    }
    if (this.files.length > 1) {
      this.dataService.openErrorSnackBar('Import Only SingleFile', 'Close');
    }

  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    this.viewTable = false;
    this.importRecords = null;
  }


  changedate(date){
    this.jdate = moment(date);
    this.takeAmount();

  }
  takeAmount() {


    let curDate = moment(new Date());

    const admission = moment(this.jdate).startOf('month');
    const discharge = moment(curDate).startOf('month');


    this.totalMonths = discharge.diff(admission, 'months') + 1;

    if (this.totalMonths !== undefined) {
      this.totalamount = this.amount * this.totalMonths;
    }

  }
  onSubmit(Data) {


    const Record = Data.value;

    if (this.totalamount !== Record.totalAmount) {
      this.dataService.openErrorSnackBar('Total Amount is Wrong', 'Close');
      return true;
    }


    if (this.form.invalid) {
      this.dataService.openErrorSnackBar('Please Fill the form Correctly', 'Close');
      return true;
    }


    if (Data.value.joiningDate === null) {
      this.dataService.openErrorSnackBar('Please Fill the Date Correctly', 'Close');
      return true
    }


    console.log(Record);


    this.dataService.saveRecord(Record)
      .subscribe((res: any) => {
        if (res.message === 'Account number already exist') {
          this.dataService.openErrorSnackBar(res.message, 'Cancel');
          // this.toastr.error(res.message, 'Error');
        }
        else {
          this.form.reset();
          this.dataService.openSnackBar(res.message, 'Cancel');
          // this.router.navigate(['/records']);
        }
      });


  }



  onUpload() {
    if (this.importRecords !== null && this.files.length === 1)
      this.viewTable = true;
  }


  importData() {

    for (let i = 0; i < this.importRecords.length; i++) {
      delete this.importRecords[i].no;
    }
    console.log('importRecords', this.importRecords)
    this.viewTable = false;
    this.loader = true;


    this.dataService.importBulkData(this.importRecords)
      .subscribe(res => {
        console.log(res);


        if (res.error === true) {
          this.loader = false;
          this.dataService.openErrorSnackBar(res.message, 'Cancel')

        }
        else if (res.message ==="Records Imported Successfully."){
          this.loader =false;
          this.router.navigate(['/records']);
          this.dataService.openSnackBar(res.message, 'OK')


        }
      })




  }




}
