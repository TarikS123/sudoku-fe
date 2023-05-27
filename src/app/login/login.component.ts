import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppModule } from '../app.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  loginForm!: FormGroup; 

  
  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      // Prepare the payload with the username and password
      const payload = {
        username: username,
        password: password
      };

      // Make the HTTP POST request
      this.http.post('https://sudoku-be.herokuapp.com/authenticate', payload)
        .subscribe(
          (response) => {
            // Handle the success response here
            console.log('Login successful', response);
            
            console.log(username);
          },
          (error) => {
            // Handle the error response here
            console.error('Login failed', error);
          }
        );

        
    }
  }
}
