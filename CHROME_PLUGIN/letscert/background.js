var getURL = document.getElementById('checkPage');
var info = document.getElementById('infoP');
var getProof = document.getElementById('checkProof');


////////////////////////////////////////////////////////////////
getURL.addEventListener('click', async function(event){ 
  await getThisURL().then(async function(link) {
  await getSecurityFlag(link.hostname) })
    }, false)

getProof.addEventListener('click', async function(event){ 
      await getThisURL().then(async function(link) {
      await retrieve_proof(link.hostname ?? link) })
        }, false)
 
////////////////////////////////////////////////////////////////


async function getSecurityFlag(url) {
     fetch(`http://54.235.32.250:5432/api/website/?URL=${url.hostname ?? url}`)
    .then(response => response.json())
    .then(json => {
      //console.log(json)
      check = json.securityFlag
      //console.log(check)

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
        
       info.innerHTML = li;
        
    //checkFlag(check)
    document.getElementById("infoP").innerHTML = li;
    }).catch(function(error) {  
    console.log('Request failed', error)  
    postRequest(url)
})
}

async function postRequest(url){
  try{
      const createRequest = await fetch('http://54.235.32.250:5432/api/website/create', {
          method: 'POST', 
          cors: 'true',
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify({'URL': `${url}`})
        });
      }
  catch(e){console.log(e);}
}


async function updateFlag(url, flag){
  try{
    let fullURL = await getThisURL();
    let checkCreated = await fetch(`http://54.235.32.250:5432/api/website/?URL=${fullURL.hostname}`)
    if(checkCreated.status !== 201) {postRequest(fullURL); updateFlag(fullURL, flag)}
 

    //console.log(formData)

      const updateRequest = await fetch('http://54.235.32.250:5432/api/website/update', {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify({'URL': `${fullURL.hostname}`, 'securityFlag': `${flag}`, 'fromwhitelist': `${flag}`})
        });
        getSecurityFlag(fullURL.hostname)
  }
  catch(e){console.log(e);}
}


  
  

const getThisURL = async() => {
  
    try{
    let url = new Promise(function(resolve) {
  chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   function(tabs){
      //alert(tabs[0].url)
      let tab = tabs[0]
      let link = new URL(tab.url) 
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


const examine_proof = async(proof, accValue, url) => {
  if(proof === accValue) updateFlag(url, true);
  else updateFlag(url, false);
  return proof === accValue
}

const parse_proof = async(textfile, accVal, n, url) => {
  
     
      let websites = textfile.split(' Website: ')
      websites.forEach((website) => 
      {
          let test = website.replace("Website: ", "").split('\n').join('')
          localStorage[test.split(' ')[0]] = test 
      })
      let website =  localStorage[url].split(' ')
      let Hash =  BigInt(website[2].replace(/\D/g,''))
      let proof =  BigInt(website[4].replace(/\D/g,''))
      let val1 = await power(proof, Hash, BigInt(n));

      await examine_proof(BigInt(val1), BigInt(accVal), url);
}


const retrieveAccValue = async() => {
  try{
    let primes = new Promise(function(resolve) {
  fetch('http://54.235.32.250:5432/api/website/secret')
  .then(secret => secret.text())
  .then(vals => {
    vals = vals.split(';')
    let accValue = vals[0].replace(/\D/g,'')
    let n = vals[1].replace(/\D/g,'')
    let arr = [accValue, n]
    resolve(arr)
  }
 )
});
let values = await primes;
return values;
  }
  catch(e) {console.log(e)}
}

  const retrieve_proof = async(url) => {
    //console.log(url)
    
    let whiteListCheck = await fetch(`http://54.235.32.250:5432/api/website/?URL=${url.hostname ?? url}`)
    .then(response => response.json())
    .then(json => {return json.fromwhitelist})
    if(whiteListCheck && whiteListCheck === true) getSecurityFlag(url);
     
   fetch(`http://54.235.32.250:5432/api/website/verify/?URL=${url}`)
  .then(response => response.text())
  .then(async(data) => {
    let vals = await retrieveAccValue()
    //console.log('vals test ', vals)
    let accVal = vals[0]
    let n = vals[1]
  	parse_proof(data, accVal, n, url)
  	////console.log(data);
  })
}

const power = async(x, y, p) => {

try{
  let pow = new Promise(function(resolve) {
{
    let res = BigInt(1);

    x = x % p;
    while (y > BigInt(0))
    {
        if (y & BigInt(1))
            res = (res*x) % p;
        y = y>>BigInt(1); // y = y/2
        x = (x*x) % p;
    }
    resolve(res);
}
});
let finalAnswer = await pow;
return finalAnswer;
  }
  catch(e){
    throw('error URL not found')
  }
}
