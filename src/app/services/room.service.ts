import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './../interfaces/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Light } from '../interfaces/light';
import { Message } from '../interfaces/Message';


@Injectable({
  providedIn: 'root'
})
export class RoomService {

  lightStatus = this.db.doc<Light>('room/light').valueChanges().pipe(
    map(data=>{
        return data.status
    })
  )

  constructor(private db:AngularFirestore) { }

  getUsers(): Observable<User[]> {
    return this.db.collection<User>('users').valueChanges();
  }

  toggleLight(status: boolean) {
    this.db.doc('room/light').set({
      status: !status
    })
  }
  sendMessage(uid:string,body:string) {
    this.db.collection('messages').add({
      uid,
      body,
      createdAt: new Date()
    })
  }

  getMessage(): Observable<Message[]> {
    return this.db.collection<Message>('messages',ref=>ref.orderBy('createdAt','desc').limit(1)).valueChanges();
  }
}
