import { Injectable } from '@angular/core';
import { SharedModule } from '../shared.module';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from '../models/app-user';

@Injectable({
  providedIn: SharedModule
})
export class UserService {

  currentUserId: string;

  constructor(private afs: AngularFirestore) { }

  retrieveUserData(user) {
    this.currentUserId = user.uid;
    return this.afs.doc<AppUser>(`users/${user.uid}`).valueChanges();
  }

  storeUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: AppUser = {
      uid: user.uid,
      email: user.email,
      isAdmin: true, // Temporarily set to true
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true});
  }
}
