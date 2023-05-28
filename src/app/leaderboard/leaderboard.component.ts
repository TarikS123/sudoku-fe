import { Component, OnInit } from '@angular/core';
//import { LeaderboardService } from 'path/to/leaderboard.service'; // Import your leaderboard service

interface User {
  name?: string | null;
  time?: number | null
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})



export class LeaderboardComponent {
  leaderboardData: User[] = [{name:'kenan',time:35},{name:'kenan',time:35},{name:'kenan',time:35},{name:'kenan',time:35},{name:'kenan',time:35},{name:'kenan',time:35},{name:'kenan',time:35},{name:'kenan',time:35}];

  // constructor(private leaderboardService: LeaderboardService) {} // Inject the leaderboard service
  // ngOnInit() {
  //   this.loadLeaderboardData();
  // }

  // loadLeaderboardData() {
  //   this.leaderboardService.getLeaderboardData().subscribe(
  //     (data: any[]) => {
  //       this.leaderboardData = data;
  //     },
  //     (error: any) => {
  //       console.log('Failed to load leaderboard data:', error);
  //     }
  //   );
  // }
}
