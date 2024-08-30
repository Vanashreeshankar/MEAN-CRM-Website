const Ticket = require('../models/ticket');

const client = require('../models/client');

const insertTicket = (ticketObj) => {
  return new Promise((resolve, reject) => {
    try {
        Ticket(ticketObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};




const getTickets = ( clientId) => {

  return new Promise((resolve, reject) => {
      if (!clientId) return false;

      try{
          Ticket.find({clientId}).populate('clientId').then({clientId}, (error, data) => { //.then() added to resolve error
              if (error) {
                console.log(error);
                reject(error);
              }
              resolve(data);
           })
          .then((data) => resolve(data))
          .catch((error) => {
              console.log(error);
              reject(error);
          })
          

        } catch (error) {
            reject(error);
        }
 
});
}


const getTicketById = (_id) => {
  return new Promise((resolve, reject) => {
    Ticket.findOne({ _id })
      .populate('clientId')
      .then(data => {
        if (!data) {
          resolve(null); // Return null if no ticket is found
        } else {
          resolve(data);
        }
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

/*const getClientById = ( _id, clientId) => {

  return new Promise((resolve, reject) => {
      

      try{
          client.find({_id, clientId}).populate('clientId').then({_id, clientId}, (error, data) => { //.then() added to resolve error
              if (error) {
                console.log(error);
                reject(error);
              }
              resolve(data);
           }).exec()
          .then((data) => resolve(data))
          .catch((error) => {
              console.log(error);
              reject(error);
          })
          

        } catch (error) {
            reject(error);
        }
 
});
}*/



const updateClientReply = ({ _id, message, sender }) => {
  return new Promise((resolve, reject) => {
    try {
        Ticket.findOneAndUpdate(
        { _id },
        {
          status: "Pending",
          $push: {
            conversations: { message, sender },
          },
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const updateStatusClose = ({ _id}) => {
  return new Promise((resolve, reject) => {
    try {
        Ticket.findOneAndUpdate(
        { _id },
        {
          status: "Closed",
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const deleteTicket = ({ _id, clientId }) => {
  return new Promise((resolve, reject) => {
    try {
        Ticket.findOneAndDelete({ _id, clientId })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertTicket,
  getTickets,
  getTicketById,
  updateClientReply,
  updateStatusClose,
  deleteTicket,
  //getClientById
};