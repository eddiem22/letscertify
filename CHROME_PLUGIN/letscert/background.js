var getURL = document.getElementById('checkPage');
var whitelist = document.getElementById('openWhiteList');
var info = document.getElementById('infoP');


getURL.addEventListener('click', async function(event){ 
  await getThisURL().then(async function(link) {
  await getSecurityFlag(link) })
    }, false)
 
    whitelist.addEventListener('click', async function(event){ 
      await getThisURL().then(async function(link) {
       postRequest(link) })
        }, false)
 
async function getSecurityFlag(URL) {
    var check;
    //if(!URL) {URL = "https://www.google.com"}
     fetch(`http://54.235.32.250:5432/api/website/?URL=${URL.slice(0, -1)}`)
    .then(response => response.json())
    .then(json => {
      console.log(json)
      check = json.securityFlag
      console.log(check)

        let li = `<tr>
        <th><b>Website: </b></th> 
        <td>${json.URL} </td>
        <p></p>
        <th><b>Security Flag: </b></th>
        <td>${json.securityFlag}</td> 
        <p></p>
        <th><b>From WhiteList?: </b></th>
        <td>${json.fromwhitelist}</td> 
        <p></p>
        </tr>`;
        
            console.log(li)
            info.innerHTML = li;
        
    checkFlag(check)
    document.getElementById("infoP").innerHTML = li;
    }).catch(function(error) {  
    console.log('Request failed', error)  
    postRequest(URL)
})
}

function promisedParseJSON(json) {
  return new Promise((resolve, reject) => {
      try {
          resolve(JSON.parse(json))
      } catch (e) {
          reject(e)
          
      }
  })
}

async function postRequest(URL){
  try{
  await fetch(URL).then(function(response) 
  {
    console.log(response.status)
    if(response.status==200)
    {
      /*let postURL = URL.split(".com")[0] ? `${URL.split(".com")[0]}.com`: 
      URL.split(".org")[0] ? `${URL.split(".org")[0]}.org` : URL.split(".edu")[0] ?`${URL.split(".edu")[0]}.edu` :
      URL.split(".net") ? `${URL.split(".net")[0]}.net` : null
      if(postURL)*/
      {
      const response = fetch('http://54.235.32.250:5432/api/website/create', {
          method: 'POST', 
          cors: 'true',
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify({'URL': `${URL}`})
        });
        console.log( response.json());
      }}
      else{
        console.log("Website Not Accessible!")
      }
    })
  }
  catch(e){console.log(e);}
}
  
  

const getThisURL = async() => {
  
    try{
    let url = new Promise(function(resolve) {
  chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   function(tabs){
      //alert(tabs[0].url)
      link = tabs[0].url
      console.log(link)   
      resolve(link)
   }
  )
});
let thisLink = await url;
return thisLink;
    }
    catch(e){
      throw('error URL not found')
    }
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
 
    


