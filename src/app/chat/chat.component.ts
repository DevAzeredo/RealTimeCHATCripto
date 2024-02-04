import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Client, IMessage, StompConfig, Versions } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { Message } from './chat.model';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private client: Client = new Client;
  public inMessages: Message[] = [];
  outMessage: string = '';
  crypt: string = '';
  chatCode: string = '';
  username: string = '';
  constructor(private route: ActivatedRoute) {
    const navigationState = history.state;
    this.chatCode = navigationState.code;
    this.username = navigationState.user;
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
      this.client.subscribe('/topic/'+ this.chatCode, (message: any) => {
        this.onMessageReceived(message)
        this.inMessages.push(JSON.parse(message.body));
      });
    };
    this.client.activate();
  }

  onMessageReceived(message: IMessage): string {
    return JSON.parse(message.body).content
  }

  sendMessage() {
    var chatMessage = {
      chatId: this.chatCode,
      content: this.outMessage,
      sender: this.username,
    };
    console.log(chatMessage);
    this.client.publish({ destination: "/app/sendMessage", body: JSON.stringify(chatMessage) });
    this.outMessage = '';
  };
}



