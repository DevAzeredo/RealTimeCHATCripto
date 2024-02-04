import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Client, IMessage, StompConfig, Versions } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private client: Client = new Client;
  public inMessages: string[] = [];
  outMessage: string = '';
  crypt: string = '';
  constructor() {
    this.inMessages = [];
  }
  ngOnInit(): void {
    this.setUpWebSocketClient();
  }

  setUpWebSocketClient() {
    const stompConfig: StompConfig = {
      stompVersions: new Versions(['1.1', '1.0']),
      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/ws');
      }
    };
    this.client = new Client(stompConfig);
    this.client.onConnect = () => {
      console.log('Conexão estabelecida com sucesso. Inscrevendo-se...');
      this.client.subscribe('/topic/public', (message: any) => {
        this.onMessageReceived(message)
        this.inMessages.push(JSON.parse(message.body).content);
      });
    };
    this.client.activate();
  }

  onMessageReceived(message: IMessage): string {
    return JSON.parse(message.body).content
  }

  sendMessage() {
    var chatMessage = {
      Chat: 1,
      content: this.outMessage,
      Id: 1
    };
    this.client.publish({ destination: "/app/sendMessage", body: JSON.stringify(chatMessage) });
    this.outMessage = '';
  };
}



