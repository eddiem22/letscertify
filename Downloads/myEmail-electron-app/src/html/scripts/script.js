const { ipcRenderer } = require('electron');

var saveThis = document.getElementById('save');
var myRecipient = document.getElementById('email')
var mySubject = document.getElementById('subject')
var myMessage = document.getElementById('message')
var myEmail = document.getElementById('sender')
var myPassword = document.getElementById('password')
var myHost = document.getElementById('smtpHost')
var form =  document.getElementById('ipcForm');
var autofill = document.getElementById('autofill');
var myEmail = document.getElementById('sender');
var myPassword = document.getElementById('password');
var myHost = document.getElementById('smtpHost');
var saveThis = document.getElementById('save');

class thisEmail {
    constructor(subject, recipient, message, email, password, host, saved, autofilled) {
        this.subject = subject;
        this.recipient = recipient;
        this.message = message;
        this.email = email;
        this.password = password;
        this.host = host;
        this.save = saved;
        this.autofill = autofilled;
    }
}

let emailObject = new thisEmail(mySubject, 
    myRecipient, 
    myMessage, 
    myEmail, 
    myPassword, 
    myHost, 
    saveThis, 
    autofill)


autofill.addEventListener('change', async function(event){
    if(emailObject.saved.checked)
    {
        ipcRenderer.send('onCheck')
        ipcRenderer.on('onErrorCheck', function(event, arg){
            if(arg==true){
                console.log('arg is true')
                ipcRenderer.on('onConfirm', function(event, smtp, email, password) {
                    emailObject.email.required = false;
                    emailObject.password.required = false;
                    emailObject.host.required = false;
                    emailObject.password.placeholder = '**********'
                    emailObject.host.placeholder = `smtp.mail.${smtp}.com`
                    emailObject.email.placeholder = `${email}`;
                    emailObject.email.value = email;
                    emailObject.password.value = password;
                    emailObject.host.value = smtp;
                })
            }
            else
            {
                console.log('arg is false')
                emailObject.email.required = true;
                emailObject.password.required = true;
                emailObject.host.required = true;
                emailObject.password.placeholder = 'Enter Password'
                emailObject.host.placeholder = `smtp.mail.YOURHOST.com`
                emailObject.email.placeholder = 'Enter Your Email Address'
            }
        })
       
    }
    else
            {
                console.log('NOT Schecked')
                emailObject.email.required = true;
                emailObject.password.required = true;
                emailObject.host.required = true;
                emailObject.password.placeholder = 'Enter Password'
                emailObject.host.placeholder = `smtp.mail.YOURHOST.com`
                emailObject.email.placeholder = 'Enter Your Email Address'
                emailObject.email.value = ''
                emailObject.password.value = ''
                emailObject.host.value = ''
            }
   

})

form.addEventListener('submit', async function(event) {
       //console.log('FORM SCRIPT IS ACTIVE')
        //event.preventDefault(
       var myRecipientValue = emailObject.recipient.value
       var mySubjectValue = emailObject.subject.value
       var myMessageValue = emailObject.message.value
       var myEmailValue = emailObject.email.value
       var myPasswordValue = emailObject.password.value
       var myHostValue = emailObject.host.value
       if(emailObject.save.checked)
       {   
           ipcRenderer.send('getAutofillInfo', myEmailValue, myPasswordValue, myHostValue)
       }
       console.log(emailObject)
       
        //console.log(inputs);
        ipcRenderer.send('send_email', mySubjectValue, myRecipientValue, myMessageValue, myEmailValue, myPasswordValue, myHostValue )
       })
  
