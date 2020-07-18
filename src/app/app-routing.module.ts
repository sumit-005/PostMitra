import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetComponent } from './auth/reset/reset.component';
import { AuthGuard } from './auth/Auth.guard';
import { RecordsComponent } from './records/records.component';
import { AddRecordComponent } from './add-record/add-record.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {path : '',  pathMatch:'full' , redirectTo:'records', canActivate:[AuthGuard] },
  {path : 'login', component: LoginComponent},
  {path : 'dashboard', component: DashboardComponent},
  {path : 'login', component: LoginComponent},
  {path : 'register', component: RegisterComponent},
  {path : 'reset', component: ResetComponent},
  {path : 'records', component: RecordsComponent, canActivate: [AuthGuard]},
  {path : 'add-record', component: AddRecordComponent, canActivate: [AuthGuard]},
  {path : '**', pathMatch:'full' , redirectTo:'records' ,  canActivate:[AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
