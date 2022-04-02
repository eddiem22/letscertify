let Nodemailer = require('nodemailer');
const { app, BrowserWindow, ipcMain, net, remote, ipcRenderer} = require('electron');
const { indexOf } = require('lodash');
let sendMail = async function(Subject, Recipient, Body, Email, Password, Host) 
{
    let testAccount = await Nodemailer.createTestAccount();

    var mySubject = Subject;
    var myRecipient = Recipient;
    var myBody = Body;
    var myEmail = Email;
    var myPassword = Password;
    var myHost = Host;


    let transporter = Nodemailer.createTransport({
      host: `smtp.mail.${myHost}.com`,
      port: 465,
      service:`${myHost}`,
      secure: false, 
      auth: {
        user: `${myEmail}`, 
        pass: `${myPassword}`, 
      },
    });
  
    let info = await transporter.sendMail(
      {
      from: `${myEmail}`, 
      to: myRecipient, 
      subject: mySubject, 
      text: myBody, 
    });
  
    
  
    console.log("Message sent: %s", info.messageId);

    
    console.log("Preview URL: %s", Nodemailer.getTestMessageUrl(info));

  }
  


  module.exports = sendMail;
