var getURL = document.getElementById('checkPage');
var info = document.getElementById('infoP');


getURL.addEventListener('click', async function(event){ 
  getThisURL().then(function(link) {
  getSecurityFlag(link) })
    }, false)
 
 
async function getSecurityFlag(URL) {
    var check
    //if(!URL) {URL = "https://www.google.com"}
    fetch(`http://54.235.32.250:5432/api/website/?URL=${URL}`, {mode: 'no-cors'})
.then(function(response) {
    console.log(response)
    check = response.securityFlag ? response.securityFlag : response.securityFlag = "false"
  
}).catch(function(error) {  
  console.log('Request failed', error)  
});
checkFlag(check)
}

const getThisURL = async() => {
  var link
  chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   function(tabs){
      alert(tabs[0].url)
      link = tabs[0].url
      console.log(link)   
      return link
}
  )
}
/*  
async function autoURL(){
    chrome.tabs.onUpdated.addListener(function
      (tabId, changeInfo, tab) {
        
        if (changeInfo.url) {
          getSecurityFlag(tab.URL)
    
        }
        else{return}
      }
    )}
*/

async function checkFlag(securityFlag){
    if(securityFlag){
        info = 'This Page Has Passed The Check!'
    }
    else{
        info = 'This Page Has NOT Passed The Check!'
    }

}
 
    


