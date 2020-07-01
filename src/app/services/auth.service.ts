import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  accountData: any;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.ngFireAuth.onAuthStateChanged(user => {
      if(user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
   }

  setLocalPersist(){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  loginUser(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {

    return this.ngFireAuth.signInWithEmailAndPassword(email, password);

  }


  registerUser(
    email: string,
    password: string
  ): Promise<any> {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password).then(()=>{
    });
  }

  async sendVerificationMail(){
    return (await this.ngFireAuth.currentUser).sendEmailVerification().then(()=>{
      this.router.navigate(['verify-email']);
    })
  }

  resetPassword(email: string): Promise<void> {
    return this.ngFireAuth.sendPasswordResetEmail(email).then(()=>{
      window.alert('Check your email to reset your password!')
      this.router.navigateByUrl('/login')
    }).catch((error) => {
      window.alert(error);
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }
  // && user.emailVerified !== false

  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  /*
  GoogleAuth(){
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  AuthLogin(provider){
    return this.ngFireAuth.auth.signInWithPopup(provider).then((result) =>{
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/tabs/tab2');
      })
      this.SetUserData(result.user);
      console.log(result.user);
      console.log(this.userData);
    }).catch((error) => {
      window.alert(error);
    })
  }
  */

  createUser(
    firstName: string, lastName: string,  email: string,
    emailVerified: boolean, userType: string,
    photoURL: string, phoneNumber: string, 
  ): Promise<void> {
    var user = firebase.auth().currentUser;
    var userUID = user.uid;
    return this.afStore.doc('users/' + userUID).set({userUID, firstName, lastName, email, emailVerified, userType, photoURL, phoneNumber});
  }
  
  //Data the users can edit of themselves
  updateAccountData(photo, mail, number){
    this.afStore.doc("users/"+this.userData.userUID).update({photoURL : photo, email: mail, phoneNumber: number})
  }

  getUserEmail(){
    return this.userData.email;
  }

  getUserId(){
   // console.log(this.userData.uid)
    return this.userData.uid;
  }

  getUserType(){
    console.log(this.userData.userType)
    return this.userData.userType;
  }

  logOutUser(): Promise<void> {
    return this.ngFireAuth.signOut().then(()=>{
      console.log("Logout successful");
      localStorage.removeItem('user');
      this.router.navigateByUrl('/register');
    });
  }
}
