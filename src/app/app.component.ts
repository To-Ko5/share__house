import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RoomService } from './services/room.service';
import { tap, skip } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { Item } from './interfaces/item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'share-house';

  users$ = this.roomService.getUsers();
  user$ = this.authService.user$;
  lightStatus$ = this.roomService.lightStatus.pipe(
    tap(status => this.lightStatus = status)
  )

  lightStatus:boolean;
  messages = {};

  items = new Array(13);
  setItems: Item[] = [];

  id = 'qDuKsiwS5xw'
  player: YT.Player;
  playerVars = {
    controls: 0
  }

  form = this.fb.group({
    body: ['',Validators.required]
  });
  constructor(private authService: AuthService,
    private roomService: RoomService,
    private fb: FormBuilder
    ) {
      this.roomService.getMessage().pipe(skip(1)).subscribe(messages => {
        const message = messages[0];
        if(!this.messages[message.uid]) {
          this.messages[message.uid] = []
        }
          this.messages[message.uid].unshift(message.body);
          setTimeout(()=>{
            this.messages[message.uid].pop();
          },5000)
      })
  }

  login(){
    this.authService.login()
  }

  logout(uid: string){
    this.authService.logout(uid)
  }

  toggleLight(){
    this.roomService.toggleLight(this.lightStatus);
  }
  sendMessage(uid:string) {
    this.roomService.sendMessage(
      uid,
      this.form.value.body
    )
    this.form.reset();
  }
  addItem(i: number) {
    this.setItems.push({
      id: i,
      size: 'm'
    });
  }
  changeSize(index:number, size: 's' | 'm' | 'l') {
    this.setItems[index].size = size
  }

  savePlayer(player) {
    this.player = player;
    this.player.playVideo();
    this.player.mute();
  }
  onStateChange(event) {
    console.log('player state', event.data);
  }
}
