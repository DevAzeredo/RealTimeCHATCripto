import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, ChatComponent, FormsModule]
})
export class AppComponent {
  title = 'RealTimeCHATFrontEnd';
  sendMessage() {
    console.log('deu bom:');
    //this.client.publish({ destination: "/app/sendMessage", body: "xello, STOMP" })
  };
}
