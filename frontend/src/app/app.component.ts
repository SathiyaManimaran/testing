import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class AppComponent implements OnInit {

  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://backend-service:8080/api/hello', {responseType: 'text'})
      .subscribe((data: string) => {
        this.message = data;
      });
  }
}