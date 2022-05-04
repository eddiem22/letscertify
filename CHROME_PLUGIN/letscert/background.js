var getURL = document.getElementById('checkPage');
var whitelist = document.getElementById('openWhiteList');
var info = document.getElementById('infoP');
var getProof = document.getElementById('checkProof');


//var acc_value = getURL("https://rsa-whitelist/acc.txt")

var imported = document.createElement('mathfams.js');
imported.src = '/path/to/imported/script';
document.head.appendChild(imported);



////////////////////////////////////////////////////////////////
getURL.addEventListener('click', async function(event){ 
  await getThisURL().then(async function(link) {
  await getSecurityFlag(link.hostname) })
    }, false)

getProof.addEventListener('click', async function(event){ 
      await getThisURL().then(async function(link) {
      await retrieve_proof(link.hostname??link) })
        }, false)

 
whitelist.addEventListener('click', async function(event){ 
      await getThisURL().then(async function(link) {
       retrieve_proof(link) })
        }, false)
 
////////////////////////////////////////////////////////////////


async function getSecurityFlag(url) {
    var check
     fetch(`http://54.235.32.250:5432/api/website/?URL=${url}`)
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
        
            console.log(li)
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
        console.log(createRequest.json);
      }
  catch(e){console.log(e);}
}


async function updateFlag(url, flag){
  try{
    let fullURL = await getThisURL();
    let checkCreated = await fetch(`http://54.235.32.250:5432/api/website/?URL=${fullURL}`)
    if(checkCreated.status === 404) {postRequest(fullURL); updateFlag(url, flag)}
 
    let formData = {}
    formData['URL'] = JSON.stringify(fullURL.hostname ?? fullURL.host)
    formData['securityFlag'] = flag
    console.log(formData)

      const updateRequest = await fetch('http://54.235.32.250:5432/api/website/update', {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify({'URL': `${fullURL.host ?? fullURL.hostname}`, 'securityFlag': `${flag}`})
        });
        console.log(updateRequest.json);
        getSecurityFlag(fullURL.hostname ?? fullURL.host)
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


const examine_proof = async(proof, accValue, url) => {
  if(proof === accValue) {updateFlag(url, true)}
  else updateFlag(url, false)
  return proof === accValue
}

const parse_proof = async(textfile, accVal, n, url) => {
  
     
      let websites = textfile.split(' Website: ')
      let siteMap = {}
      websites.forEach((website) => 
      {
          let test = website.replace("Website: ", "").split('\n').join('')
         // let title = (test.split(' ')[0])
          siteMap[test.split(' ')[0]] = test 
          //console.log(test.split(' ')[0])
      })
      console.log("websites are: ", siteMap)
      console.log('accval ', accVal, '\n', 'n: ', n)
      let website =  siteMap[url].split(' ')
      let Hash =  BigInt(website[2].replace(/\D/g,''))
      let proof =  BigInt(website[4].replace(/\D/g,''))
      console.log("proofs is ", proof)
      console.log("hash is ", Hash)
      let val1 = power(proof, Hash, BigInt(n))
      console.log("val1 = ", val1)
      console.log("website is ", website)
      console.log(await examine_proof(BigInt(val1), BigInt(accVal), url))
      
      //console.log(val1 === A)
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
    console.log('retrieve test ', arr)
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
    console.log(url)
   fetch(`http://54.235.32.250:5432/api/website/verify/?URL=${url}`)
  .then(response => response.text())
  .then(async(data) => {
    let vals = await retrieveAccValue()
    console.log('vals test ', vals)
    let accVal = vals[0]
    let n = vals[1]
  	parse_proof(data, accVal, n, url)
  	//console.log(data);
  })
}

function power(x, y, p)
{
    let res = BigInt(1);

    x = x % p;
    while (y > BigInt(0))
    {
         
        // If y is odd, multiply
        // x with result
        if (y & BigInt(1))
            res = (res*x) % p;
 
        // y must be even now
        y = y>>BigInt(1); // y = y/2
        x = (x*x) % p;
    }
    return res;
}
