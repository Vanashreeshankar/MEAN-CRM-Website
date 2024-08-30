export interface Client{
  data: Client
  showButtons: boolean
	_id: string,
	clientId: string,
    organization_name: string,
	first_name: string,
	middle_name: string,
	last_name: string,
	email_address: string,
	phone_number: string,
	street: string,
	city: string,
	state: string,
	zip: string,
}
export type ObjectId = string

export interface Signup{
	_id: string,
	username:string,
	email: string
}
