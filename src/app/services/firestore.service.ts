import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
//import { DatePipe } from '@angular/common';
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root',
  
})
export class FirestoreService {
  userId; user;
  public db;
  
  constructor(public firestore: AngularFirestore,  /*private datePipe: DatePipe,*/ public ngFireAuth: AngularFireAuth,) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.userId = this.user.uid
    this.db = firebase.firestore();
   }

////////////Class Group methods///////////////

   createGroup(title: string, date: string): Promise<void> {
    const id = this.firestore.createId();
    const leader = this.userId
    return this.firestore.doc('groups/' + id).set({id, title, date, leader});
  }

//updates group field of given user   id: user id, val: groupid
  updateGroup(id: string, val:string){
    this.db.doc("users/"+id).update({"groupUID" : val})
  }  
  //////////////////////////////////////////////////////////////////////////////////////////////




//////////Entry Methods////////////

  createEntry( title: string, date: string, day: string, content: string, timestamp: string, userUID : string,): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.doc('currentEntries/'  + id).set({id, title, date, day, content, timestamp, userUID,});
  }

  editEntry(entryId, new_title, new_content){
    this.db.doc("currentEntries/"+ entryId).update({title : new_title, content: new_content})
  }
////////////////////////////////////////////////////////////////////////////////////////////////






//////////Contact Methods////////////  

  createContact(title: string, content: string, userUID : string,): Promise<void> {
      const id = this.firestore.createId();
      return this.firestore.doc('userContacts/' + id).set({id, title, content, userUID,});
    }
  
 editContact(contactId, new_title, new_content){
      this.db.doc("userContacts/"+contactId).update({title : new_title, content: new_content})
    }
/////////////////////////////////////////////////////////////////////////////////////////////////




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

//gets the details of a particular document
getDetail(doc:string, val: string): AngularFirestoreDocument<any>{
  return this.firestore.collection(doc).doc(val);
}
//gets all of ONE user's documents
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

//deletes document using a bridging id from another document
deleteBridge(collect: string, field: string, val: string): Promise<void>{
  let doc = this.getOnly(collect, field, val ).snapshotChanges()
  let eventID;
  doc.subscribe(payload =>{
    payload.forEach(item =>{
        eventID = item.payload.doc.data().eventUID
    })
    return this.firestore.doc(collect + '/' + eventID).delete();      
    })
    return null
/////////////////////////////////////////////////////////////////////////////////////////////////
}

//deletes user and all documents assoicated with user
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

