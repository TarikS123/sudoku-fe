import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root'
  })
  export class GlobalShareService {
    private boardId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  
    setData(data: string) {
      this.boardId.next(data);
    }
  
    getData() {
      return this.boardId.asObservable();
    }
  }