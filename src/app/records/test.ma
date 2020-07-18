import { Component, OnInit, TemplateRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { DataService } from '../shared/data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PopupComponent } from '../popup/popup.component';
import { PageChangedEvent } from 'ngx-bootstrap/pagination/ngx-bootstrap-pagination';
import _ from 'lodash';
import * as moment from 'moment';


@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})


export class RecordsComponent implements OnInit {

  fileName = 'ExcelSheet.xlsx';
  records: any;
  loader = true;
  modalRef: BsModalRef;
  userFilter: any = { amount : '', name: '', accountno: '' };
  totalRecords;
  page = 1;
  smallnumPages: number = 0;
  returnedArray: any;
  showDirectionLinks = true;
  sortName=true;
  sortAmount=true;


  constructor(protected dataService: DataService, private modalService: BsModalService) { }

  ngOnInit() {

    this.getRecords();
    this.dataService.reLoad$.subscribe(() => {
      this.getRecords();
      this.page= 1;
      // this.dataService.refresh();
    });

  }


  getRecords() {

    this.dataService.getRecords()
      .subscribe((res: any) => {
        this.records = res.records;

        for(let i=0;i<this.records.length;i++){
          // moment(this.records[i].joiningDate);
          if(this.records[i].joiningDate !== undefined){
        this.records[i].joiningDate= moment(this.records[i].joiningDate).format("DD-MM-YYYY");
          }
        }
        this.returnedArray = this.records.slice(0, 10);
        this.totalRecords = res.records.length;
        this.loader = false;
      });

    // this.dataService.refresh();

  }

  openModal(data) {
    const initialState = data;
    this.modalRef = this.modalService.show(PopupComponent, { initialState });
  }


  pageChanged(event: PageChangedEvent): void {
    console.log(event);

    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.records.slice(startItem, endItem);
    console.log('returnedArray', this.returnedArray);
  }


  newUsers(){
    this.records = this.records.slice().reverse();
    this.returnedArray = this.records.slice(0, 10);
  }

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');



    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mm/dd/yyyy;@',cellDates:true,raw:true});
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }


  sortname(data){


    if(data === true){
    console.log('returnedArray', this.returnedArray);

    this.returnedArray = _.orderBy(this.returnedArray, [user =>user.name.toLowerCase()], ['asc']);
    console.log('returnedArray', this.returnedArray);

    this.sortName = false;
    }
    else if (data === false){
    console.log('returnedArray', this.returnedArray);

    this.returnedArray = _.orderBy(this.returnedArray, [user =>user.name.toLowerCase()], ['desc']);
    console.log('returnedArray', this.returnedArray);

    this.sortName = true;

    }
  }

    sortamount(data1){

    if(data1 === true){
    this.returnedArray = _.orderBy(this.returnedArray, ['amount'], ['asc']);
    this.sortAmount = false;
    }
    else if (data1 === false){
    this.returnedArray = _.orderBy(this.returnedArray, ['amount'], ['desc']);
    this.sortAmount = true;
    }

  }

  refresh(){
    this.dataService.reLoad$.subscribe(() => {
      this.getRecords();
    });
  }

}
