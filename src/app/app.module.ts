import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { BoardComponent } from './board/board.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', redirectTo: '/page', pathMatch: 'full' },
  { path: 'page', component: PageComponent },
  {path: 'board', component: BoardComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    BoardComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule { }
