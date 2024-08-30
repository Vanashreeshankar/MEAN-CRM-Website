
export interface Ticket{
  showButtons: boolean;
    _id: string;
    clientId: string;
    subject: string;
    status: string;
   
    openAt: string;
     conversations: 
        {
            sender: string;
            role: string;
            message: string;
            msgAt: string;
           
        }[];
    
}

/*export interface Signup{
	_id: string,
	username:string,
	email: string
}*/
