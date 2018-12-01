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

  // retrieveUserData(user) {
  //   this.currentUserDoc = this.afs.doc<AppUser>(`users/${user.uid}`);
  //   this.currentUser$ = this.currentUserDoc.valueChanges();
  //   return this.currentUser$;
  // }

  // storeUserData(user: firebase.User) {
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

  //   const data: AppUser = {
  //     uid: user.uid,
  //     email: user.email,
  //     // isAdmin: undefined,
  //     displayName: user.displayName,
  //     photoURL: user.photoURL
  //   };

  //   return userRef.set(data, { merge: true});
  // }

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

  // get localStorageUserData(): AppUser {
  //   const userData = localStorage.getItem('user');
  //   let user: AppUser;
  //   if (userData) {
  //     user = JSON.parse(userData);
  //   }
  //   return user;
  // }



}
