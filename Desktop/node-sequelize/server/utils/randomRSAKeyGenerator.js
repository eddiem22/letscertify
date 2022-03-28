
    const getValues =async(min, max) => {
        try{
        let getPrimeValues = new Promise(function(resolve) { 
        const result = Array(max + 1)
       .fill(0)
       .map((_, i) => i);
       for (let i = 2; i <= Math.sqrt(max + 1); i++) {
          for (let j = i ** 2; j < max + 1; j += i) delete result[j];
       }
       resolve(Object.values(result.slice(min)));
    })
        let value = await getPrimeValues;
        return value;
    }
    catch(e)
    {console.log(e)}
}


const getRandomNum =async(min, max) => {
    let randomNum =  new Promise(function(resolve) { 
   resolve(Math.floor(Math.random() * (max - min + 1) + min));
    })
   let number = await randomNum;
   return number;
}
module.exports = {
async getRandomPrime ([min, max]) {
   let primes = await getValues(min, max);
   return primes[await getRandomNum(0, primes.length - 1)]
   
}
}


