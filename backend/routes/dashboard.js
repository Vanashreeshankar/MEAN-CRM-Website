const express    = require("express");
const router			 = express.Router();

const Ticket 	  		  = require ("../models/ticket");

const Client 			  = require ("../models/client");

const userAuthorization = require('../middleware/authorization')


 router.get("/", userAuthorization, async(req, res) => {

	
	let clientCount = [],
	ticket = [],
	presentTicket = [],
	closedTicket = [];
	
    try{
        clientCount = await Client.countDocuments();
		ticket = await Ticket.countDocuments();
        presentTicket  = await Ticket.countDocuments({status: 'Pending'});
		closedTicket = await Ticket.countDocuments({status: 'Closed'});

		
        res.json({clientCount : clientCount, ticket:ticket,
			presentTicket : presentTicket, 
			closedTicket :closedTicket});
        console.log(clientCount,ticket,presentTicket, closedTicket )
    }catch(err){
        res.status(500).json({message : err.message})
    }
})


module.exports = router;