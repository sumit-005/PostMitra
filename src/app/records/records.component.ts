import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PopupComponent } from '../popup/popup.component';
import { DataService } from '../shared/data.service';
import { Records } from '../shared/data.model';
import * as XLSX from 'xlsx';

import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SelectionModel } from '@angular/cdk/collections';

/** Constants used to fill up our data base. */


@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})


export class RecordsComponent implements OnInit {


  displayedColumns: string[] = ['select', 'name', 'accountno', 'amount', 'totalAmount', 'joiningDate'];
  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel<Records>(true, []);
  records: any;
  loader = true;
  modalRef: BsModalRef;
  fileName;
  jddate: any;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dataService: DataService, private modalService: BsModalService) {
    // Create 100 users


  }

  ngOnInit() {

    this.getRecord();
    this.dataService.reLoad$.subscribe(() => {
      console.log('done');

      this.getRecord();
      // this.dataService.refresh();
    });

  }


  getRecord() {

    this.dataService.getRecords()
      .subscribe((res: any) => {
        this.records = res.records;
        console.log('records', this.records)
      });


    const users: Records[] = [];

    setTimeout(() => {

      for (let i = 1; i <= this.records.length; i++) { users.push((this.records[i])); }
      console.log('users', users)

    }, 2000);
    //  dataSource: MatTableDataSource<Records>;


    if(users){

      this.dataRecords(users);

   }



  }



  dataRecords(users){
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource = new MatTableDataSource(this.records);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('this.dataSource.sort', this.dataSource.sort)
      this.loader = false;
    }, 2000)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');



    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { dateNF: 'mm/dd/yyyy;@', cellDates: true, raw: true });
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    this.fileName = moment(new Date).format('DD-MM-YY');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  openModal(data: any) {
    this.jddate = moment(data.joiningDate).format('DD-MM-YYYY');
    console.log('this.date', this.jddate)

    data.joiningDate = this.jddate;
    console.log(data.joiningDate);

    const initialState = data;
    this.modalRef = this.modalService.show(PopupComponent, { initialState });

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Records): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row._id + 1}`;
  }

}




