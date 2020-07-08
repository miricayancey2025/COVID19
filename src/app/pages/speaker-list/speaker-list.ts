import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service'
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  public currentStudents;
  data:any;

  constructor(public firestoreService: FirestoreService, private newsService:NewsService ) {}

  ionViewDidEnter() {
    this.newsService.getData('everything?q=covid-19&from=2020-06-08').subscribe(data => {
      console.log(data);
      this.data = data;
        })
  // this.currentStudents = this.firestoreService.getListAll("student-users").valueChanges();
  }
}
