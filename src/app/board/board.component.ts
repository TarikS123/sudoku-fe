import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BoardResponse } from './board-response.interface';
import { Router } from '@angular/router';


interface Cell {
  value: number | null;
  editable?: boolean;
  highlighted?: boolean; }

interface user{
  id:number;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  constructor(private http: HttpClient, private router:Router) { }
  myBoardFromDB!: BoardResponse; //used on init when getting from API
  id:number | undefined;
  
  
  sudokuBoard: Cell[][] = [
    [{ value: null,editable: true}, { value: null, editable: true},   { value: 1, editable: false },    { value: 9 ,editable: false},      { value: 8, editable: false }, { value: 4 ,editable: false }, { value: 7, editable: false }, { value: 6, editable: false }, { value: null , editable: true}],
   [{ value: 6, editable: false},  { value: null, editable: true },  { value: 9,editable: false },     { value: null,editable: true},      { value: 5,editable: false  }, { value: 7 ,editable: false }, { value: 3,editable: false  }, { value: 8,editable: false  }, { value: null,editable: true  }],
   [{ value:  8,editable: false},   { value: 2, editable: false },    { value: 7 ,editable: false},     { value: null ,editable: true},     { value: 1,editable: false }, { value: null ,editable: true}, { value: null,editable: true }, { value: null ,editable: true}, { value: null ,editable: true}],
   [{ value: 9 ,editable: false},   { value: 6,editable: false },     { value: null ,editable: true},   { value: 3 ,editable:false},     { value: null,editable: true }, { value: 8 ,editable: false}, { value: 1,editable: false }, { value: null ,editable: true}, { value: 5,editable: false}],
   [{ value: 1 ,editable: false},   { value: 8,editable: false },     { value: 5 ,editable: false},      { value: null ,editable: true},     { value: 2,editable: false }, { value: null ,editable: true}, { value: null,editable: true }, { value: 7 ,editable: false}, { value: 3 ,editable: false}],
   [{ value: 3 ,editable: false},   { value: null,editable: true },   { value: null ,editable: true},   { value: null ,editable: true},     { value: null,editable: true }, { value: null ,editable: true}, { value: 2,editable: false }, { value: null ,editable: true}, { value:8 ,editable: false}],
   [{ value: 2 ,editable: false},   { value: 1,editable: false },     { value: null ,editable: true},   { value: null ,editable: true},     { value: null,editable: true }, { value: null ,editable: true}, { value: null,editable: true }, { value: 3 ,editable: false}, { value: 6 ,editable: false}],
   [{value: null, editable: true}, { value: null,editable: true },   { value: null ,editable: true},   { value: 1 ,editable: false},     { value: null,editable: true }, { value: null ,editable: true}, { value: null,editable: true }, { value: null ,editable: true}, { value: 4 ,editable:false}],
   [{value: null, editable: true}, { value: 9,editable: false },     { value: 6 ,editable: false},     { value: null ,editable: true},     { value: null,editable: true }, { value: 2 ,editable: false}, { value: 5,editable: false }, { value: 1 ,editable: false}, { value: null ,editable: true}]

 
 ];
 // fake conection to the db; 

 undoHistory: { value: number | null, row: number, col: number }[] = [];
 eraseMode: boolean = false;


 NormaliseTheBoard (sudokuBoard: Cell[][]): void{
  for(let i=0; i<9; i++)
    for(let j=0; j<9; j++){
      if(this.sudokuBoard[i][j].value==null)this.sudokuBoard[i][j].editable=true;
    }

 }
 undoNumber() {
  if (this.undoHistory.length > 0) {
    const lastMove = this.undoHistory.pop();
    if (lastMove) {
      const { value, row, col } = lastMove;
      const cell = this.sudokuBoard[row][col];
      cell.value = value;
      if (value === null) {
        // Remove user input from the 2D array
        if (this.userInputs[row]) {
          delete this.userInputs[row][col];
        }
      } else {
        // Store user input in the 2D array
        if (!this.userInputs[row]) {
          this.userInputs[row] = [];
        }
        this.userInputs[row][col] = { value, row, col };
      }
    }
  }
}

eraseNumber() {
  if (this.selectedNumber !== null) {
    for (let row = 0; row < this.sudokuBoard.length; row++) {
      for (let col = 0; col < this.sudokuBoard[row].length; col++) {
        const cell = this.sudokuBoard[row][col];
        if (cell.value === this.selectedNumber && cell.editable) {
          cell.value = null;
          return; // Exit the loop after erasing the number
        }
      }
    }
  }
}



 selectedNumber: number | null = null;

  

  convertToCellArray(board: number[][]): Cell[][] {
    return board.map(row =>
      row.map(value => ({
        value: value !== 0 ? value : null,
        editable: value === 0
      }))
    );
  }

  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  userInputs: { value: number, row: number, col: number }[][] = [];
  timer: number = 0;
  intervalId: any;

  ngOnInit() {
    if(!localStorage.getItem('token')){
      this.router.navigate(['/login']);
    }
    const token=localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const options = { headers: headers };
    this.http.get<BoardResponse>('https://sudoku-be.herokuapp.com/table', options)
      .subscribe(
        (response) => {
          this.myBoardFromDB = response;
          console.log('Object fetched successfully', this.myBoardFromDB);

          // interface Cell { JUST FOR REFERENCE
          //   value: number | null; JUST FOR REFERENCE
          //   editable?: boolean; JUST FOR REFERENCE
          //   highlighted?: boolean; } JUST FOR REFERENCE
          for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
              if(this.myBoardFromDB.table[i][j]!=0){
                this.sudokuBoard[i][j].value=this.myBoardFromDB.table[i][j];
              }
              // if(this.myBoardFromDB.table[i][j]>0){
              // this.sudokuBoard[i][j].editable=false;
              // }
              // else{
              // this.sudokuBoard[i][j].editable=true;
              // }
            }
          }
          this.NormaliseTheBoard(this.sudokuBoard);


        },
        (error) => {
          console.error('Error fetching object', error);
        }
      );
    

  }



  isNumberButtonDisabled(number: number): boolean {
    const count = this.countNumberOccurrences(number);
    return count >= 9;
  }

  // Helper method to count the occurrences of a number in the Sudoku board
  countNumberOccurrences(number: number): number {
    let count = 0;
    for (let row = 0; row < this.sudokuBoard.length; row++) {
      for (let col = 0; col < this.sudokuBoard[row].length; col++) {
        if (this.sudokuBoard[row][col].value === number) {
          count++;
        }
      }
    }
    return count;
  }

  highlightNumberOccurrences(number: number) {
    for (let row = 0; row < this.sudokuBoard.length; row++) {
      for (let col = 0; col < this.sudokuBoard[row].length; col++) {
        const cell = this.sudokuBoard[row][col];
        if (cell.value === number) {
          cell.highlighted = true;
        } else {
          delete cell.highlighted;
        }
      }
    }
  }
  

  onCellChange(row: number, col: number) {
    const cellValue = this.sudokuBoard[row][col];
  
    if (!cellValue.editable) {
      return; // Skip updating non-editable cells
    }
  
    if (this.eraseMode) {
      // Erase the cell value
      const previousValue = cellValue.value;
      cellValue.value = null;
  
      // Remove user input from the 2D array
      if (this.userInputs[row]) {
        delete this.userInputs[row][col];
      }
  
      // Store the previous value in the undo history
      this.undoHistory.push({ value: previousValue, row, col });
    } else if (this.selectedNumber !== null) {
      // Check if the selected number already exists in the 3x3 field
      if (!this.isNumberValidInBox(row, col, this.selectedNumber)) {
        alert('This number already exists in the 3x3 field!');
        return;
      }
  
      // Store the previous value in case of undo
      const previousValue = cellValue.value;
  
      cellValue.value = this.selectedNumber;
  
      // Store user input in the 2D array
      if (!this.userInputs[row]) {
        this.userInputs[row] = [];
      }
      this.userInputs[row][col] = { value: this.selectedNumber, row, col };
  
      // Store the user input in the undo history
      this.undoHistory.push({ value: previousValue, row, col });
    } else {
      // If no number is selected, clear the cell value
      const previousValue = cellValue.value;
      cellValue.value = null;
  
      // Remove user input from the 2D array
      if (this.userInputs[row]) {
        delete this.userInputs[row][col];
      }
  
      // Store the previous value in the undo history
      this.undoHistory.push({ value: previousValue, row, col });
    }
  }
  

  toggleEraseMode() {
    this.eraseMode = !this.eraseMode;

  // Reset selectedNumber when exiting erase mode
  if (!this.eraseMode) {
    this.selectedNumber = null;
  }
  }

  isNumberValidInBox(row: number, col: number, number: number): boolean {
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;
  
    for (let i = boxStartRow; i < boxStartRow + 3; i++) {
      for (let j = boxStartCol; j < boxStartCol + 3; j++) {
        const cell = this.sudokuBoard[i][j];
        if (cell.value === number && !this.isCellDeleted(i, j, number)) {
          return false;
        }
      }
    }
  
    return true;
  }
  
  isCellDeleted(row: number, col: number, number: number): boolean {
    return (
      !!this.userInputs[row]?.[col] &&
      (this.userInputs[row][col].value === null ||
        this.userInputs[row][col].value !== number)
    );
  }
  
  
  showNumbersContainer: boolean = false;

  startButtonClicked: boolean = false;

  startTimer() {
    if (this.timer === 0) {
      this.intervalId = setInterval(() => {
        this.timer++;
      }, 1000);
      this.startButtonClicked = true; // Set the flag when the "Start" button is clicked
    }
  }

  // Modify the selectNumber method to check if the "Start" button was clicked
  selectNumber(number: number) {
    this.selectedNumber = number;
    this.highlightNumberOccurrences(number);
    this.eraseMode= false;
  }


  stopTimer() {
    clearInterval(this.intervalId);
  }

  submitBoard() {
    if (this.checkBoard()) {
      this.stopTimer();
      alert(`Congratulations! Sudoku board solved correctly. Time taken: ${this.timer} seconds.`);
      if(!localStorage.getItem('token')){
        this.router.navigate(['/login']);
      }
      const token=localStorage.getItem('token');
      const username=localStorage.getItem('username');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      const options = { headers: headers };
      this.http.get<user>('https://sudoku-be.herokuapp.com/user/id/'+username, options)
        .subscribe(
          (response) => {
            this.id=response.id;
            console.log('ID returned', response);
          },
          (error) => {
            console.error('Error while getting ID', error);
          }
        );
        const payload = {
          tableId: this.myBoardFromDB.id,
          userId: this.id,
          seconds: this.timer
        };

      this.http.post<any>('https://sudoku-be.herokuapp.com/record/app', payload, options)
        .subscribe(
          (response) => {
            
            console.log('Object pushed to backend', response);
            this.router.navigate(['/new']);
          },
          (error) => {
            console.error('Error pushing record to database', error);
          }
        );

    } else {
      alert('Oops! Sudoku board is not solved correctly.');
    }
  }

  checkBoard(): boolean {
    // Check rows
    for (let row = 0; row < this.sudokuBoard.length; row++) {
      const rowValues = this.sudokuBoard[row].map((cell: { value: any; }) => cell.value);
      if (!this.isSetComplete(rowValues)) {
        return false;
      }
    }

    // Check columns
    for (let col = 0; col < this.sudokuBoard[0].length; col++) {
      const colValues = this.sudokuBoard.map((row: { value: any; }[]) => row[col].value);
      if (!this.isSetComplete(colValues)) {
        return false;
      }
    }

    // Check 3x3 grids
    for (let row = 0; row < 9; row += 3) {
      for (let col = 0; col < 9; col += 3) {
        const gridValues = [];
        for (let i = row; i < row + 3; i++) {
          for (let j = col; j < col + 3; j++) {
            gridValues.push(this.sudokuBoard[i][j].value);
          }
        }
        if (!this.isSetComplete(gridValues)) {
          return false;
        }
      }
    }

    return true;
  }

  isSetComplete(values: (number | null)[]): boolean {
    const set = new Set(values);
    set.delete(null);
    return set.size === 9;
  }

  isUserInput(row: number, col: number): boolean {
    const userInput = this.userInputs[row]?.[col];
    return !!userInput && this.sudokuBoard[row][col].value === userInput.value;
  }


  
}
