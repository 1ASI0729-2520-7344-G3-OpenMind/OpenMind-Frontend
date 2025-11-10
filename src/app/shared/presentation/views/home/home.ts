import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

}
