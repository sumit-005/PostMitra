import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetComponent } from './auth/reset/reset.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptor } from '../app/auth/auth.interceptor';
import { RecordsComponent } from './records/records.component';
import { AddRecordComponent } from './add-record/add-record.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopupComponent } from './popup/popup.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    HeaderComponent,
    RecordsComponent,
    AddRecordComponent,
    DashboardComponent,
    PopupComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FilterPipeModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatInputModule,
    NgxDropzoneModule,
    MatTabsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatAutocompleteModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  entryComponents : [
    PopupComponent
 ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
              // {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
            ],



  bootstrap: [AppComponent]
})
export class AppModule { }
