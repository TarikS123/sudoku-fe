import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LeaderboardResponse } from './leaderboard-response.interface';
import { GlobalShareService } from '../shared-data/globalShareService';

interface User {
  name: string | null;
  time: number | null;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})



export class LeaderboardComponent implements OnInit{
  lista: LeaderboardResponse[] = [];

  

  constructor(private http: HttpClient){}
  ngOnInit(){
    const board=sessionStorage.getItem('board');
    const token=localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    this.http.get<LeaderboardResponse[]>('https://sudoku-be.herokuapp.com/record/'+ board, options)
        .subscribe(
          (response) => {
              this.lista=response;
              console.log(this.lista);
          },
          (error) => {
            console.error('Failed to fetch list', error);
          }
        );

  }
  

}
