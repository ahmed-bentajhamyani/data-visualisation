import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  URL = "http://localhost:8000";

  constructor(private httpClient: HttpClient) { }

  getCountries() {
    return this.httpClient.get(`${this.URL}/countries`);
  }

  getPublicationParAnnee() {
    return this.httpClient.get(`${this.URL}/publications-par-annee`);
  }

  getPublicationParMois() {
    return this.httpClient.get(`${this.URL}/publications-par-mois`);
  }

  getPublicationParPays() {
    return this.httpClient.get(`${this.URL}/publications-par-pays`);
  }

  getPublicationParUniversity() {
    return this.httpClient.get(`${this.URL}/publications-par-universite`);
  }

  getPublicationParKeyword() {
    return this.httpClient.get(`${this.URL}/publications-par-keyword`);
  }

  getPublicationPaysParQuartile() {
    return this.httpClient.get(`${this.URL}/publications`);
  }

  getPublicationParAnneParQuartile(country: any) {
    return this.httpClient.get(`${this.URL}/publications/${country}`);
  }
}
