import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { NewgameComponent } from './newgame/newgame.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', redirectTo: '/new', pathMatch: 'full' },
  { path: 'new', component: NewgameComponent},
  { path: 'board', component: BoardComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}, 
];

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    LoginComponent,
    SignupComponent,
    NavigationBarComponent,
    NewgameComponent,
    
    
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule { }
