import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from '../models/app-user';
import { Observable } from 'rxjs';

// Provided in shared module to prevent circular dependencies
@Injectable()
export class UserService {

  private currentUserDoc: AngularFirestoreDocument<AppUser>;
  currentUser: Observable<AppUser>;

  private currentUserId: string;

  constructor(private afs: AngularFirestore) { }

  retrieveUserData(user) {
    this.currentUserDoc = this.afs.doc<AppUser>(`users/${user.uid}`);
    this.currentUser = this.currentUserDoc.valueChanges();
    return this.currentUser;
  }

  storeUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    this.currentUserId = user.uid;

    const data: AppUser = {
      uid: user.uid,
      email: user.email,
      isAdmin: true, // Temporarily set to true
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true});
  }

  get userId (): string {
    return this.currentUserId;
  }

  get userDoc (): AngularFirestoreDocument<AppUser> {
    return this.currentUserDoc;
  }



}
