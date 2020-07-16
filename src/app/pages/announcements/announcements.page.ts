import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service'
import { NewsService } from '../../services/news.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
  providers: [DatePipe],

}) 
export class AnnouncementsPage implements OnInit {
  public currentStudents;
  data: any;
  myDate : any = this.datePipe.transform(new Date(), 'short');


  constructor( private datePipe: DatePipe, public firestoreService: FirestoreService, private newsService:NewsService,
    private iab: InAppBrowser,
 ) {}
  ngOnInit() {
    //everything from today will need a date object
    this.newsService.getData('everything?qInTitle=covid OR covid-19 OR corona&language=en&from=${myDate}&sortBy=publishedAt').subscribe(data => {
      console.log(data);
      this.data = data;
        })
  // this.currentStudents = this.firestoreService.getListAll("student-users").valueChanges();
  }
  openUrl(url){
    const browser = this.iab.create(url)
  }
}