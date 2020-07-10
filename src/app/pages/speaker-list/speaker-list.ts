import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service'
import { NewsService } from '../../services/news.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  public currentStudents;
  data: any;

  constructor(public firestoreService: FirestoreService, private newsService:NewsService,
    private iab: InAppBrowser,
 ) {}

  ionViewDidEnter() {
    //everything from today will need a date object
    this.newsService.getData('everything?q=covid OR covid-19 OR corona&language=en').subscribe(data => {
      console.log(data);
      this.data = data;
        })
  // this.currentStudents = this.firestoreService.getListAll("student-users").valueChanges();
  }
  openUrl(url){
    const browser = this.iab.create(url)
  }
}
