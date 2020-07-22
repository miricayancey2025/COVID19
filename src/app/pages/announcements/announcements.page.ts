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
  
  data: any; //article list data
  myDate : any = this.datePipe.transform(new Date(), 'shortDate'); //today's date


  constructor( private datePipe: DatePipe, public firestoreService: FirestoreService, private newsService:NewsService,private iab: InAppBrowser) {}

 openUrl(url){ //opens the url to any news story
  const browser = this.iab.create(url)
}
  ngOnInit() {

    //gets all news from the current date about COVID in english
    this.newsService.getData(this.myDate).subscribe(data => {
      // console.log(data);
      this.data = data;
        })
  }


}