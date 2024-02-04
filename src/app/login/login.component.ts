import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  chatCode: string = '';
  username: string = '';

  constructor(private router: Router) { }

  enterChat() {
    if (this.chatCode.trim() !== '' && this.username.trim() !== '') {
      this.router.navigateByUrl('/chat', { state: { code: this.chatCode, user: this.username } });
    } else {
      alert('Por favor, preencha o código do chat e seu nome de usuário.');
    }
  }

}
