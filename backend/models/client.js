
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var clientSchema = new Schema({
	task:{
		type:Schema.Types.ObjectId, 
		ref: "Ticket"
	},
	clientId: 
	{
		type:Schema.Types.ObjectId, 
		ref: "User"
	},
	organization_name: {type: String},
	first_name: {type: String},
	middle_name: {type: String},
	last_name: {type: String},
	email_address: {type: String},
	phone_number:{type: String},
	street: {type: String},
	city: {type: String},
	state: {type: String},
	zip: {type: String},
	
	active: {type: Boolean, deafult: true},
	date_added: {type: Date},

});

module.exports = mongoose.model("Client", clientSchema);