import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, } from 'rxjs/operators';
import { FirebaseAuthServices } from './firebase-auth.service';
import * as firebase from 'firebase/app';

@Injectable()
export class MakeRequest {
  token = '';
  constructor(private http: HttpClient, private authService: FirebaseAuthServices) {

  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  // Định nghĩa hàm GET request
  async GETmethod({ url }: { url: string }): Promise<Observable<any>> {
    if (firebase.auth().currentUser !== null) {
      // lấy token
      await firebase.auth().currentUser.getIdToken().then(result => {
        this.token = result;
      });
    }
    return this.http.get(url, {
      headers: new HttpHeaders({ authorization: 'Bearer ' + this.token.toString() })
    }).pipe(
      map(this.extractData));
  }

  // Định nghĩa hàm POST request
  async POSTmethod({ url, body }: { url: string; body: any; }): Promise<Observable<any>> {
    await firebase.auth().currentUser.getIdToken().then(result => {
      this.token = result;
    });
    return this.http.post(url, body,
      {
        headers: new HttpHeaders({ authorization: 'Bearer ' + this.token.toString() })
      }
    ).pipe(
      map(this.extractData));
  }
}
