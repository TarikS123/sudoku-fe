import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LeaderboardResponse } from './leaderboard-response.interface';

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
  leaderboardData: User[] = [];

  

  constructor(private http: HttpClient){}
  ngOnInit(){
    const board=localStorage.getItem('board');
    const token=localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    this.http.get<LeaderboardResponse[]>('https://sudoku-be.herokuapp.com/record/'+ board, options)
        .subscribe(
          (response) => {
              this.lista=response;
          },
          (error) => {
            console.error('Failed to fetch list', error);
          }
        );

       for (let index = 0; index < this.lista.length; index++) {
        this.leaderboardData[index].name=this.lista[index].userId.toString();
        this.leaderboardData[index].time=this.lista[index].seconds;
       
        
       }
       console.log(this.lista);
  }
  

}
