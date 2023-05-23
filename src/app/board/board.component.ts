import { Component, OnInit } from '@angular/core';

interface Cell {
  value: number | null;
  editable: boolean;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
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

  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  selectedNumber: number | null = null;
  userInputs: { value: number, row: number, col: number }[][] = [];
  timer: number = 0;
  intervalId: any;

  ngOnInit() {
    
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

  onCellChange(row: number, col: number) {
    const cellValue = this.sudokuBoard[row][col];

    if (cellValue.value === null && this.selectedNumber !== null) {
      cellValue.value = this.selectedNumber;

      // Store user input in the 2D array
      if (!this.userInputs[row]) {
        this.userInputs[row] = [];
      }
      this.userInputs[row][col] = { value: this.selectedNumber, row, col };
    }
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
    if (this.startButtonClicked) {
      this.selectedNumber = number;
    }
  }


  stopTimer() {
    clearInterval(this.intervalId);
  }

  submitBoard() {
    if (this.checkBoard()) {
      this.stopTimer();
      alert(`Congratulations! Sudoku board solved correctly. Time taken: ${this.timer} seconds.`);
    } else {
      alert('Oops! Sudoku board is not solved correctly.');
    }
  }

  checkBoard(): boolean {
    // Check rows
    for (let row = 0; row < this.sudokuBoard.length; row++) {
      const rowValues = this.sudokuBoard[row].map(cell => cell.value);
      if (!this.isSetComplete(rowValues)) {
        return false;
      }
    }

    // Check columns
    for (let col = 0; col < this.sudokuBoard[0].length; col++) {
      const colValues = this.sudokuBoard.map(row => row[col].value);
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
