import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
//import { DatePipe } from '@angular/common';
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase';
import { User } from '../models/user.interface';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root',
  
})
export class FirestoreService {
  userId; user;
  public db;
  
  constructor(public firestore: AngularFirestore,  /*private datePipe: DatePipe,*/ public ngFireAuth: AngularFireAuth,) {
    //this.user = JSON.parse(localStorage.getItem('user'));
    //this.userId = this.user.uid
    this.db = firebase.firestore();
   }

//Fence Methods
   addFence(col_name, id:string, name:string, pop: number): Promise<void> {
    return this.firestore.doc(col_name + "/" + id).set({id, name, pop});
  }

  updateFence(col_name, id: string, time, value){
    this.db.doc(col_name + "/"+id).update({"population" : value})
  }  

//returns ALL fences in a given fence collection
getAllFences(doc): AngularFirestoreCollection<any> {
  return this.firestore.collection(doc);
}

//gets the details of a particular document
getDetail(doc:string, val: string): AngularFirestoreDocument<any>{
  return this.firestore.collection(doc).doc(val);
}



//Legacy Methods for Future Use and further implemenation of the app//



//////////Contact Methods////////////  For Future use.

  createContact(title: string, content: string, userUID : string,): Promise<void> {
      const id = this.firestore.createId();
      return this.firestore.doc('userContacts/' + id).set({id, title, content, userUID,});
    }
  
 editContact(contactId, new_title, new_content){
      this.db.doc("userContacts/"+contactId).update({title : new_title, content: new_content})
    }

 //currently case sensetive 
 //set up to search by two values but is currently incapable
getSearched(search : string, collection : string, condition: string, condition2: string): AngularFirestoreCollection<any> {
  return this.firestore.collection(collection, ref => ref.where(condition ,'>=', search).where(condition, "<=", search+"z")
  );}


 //currently case sensetive 
 //set up to search by two values but is currently incapable
 getSpecificSearched(id: string, field: string, search : string, collection : string, condition: string): AngularFirestoreCollection<any> {
  
  return this.firestore.collection(collection, ref => ref.where(field, "==", id).where(condition ,'>=', search).where(condition, "<=", search+"z"));
  
  }

///gets all documents with field set to a particular condition
getOnly(collection : string, field: string, condition: string): AngularFirestoreCollection<any> {
  return this.firestore.collection(collection, ref => ref.where(field ,'==', condition));

}

///gets all user's data of a particular collection
getMy(collection : string, field: string): AngularFirestoreCollection<any> {
  return this.firestore.collection(collection, ref => ref.where(field ,'==', this.userId));

}
//gets all of ONE user's documents, not necessarily the logged in user
getList(doc, useriiD): AngularFirestoreCollection<any> {
  return this.firestore.collection(doc, ref => ref.where("userUID" ,'==', useriiD));
}

//gets all of THE ONE LOGGED IN user's documents
getYourList(doc): AngularFirestoreCollection<any> {
  return this.firestore.collection(doc, ref => ref.where("userUID" ,'==', this.userId));
}

//returns ALL documents in that collection
getListAll(doc): AngularFirestoreCollection<any> {
  return this.firestore.collection(doc);
}
//deletes document with corresponding ID
delete(doc: string, id: string): Promise<void>{
  return this.firestore.doc(doc + '/' + id).delete();
}



//deletes user and all documents assoicated with user. Legacy Code, will change
deleteAll(id: string): Promise<void>{
  this.firestore.doc("users" + '/' + id).delete();
  let assignments = this.getOnly("assignments", "userUID", id ).snapshotChanges()
  let events = this.getOnly("events", "userUID", id ).snapshotChanges()
  let entries = this.getOnly("currentEntries", "userUID", id ).snapshotChanges()
  let impulses = this.getOnly("impulseList", "userUID", id ).snapshotChanges()
  let contacts = this.getOnly("userContacts", "userUID", id).snapshotChanges()
  ///// NEEDS TO BE CHANGED
  assignments.subscribe(payload =>{
    payload.forEach(item =>{
        this.firestore.doc("assignments" + '/' + item.payload.doc.data().assignmentUID).delete();})})
    events.subscribe(payload =>{
      payload.forEach(item =>{
          this.firestore.doc("events" + '/' + item.payload.doc.data().eventUID).delete();})})
      entries.subscribe(payload =>{
        payload.forEach(item =>{
            this.firestore.doc("currentEntries" + '/' + item.payload.doc.data().id).delete();})})
        impulses.subscribe(payload =>{
          payload.forEach(item =>{
              this.firestore.doc("impulseList" + '/' + item.payload.doc.data().id).delete();})})
          contacts.subscribe(payload =>{
            payload.forEach(item =>{
                this.firestore.doc("userContacts" + '/' + item.payload.doc.data().id).delete();})})
    return null
/////////////////////////////////////////////////////////////////////////////////////////////////
}
}

