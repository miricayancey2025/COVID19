import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  API_URL = 'https://newsapi.org/v2'
  API_KEY = '3dc14bae5256481a8836948584b8a9fa'
  constructor(private http: HttpClient) { }

  getData(url){ //gets the news articles
    return this.http.get(`${this.API_URL}/${url}&apiKey=${this.API_KEY}`);
  }
}
