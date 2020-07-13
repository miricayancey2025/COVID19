import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'
const API_URL = environment.map_apiUrl;
const API_KEY = environment.map_apiKey;
const PROJECT_ID = environment.map_projectID;
const ADMIN_KEY = environment.map_adminKey

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }
  setObjectPosition(object_id, lat, long){ // sets the user position for location history + hotspot
    var data = `{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          ${lat},
            ${long},
            0.0
        ]
      },
      "object": "${object_id}"
    }`
    const headers = { 'Content-type': 'application/json'}  
    const body=JSON.parse(data);


    return this.http.post(`https://api.tomtom.com/locationHistory/1/history/positions?key=${API_KEY}`, body,{'headers':headers})
  }

  getData(object_id){
    return this.http.get(`${API_URL}/geofencing/1/transitions/objects/${object_id}?key=${API_KEY}&from=2020-07-13T01:00:00&to=2020-07-13T23:00:00&projects=${PROJECT_ID}`);
  }

  createObject(){ //create a new object under current user id

  }
  deleteObject(){ //delete object and all of it's data as well as connection to user

  }
  checkObjectAge(){ // check age of object. Objects are deleted after 14 days

  }

  getObjectLastPosition(object_id){ //gets the last known position of user
    return this.http.get(`https://api.tomtom.com/locationHistory/1/history/position/${object_id}?key=${API_KEY}`);
  }
  getObjectPositionAt(object_id, time){ // gets an objects position at this time

  }

  getLocationHistory(object_id){ //gets the location history for 2 weeks for user
    return this.http.get(`https://api.tomtom.com/locationHistory/1/history/positions/${object_id}?key=${API_KEY}&from=2020-07-13T01:00:00&to=2020-07-13T01:00:00`);
  }

  getFenceHeadCount(fence_id){ // gets a headcount of how many objects are in the fence

  }

  updateCount(){ //Updates the population count for the fences

  }
  checkExposure(){ // checks if two objects were inside fence at same time

  }

}
