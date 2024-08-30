import { Injectable } from '@angular/core';
import { environment } from '../env/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Ticket } from '../model/ticket.model';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  getDetails() {
    return this.httpClient.get<any>(`${this.url}/dashboard`);
  }

  getAllTicket(){
    return this.httpClient.get(this.url+'/tickets')
    .pipe(map((response : any) => response.result as Ticket[])) //at console output will be like status:true and result: Array{....} so at the plase response.data replsced with response that result
    
    //.pipe(map((response: any) => response.result as Task[]));//for property result of array
   
  }

  deleteTicket(_id:any): Observable<any>{
  
    return this.httpClient.delete<any>(this.url+`/tickets/`+_id)
    
  }
  
  closeTicket(_id: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.url}/tickets/close-ticket/${_id}`, {});
  }

  getTicketById(_id: string): Observable<any>{

    console.log("calling",_id);
    return this.httpClient.get<any>(`${this.url}/tickets/${_id}`)
     
    }
    saveTicket(data:any){
      console.log(data)
      return this.httpClient.post(this.url+'/tickets', data,{
        observe:'body',
        headers: new HttpHeaders().set('Content-Type','application/json')
      });
  
    }

    updateTicketMessage(_id: any, message: any, sender: any): Observable<any> {
      return this.httpClient.put(`${this.url}/tickets/${_id}`, {message, sender});
    }
    deleteTicketsMore(ids: any[]): Observable<any> {
      const options = {
        body: { ids: ids }
      };
      return this.httpClient.request<any>('delete', this.url + `/tickets`, options);
    }
}
