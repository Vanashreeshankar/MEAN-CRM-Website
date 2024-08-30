import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';
import { Client } from '../model/client.model';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;
  jsonHeader = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private httpClient: HttpClient, private router: Router) { }


  signup(data: any) {
    return this.httpClient.post(`${this.url}/users/signup`, data,{
      observe:'body',
      headers: new HttpHeaders().set('Content-Type','application/json')
    }
    //this.jsonHeader
  );
  }
  
  signin(data: any){
    return this.httpClient.post(this.url + '/users/login', data,{
      observe:'body',
      headers: new HttpHeaders().set('Content-Type','application/json')
    }
    //this.jsonHeader
  );
  }

  forgotPassword(data: any) {
    return this.httpClient.post(this.url + '/users/reset-password',
      data,{
        observe:'body',
        headers: new HttpHeaders().set('Content-Type','application/json')
      }
      //this.jsonHeader
    );
  }

  resetPassword(email: string, pin: string, newPassword: string) {
    return this.httpClient.patch(this.url + '/users/reset-password', { email, pin, newPassword });
  }


  refreshToken(): Observable<any> {
    const refreshJWT = localStorage.getItem("refreshJWT");

    if (!refreshJWT) {
        return throwError("Refresh token not found!");
    }
    console.log('Attempting to refresh token:', refreshJWT);
    
    return this.httpClient.get<{accessJWT: string, refreshJWT?: string}>(`${this.url}/token`, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${refreshJWT}`)
    }).pipe(
        tap(tokens => this.storeTokens(tokens)),
        catchError(this.handleError<any>('refreshJWT', null))
    );
}

  storeTokens(tokens: any) {
    if(tokens.accessJWT){
      console.log('store token:', tokens.accessJWT)
      localStorage.setItem('accessJWT', tokens.accessJWT);
    }
    if(tokens.refreshJWT){
      console.log('store token:', tokens.refreshJWT)
      localStorage.setItem('refreshJWT', tokens.refreshJWT);
    }
   
  }

 getRefreshToken(){
    return localStorage.getItem('refreshJWT');
  }

  getAccessToken(){
    return localStorage.getItem('accessJWT');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  

  logout(){
   localStorage.removeItem('accessJWT');
   localStorage.removeItem('refreshJWT');
   localStorage.removeItem('role')
   //this.router.navigate(['/signin'])
  }

  getAllClients(){
    return this.httpClient.get<any>(this.url+'/clients')
    .pipe(map((response : any) => response.result as Client[]))
  }

  deleteClient(_id:any): Observable<any>{
  
    return this.httpClient.delete<any>(this.url+`/clients/`+_id)
    
  }

  saveClients(data:any){
    console.log(data)
    return this.httpClient.post(this.url+'/clients', data,{
      observe:'body',
      headers: new HttpHeaders().set('Content-Type','application/json')
    });

  }

  editbyId(data: any): Observable<Client>{

    const aprl = this.url+'/clients/'+ data._id;
    console.log('requested url:', aprl)
    
    return this.httpClient.put<Client>(aprl, data)
  }

  getBothClientTaskDetails(clientId: any): Observable<any>{
    //clientId = '123'

  const clientstring = clientId.toString()
    
    const api = `${this.url}/clients/combined/${clientstring}`
    console.log("calling",clientId);
    return this.httpClient.get(api)
  }

  getClientById(_id: any): Observable<Client>{
    console.log("calling",_id);
    return this.httpClient.get<Client>(`${this.url}/clients/${_id}`)    
    }

    getProfile(): Observable<any> {
     // const aprl = this.url+'/clients/'+ data._id;
      return this.httpClient.get<any>(this.url+'/clients/'+ 'profile');
    }

    getCurrentUser(): Observable<any> {
      return this.httpClient.get<any>(this.url + '/users/currentUser');
    }
  }
  
 
  
  
    


