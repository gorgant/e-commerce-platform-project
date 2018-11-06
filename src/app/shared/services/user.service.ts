import { Injectable } from '@angular/core';
import { SharedModule } from '../shared.module';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';

export interface User {
  uid: string;
  email: string;
  isAdmin: boolean;
  photoURL?: string;
  displayName?: string;
}

@Injectable({
  providedIn: SharedModule
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  retrieveUserData(user) {
    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
  }

  storeUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      isAdmin: true, // Temporarily set to true
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true});
  }
}
