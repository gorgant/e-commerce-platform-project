import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from '../models/app-user';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

// Provided in shared module to prevent circular dependencies
@Injectable()
export class UserService {

  private currentUserDoc: AngularFirestoreDocument<AppUser>;
  private currentUser$: Observable<AppUser>;

  constructor(private afs: AngularFirestore) { }

  getUserById(userId: string): Observable<AppUser> {
    console.log('retreiving user with id', userId);
    return this.afs.doc<AppUser>(`users/${userId}`).valueChanges();
  }

  altStoreUserData(fbUser: firebase.User): Observable<AppUser> {

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${fbUser.uid}`);

    const appUser: AppUser = {
      uid: fbUser.uid,
      email: fbUser.email,
      // isAdmin: undefined,
      displayName: fbUser.displayName,
      photoURL: fbUser.photoURL
    };

    return from(userRef.set(appUser, { merge: true})).pipe(
      mergeMap(() => {
        this.currentUserDoc = this.afs.doc<AppUser>(`users/${fbUser.uid}`);
        this.currentUser$ = this.currentUserDoc.valueChanges();
        return this.currentUser$;
      })
    );
  }

  get userDoc() {
    return this.currentUserDoc;
  }
}
