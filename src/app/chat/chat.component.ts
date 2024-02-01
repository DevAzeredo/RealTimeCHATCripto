import { Component } from '@angular/core';
import { Client, IMessage, StompConfig, Versions } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private client: Client = new Client;
  public messages: string[] = [];
  constructor() {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const stompConfig: StompConfig = {
      stompVersions: new Versions(['1.1', '1.0']),
      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/ws');
      }
    };

    this.client = new Client(stompConfig);
    this.client.activate();
    this.client.subscribe('/topic/public', this.onMessageReceived);
  }
  onMessageReceived(message: IMessage): void {
    console.log('deu bom:',message);
  }



  sendMessage() {
    console.log('deu sss:');

    var chatMessage = {
      Chat:1,
      content: "mensagme que enviei do angular",
      Id:1

  };

    this.client.publish({ destination: "/app/sendMessage", body: JSON.stringify(chatMessage)});
  };
}



