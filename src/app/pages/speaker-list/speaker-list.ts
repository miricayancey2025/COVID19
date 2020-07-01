import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service'

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  public currentStudents;

  constructor(public firestoreService: FirestoreService,) {}

  ionViewDidEnter() {
   this.currentStudents = this.firestoreService.getListAll("student-users").valueChanges();
  }
}
