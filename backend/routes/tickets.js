const express = require("express");


const {
  updateClientReply,
  updateStatusClose,
 
} = require("../functions/ticket_function");
const  userAuthorization = require("../middleware/authorization");

const {
  createNewTicketValidation,
  replyTicketMessageValidation,
} = require("../middleware/formvalidation");

const Ticket = require('../models/ticket');


const router = express.Router();

router.all("/", (req, res, next) => {
  

  next();
});

// create new ticket
router.post("/", createNewTicketValidation, userAuthorization, async (req, res) => {
	
	  try {
		const { subject, sender, message } = req.body;
  
		
		const userId = req.userId;
		
  
		const ticketObj = {
		  clientId: userId,
		  subject,
		  conversations: [
			{
			  sender,
			  message,
			},
		  ],
		};
  
		const result = await Ticket(ticketObj).save();
		console.log(result);
  
		if (result._id) {
		  return res.json({
			status: "success",
			message: "New ticket has been created!",
		  });
		}
  
		res.json({
		  status: "error",
		  message: "Unable to create the ticket , please try again later",
		});
	  } catch (error) {
		res.json({ status: "error", message: error.message });
	  }
	}
  );

// Get all tickets for a specific user
router.get("/", async (req, res) => {
	try {
		
		//const userId = req.userId;
		const result =  await Ticket.find();
		
		console.log(result)
	
		return res.json({
		  status: "success",
		  result
		});
	  } catch (error) {
		res.json({ status: "error", message: error.message });
	  }
  });
 

  // Get all tickets for a specific user
  router.get("/:_id", async (req, res) => {
	try {
		
		//const userId = req.userId;
		const { _id } = req.params;
		const result =  await Ticket.findById(_id).populate('clientId').exec();
		
		console.log(result)
	
		return res.json({
		  status: "success",
		  result
		});
	  } catch (error) {
		res.json({ status: "error", message: error.message });
	  }
  });
  
  // update reply message form client
  router.put("/:_id",  replyTicketMessageValidation, async (req, res) => {
	  try {
		const { message, sender } = req.body;
		const { _id } = req.params;
		const clientId = req.userId;
  
		const result = await updateClientReply({ _id, message, sender });
  
		if (result._id) {
		  return res.json({
			status: "success",
			message: "your message updated",
		  });
		}
		res.json({
		  status: "error",
		  message: "Unable to update your message please try again later",
		});
	  } catch (error) {
		res.json({ status: "error", message: error.message });
	  }
	}
  );
  
  // update ticket status to close
  router.patch("/close-ticket/:_id", async (req, res) => {
	try {
	  const { _id } = req.params;
	  const clientId = req.userId;
  
	  const result = await updateStatusClose({ _id });
  
	  if (result._id) {
		return res.json({
		  status: "success",
		  message: "The ticket has been closed",
		});
	  }
	  res.json({
		status: "error",
		message: "Unable to update the ticket",
	  });
	} catch (error) {
	  res.json({ status: "error", message: error.message });
	}
  });
  
 

  router.delete("/:_id", async(req, res) => {
	const _id = req.params._id;
	try{
	  await Ticket.findByIdAndDelete(_id);
	  res.json({message:'deleted Successfully'})
	}catch(err){
	  res.status(400).json({message:err.message})
	}
  })

  //delete more than one
  router.delete("/", async (req, res) => {
	const { ids } = req.body;
   
	try {
	  if (!Array.isArray(ids) || !ids.length) {
		return res.status(400).json({ message: 'No IDs provided or invalid format' });
	  }
  
	  await Ticket.deleteMany({ _id: { $in: ids } });
  
	  res.json({ message: 'Deleted successfully' });
	} catch (err) {
	  res.status(400).json({ message: err.message });
	}
  });

 
  

module.exports = router;