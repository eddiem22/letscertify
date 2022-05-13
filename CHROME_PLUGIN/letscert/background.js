var getProof = document.getElementById('checkProof');

getProof.addEventListener('click', async function(event){ 
      await getThisURL().then(async function(link) {
      await retrieve_proof(link) })
        }, false)
 
////////////////////////////////////////////////////////////////


async function getSecurityFlag(url) {
     fetch(`http://54.235.32.250:5432/api/website/?URL=${url}`)
    .then(response => response.json())
    .then(json => {
        let li = `<tr>
        <th><b>Website: </b></th> 
        <td>${json.URL} </td>
        <p></p>
        <th><b>Security Flag: </b></th>
        <td>${json.securityFlag ? 'Verified' : 'NOT Verified'}</td> 
        <p></p>
        </tr>`;
        
       info.innerHTML = li;
        
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
    let checkCreated = await fetch(`http://54.235.32.250:5432/api/website/?URL=${url.hostname ?? url}`)
    if(checkCreated.status !== 201) {postRequest(url); updateFlag(url, flag)}
 
      const updateRequest = await fetch('http://54.235.32.250:5432/api/website/update', {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify({'URL': `${url.hostname ?? url}`, 'securityFlag': flag}),
        });
        getSecurityFlag(url.hostname ?? url)
        //console.log(updateFlag)
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


  const closeTab = () => {
    chrome.tabs.query({ active: true }, function(tabs) {  
      chrome.tabs.remove(tabs[0].id);   
  }); 
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
    console.log(arr);
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
    .then(json => {return json})
    if(whiteListCheck.securityFlag === true) return getSecurityFlag(url.hostname);
  
   //let prooftest = await fetch(`${url}/proof.txt`).then(response => response.status).then(async(data) => {return data})
   //if(prooftest) p
   
   fetch(`http://54.235.32.250:5432/api/website/verify/?URL=${url}`)
  .then(response => response.text())
  .then(async(data) => {
    let vals = await retrieveAccValue()
    //console.log('vals test ', vals)
    let accVal = vals[0]
    let n = vals[1]
  	parse_proof(data, accVal, n, url)
  })
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
  console.log('accumulator value: ', val1, '\n', "website: ", website, '\n', "Hash: ", Hash, '\n', "proof: ", proof);

  return examine_proof(BigInt(val1), BigInt(accVal), url);
}



const examine_proof = async(proof, accValue, url) => {
  if(proof === accValue) updateFlag(url, true);
  else {
    let check = prompt('WARNING: This Website Has Not Been Verified. Proceed with caution! Type 1 to Continue, 2 to Block')
    if(parseInt(check) === 1) getSecurityFlag(url);
    else if (parseInt(check) === 2) closeTab();
  }
  console.log("accumulator is valid? ", proof === accValue)
  return proof === accValue
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
        y = y>>BigInt(1); 
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
