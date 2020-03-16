import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { User } from "./../interfaces/user";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Light } from "../interfaces/light";
import { Message } from "../interfaces/Message";
import { Youtube } from '../interfaces/youtube';

@Injectable({
  providedIn: "root"
})
export class RoomService {
  lightStatus$ = this.db
    .doc<Light>("room/light")
    .valueChanges()
    .pipe(
      map(data => {
        return data.status;
      })
    );

    youtubeId$: Observable<string> = this.db
    .doc<Youtube>("room/youtube")
    .valueChanges()
    .pipe(
      map(data => {
        return data.id;
      })
    );

  constructor(private db: AngularFirestore) {}

  getUsers(): Observable<User[]> {
    return this.db.collection<User>("users").valueChanges();
  }

  toggleLight(status: boolean) {
    this.db.doc("room/light").set({
      status: !status
    });
  }
  sendMessage(uid: string, body: string) {
    this.db.collection("messages").add({
      uid,
      body,
      createdAt: new Date()
    });
  }

  getMessage(): Observable<Message[]> {
    return this.db
      .collection<Message>("messages", ref =>
        ref.orderBy("createdAt", "desc").limit(1)
      )
      .valueChanges();
  }

  changeYoutube(url: string) {
    const matcher = url.match(/https:\/\/www\.youtube\.com\/watch\?v=(.+)/);

    if (matcher) {
      const youtubeId = matcher[1]
      this.db.doc('room/youtube').set({
        id: youtubeId
      })
    }
  }
}
