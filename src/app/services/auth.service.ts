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
  ) 
  {
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

  loginUser( //logs in user
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {

    return this.ngFireAuth.signInWithEmailAndPassword(email, password);

  }


  registerUser(  //registers user as an authorized firebase account
    email: string,
    password: string
  ): Promise<any> {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password).then(()=>{
    });
  }

  async sendVerificationMail(){ //sends user a verification email
    return (await this.ngFireAuth.currentUser).sendEmailVerification().then(()=>{
      this.router.navigate(['verify-email']);
    })
  }

  resetPassword(email: string): Promise<void> { // sends a resetPassword email
    return this.ngFireAuth.sendPasswordResetEmail(email).then(()=>{
      window.alert('Check your email to reset your password!')
      this.router.navigateByUrl('/login')
    }).catch((error) => {
      window.alert(error);
    });
  }

  get isLoggedIn(): boolean { // returns if the user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }
  // && user.emailVerified !== false

  get isEmailVerified(): boolean { //gets if user's email is verified or not to allow log in
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  createUser( //creates user
    firstName: string, lastName: string, school: string,  email: string,
    emailVerified: boolean, phoneNumber: string, points: Number, type: string
  ){
    var user = firebase.auth().currentUser;
    var userUID = user.uid;
    this.afStore.doc('users/' + userUID).set({userUID, firstName, lastName, school, email, emailVerified, phoneNumber, points, type});
    return userUID;
  }
  
  //Data the users can edit of themselves
  updateAccountData(photo, mail, number){
    this.afStore.doc("users/"+this.userData.userUID).update({photoURL : photo, email: mail, phoneNumber: number})
  }

  getUserEmail(){ //returns the user's email
    return this.userData.email;
  }

  getUserId(){ // returns the user's id
    return this.userData.uid;
  }

  getUserType(){ // gets the user type either student or administrator. In place for the future.
    console.log(this.userData.userType)
    return this.userData.userType;
  }

  logOutUser(): Promise<void> { // signs out user and removes them from local storage
    return this.ngFireAuth.signOut().then(()=>{
      console.log("Logout successful");
      localStorage.removeItem('user');
      this.router.navigateByUrl('/register');
    });
  }
}
