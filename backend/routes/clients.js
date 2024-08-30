const express = require('express');

const Client = require('../models/client');
const Ticket = require('../models/ticket')


const router = express.Router();

const  userAuthorization = require("../middleware/authorization");

router.get("/", async (req, res) => {
	try {
		
		//const userId = req.userId;
		const result =  await Client.find().populate('clientId').exec();
		
		console.log(result)
	
		return res.json({
		  status: "success",
		  result,
		});
	  } catch (error) {
		res.json({ status: "error", message: error.message });
	  }
  });

  router.get("/profile",userAuthorization, async (req, res) => {
    try {
      
      //const userId = req.userId;
      const userId = req.userId
      const client = await Client.findOne({ clientId: userId }).populate('clientId').exec();
      const tickets = await Ticket.find({ clientId: userId }).populate('clientId').exec();
  return res.json({
    status: "success",
    client,
    tickets
  });
      } catch (error) {
      res.json({ status: "error", message: error.message });
      }
    });

  
router.get("/:id", async (req, res) => {
	try {
		
		//const userId = req.userId;
        const _id = req.params.id;
		const result =  await Client.findById(_id).populate('clientId').exec();
		
		console.log(result)
	
		return res.json({
		  status: "success",
		  result,
		});
	  } catch (error) {
		res.json({ status: "error", message: error.message });
	  }
  });

 

//Get Details of Admin

router.get("/:id", userAuthorization, async(req, res) => {
    try{
        //const clientId = req.params.id;

        const {clientId, role} = req.userId;
        const _id = req.params.id;

        if(role === 'admin' || clientId === _id){
          const clientDetails = await Client.findById(_id)
          res.json(clientDetails)
          console.log(clientDetails)
        }else{
          return res.status(404).json({message: 'Access Denied'})
        }


    
    }catch(err){
        res.status(500).json({message: err.message})
    }

})




router.post("/", userAuthorization, async(req,res) => {

  
 
    const { 
      organization_name,
        first_name,
        middle_name,
        last_name,
        email_address,
        phone_number,
        street,
        city,
        state,
        zip
        
  } = req.body;

  const userId = req.userId;

    const newClient = { 
      clientId: userId,
      organization_name,
        first_name,
        middle_name,
        last_name,
        email_address,
        phone_number,
        street,
        city,
        state,
        zip
       
    } 

    const result =  await Client(newClient).save();
    console.log(result)
    res.json({status: "successful", message: result})
})


//update
router.put("/:id", async(req, res) => {
  const _id = req.params.id;
  
  try{
    const result = await Client.findByIdAndUpdate( _id, req.body,{new: true})
    
    if(!result){
      res.status(404).json({message: 'Client not found'})
    }
    res.status(200).json(result)
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

router.delete("/:_id", async(req, res) => {
  const _id = req.params._id;
  try{
    await Client.findByIdAndDelete(_id);
    res.json({message:'deleted Successfully'})
  }catch(err){
    res.status(400).json({message:err.message})
  }
})

router.get("/combined/:clientId",  async(req, res)=> {
  try{
    const clientId = req.params.clientId;

    const client = await Client.findOne({clientId}).populate('clientId').exec();
   const ticket = await Ticket.find({clientId}).populate('clientId').exec();

    res.json({client, ticket})
  }catch(error){
    console.error(error)
    res.status(500).json({error: 'Internal server Error'})
  }
})



  module.exports = router;