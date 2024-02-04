import { Component } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, ChatComponent, FormsModule, LoginComponent]
})

export class AppComponent {
  title = 'RealTimeCHAT Crypto';
}
