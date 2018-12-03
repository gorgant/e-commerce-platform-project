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

  altStoreUserData(fbUser: firebase.User): Observable<AppUser> {

    console.log('Storing firebase data', fbUser);
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
        console.log('Retreiving user data from Firestore', appUser);
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
