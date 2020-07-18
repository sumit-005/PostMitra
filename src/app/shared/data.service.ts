import {
  HttpClientModule,
  HttpHeaders,
  HttpClient
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Records } from './data.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient,private _snackBar: MatSnackBar,private router : Router) { }

  private userData = new Subject<any>();


  private url = 'https://postingo.herokuapp.com';
  // private url = 'http://localhost:3000';

  reLoad$ = this.userData.asObservable();

  // private channelData = new Subject<any>();

  // reLoad = this.channelData.asObservable();

  refresh() {
    this.userData.next();
  }


  saveRecord(record: Records) {
    console.log(record);


    return this.http.post<any>(
      `${this.url}/records`,
      record
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['blue-snackbar']
    });
  }

  openErrorSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['red-snackbar'],
    });
  }





  getRecords(){

    return this.http.get<any>(`${this.url}/records`);
  }

  updateUser(user, id) {
    this.http.put<any>(`${this.url}/records/` + id, user)
    .subscribe(res =>{
      console.log(res);

      this.userData.next();
    });

    }

    DeleteUser(id){
      console.log(id);

      return this.http.delete(`${this.url}/records/` + id);

    }




    importFromFile(bstr: string): XLSX.AOA2SheetOpts {
      /* read workbook */
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary',dateNF:'dd/mm/yyyy;@',cellDates:true,raw:true});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(ws, { header: 1 , dateNF:'dd/mm/yyyy;@',raw:true}));

      return data;
    }


    importBulkData(records){
     return  this.http.post<any>(`${this.url}/records/bulkimport` , records);
    }


    changePassword(data){

      this.http.put<any>(`${this.url}/records/changepass` , data)
    .subscribe(res =>{
      console.log(res);


    });

    }
}
