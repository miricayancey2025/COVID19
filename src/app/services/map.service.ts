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

  getData(object_id){
    return this.http.get(`${API_URL}/geofencing/1/transitions/objects/${object_id}?key=${API_KEY}&from=2020-07-12T01:00:00&to=2020-07-12T01:00:00&projects=${PROJECT_ID}`);
  }
}
