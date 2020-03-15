import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  user$ = this.afAuth.user;

  login() {
    this.afAuth.auth.signInAnonymously().then(result => {
      this.db.doc(`users/${result.user.uid}`).set({
        uid: result.user.uid,
        leftPosition: Math.floor(Math.random() * 800) + 'px',
        avatarId: 'pet-' + Math.floor(Math.random() * 10)
      });
    });
  }

  logout(uid: string) {
    this.db.doc(`users/${uid}`).delete();
  }
}
