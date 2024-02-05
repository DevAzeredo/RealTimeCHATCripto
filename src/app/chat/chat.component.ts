import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Client, IMessage, StompConfig, Versions } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { Message } from './chat.model';
import CryptoJS from 'crypto-js';
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
      this.client.subscribe('/topic/' + this.chatCode, (message: any) => {
        this.inMessages.push(this.parseIncomingMessage(message));
      });
    };
    this.client.activate();
  }



  parseIncomingMessage(message: IMessage): Message {
    var inMessage = {
      chatId: JSON.parse(message.body).chatCode,
      content: this.decryptMessage(JSON.parse(message.body).content, this.crypt),
      sender: this.decryptMessage(JSON.parse(message.body).sender, this.crypt),
    };

    return inMessage;

  }
  encryptMessage(message: string, secretCode: string): string {
    const encryptedMessage = CryptoJS.AES.encrypt(message, secretCode).toString();
    return encryptedMessage;
  }

  decryptMessage(encryptedMessage: string, secretCode: string): string {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretCode);
    const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

    return decryptedMessage;
  }

  sendMessage() {
    var chatMessage = {
      chatId: this.chatCode,
      content: this.encryptMessage(this.outMessage, this.crypt),
      sender: this.encryptMessage(this.username, this.crypt),
    };
    this.client.publish({ destination: "/app/sendMessage", body: JSON.stringify(chatMessage) });
    this.outMessage = '';
  };
}



