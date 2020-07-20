import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';
import { MapService } from '../../services/map.service';
import { LocationTrackerService} from '../../providers/location-tracker.service'
import { DatePipe } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-maping',
  templateUrl: './maping.page.html',
  styleUrls: ['./maping.page.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class MapingPage implements OnInit {
  data:any;
  map: any;
  lat;long;
  timestamp;
  interval;
  previous;
  current; 
  object_id ="29017b68-dc6f-431c-aaaa-09e81400d956"; //user's object string
  public objList;
  public fenceList;
  timeLeft: number = 15
  switch: number = 10
  today = new Date();
  date =this.datePipe.transform(this.today, 'short');
  positions = [
    [-87.042634, 41.464394],  //Union    
    [-87.040241, 41.464114], //VUCA
    [-87.044086,41.462898], //Library
    [-87.041720, 41.463089], //Chapel
    [-87.041009, 41.461265], //Welcome Center
  ];
  pos_names =[
    "UNION",
    "VUCA",
    "LIBRARY",
    "CHAPEL",
    "WELCOME CENTER"
  ]
  userMarker: any;
  clickSub: any;
  
  constructor(private notifications: LocalNotifications,public alertController: AlertController, private firestoreService: FirestoreService,  private mapService : MapService,     public authService: AuthService, private datePipe: DatePipe, private loc : LocationTrackerService) { }

  // simpleNotif() {
  //   this.notifications.schedule({
  //     id: 1,
  //     text: 'Single Local Notification',
  //   });
  // }
  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'You Have Entered a Hotspot!',
      message: 'Proceed with caution and please wear a mask! You will come in contact with a lot of people!',
      buttons: ['OK']
    });
    await alert.present();
  }

  move() { //sets a timer that automatically updates fence transitions
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.movePositions()
        this.timeLeft = 15;
      }},1000)}

  getCount(){ //gets initial fence headcount
    //Gets Current Time and Time from 10 minutes ago
    var d_1 = new Date()
    this.current = d_1.toISOString().substring(0, d_1.toISOString().length - 5)
    var d_2 = new Date()
    d_2.setMinutes(d_2.getMinutes() -10)
    this.previous= d_2.toISOString().substring(0, d_2.toISOString().length - 5)
    var list
    this.mapService.getFences().subscribe(data =>{
      list = data
      list = list.fences
      //console.log(list)
      for(var x = 0; x < list.length; x++){
        this.mapService.getFenceHeadCount(list[x].id, this.previous, this.current).subscribe(data =>{
          console.log("Successful Fence Update!")
        })}})}
    

  getObjects() { //gets all the objects from the mapService
      return new Promise((resolve) =>{
        this.mapService.getObjects().subscribe(obj =>{
          this.objList = obj;
           this.objList = Object.keys(this.objList).map(it => this.objList[it])
           this.objList = this.objList[0]
           //console.log(this.objList)
           resolve()
          })})}

  movePositions(){ //gets all objects and calls a random position change
        this.getObjects().then(() =>{
        this.mapService.changePositions(this.objList, this.positions)
      })}

  setPosition(){ //sets object position for locationHistory service
    this.mapService.setObjectPosition(this.object_id, this.long,this.lat).subscribe(data =>{
      console.log('Tried Position')
    })}

  reportObj(){ //reports object location to fence transitions service
    this.mapService.postObjectReport(this.object_id, this.long,this.lat).subscribe(data =>{
      console.log('Tried Report')
    })}

  checkIn(){
    this.setPosition()
    this.reportObj()
  }

  colorExposure(){ //Colors the Cards according to Exposure Risk Level
    //Doesn't autoload, have to click somewhere on page to color code
    //Low population threshold set for demo
      var classList = document.getElementsByClassName("card")
      for(var x = 0; x <classList.length; x++){
        var childs = (classList[x].childNodes)[0].childNodes
        var num : number =+(childs[1].textContent.split(" "))[2]
        if(num > 100 && num < 300){
          classList[x].setAttribute("style", "background-color: orange")
          childs[2].textContent = "Exposure Risk: Orange"}

        else if(num >= 300){
          classList[x].setAttribute("style", "background-color: red")
          childs[2].textContent = "Exposure Risk: Red"}

        else{
          classList[x].setAttribute("style", "background-color: green")
          childs[2].textContent = "Exposure Risk: Green"}
}}
  ngOnInit() {
    // this.long =  this.loc.lng;
    // this.lat = this.loc.lat;
    this.fenceList = this.firestoreService.getAllFences("valpo_fences").valueChanges()
    this.getCount()
   // this.move()

    
     this.mapService.getObjectLastPosition("29017b68-dc6f-431c-aaaa-09e81400d956").subscribe(dat => {
          this.data = dat;
          var coordinates = this.data.objectState.geometry.coordinates
          this.timestamp  = this.datePipe.transform(this.data.objectState.timestamp, 'short');
     });

     var coordinates;
    this.getLast().then(data =>{
      coordinates = data
    })
     console.log(coordinates)

    var center = [ -87.041201, 41.463325]
    this.map = tt.map({
      
      key: 'xhSLlv6eLXVggB5hbMeTK87voMmu2LV3',
      
      container: 'map',
      
      style: 'tomtom://vector/1/basic-main',
      center: center,
      zoom: 15,
      minZoom: 15,
      
    });
    for(var x=0; x < this.positions.length; x++){
      var marker = new tt.Marker().setLngLat(this.positions[x]).setPopup(new tt.Popup({offset: 30}).setText(this.pos_names[x]))
      marker.addTo(this.map)
 }
    const el = document.createElement('div');
    el.innerHTML = "<img src='assets/img/user.png' style='width: 45px; height: 45px; border-radius: 15px;'>";
    var userMarker =  new tt.Marker({element: el, draggable: true}).setLngLat(center).setPopup(new tt.Popup({offset: 30}).setText("Drag to Check in")).addTo(this.map)
    //userMarker.togglePopup();

    userMarker.on('dragend',function(){
      var lngLat = userMarker.getLngLat();
      console.log(lngLat)
      //lngLat = new tt.LngLat(roundLatLng(lngLat.lng), roundLatLng(lngLat.lat));
      // userMarker.setPopup(new tt.Popup({offset: 30}).setText(lngLat.toString()))
      // userMarker.togglePopup();
      this.long = lngLat.lng
      this.lat = lngLat.lat
        });

    

 }}