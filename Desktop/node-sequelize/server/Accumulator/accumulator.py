#main
from ast import arg
import secrets
from urllib.parse import urlparse
import requests
import math
import sys
import os
from math_functions import get_n, gen_distinct_primes, gen_prime, egcd, modinv, hash_to_prime, str_to_int, int_to_str 

RSA_KEY_SIZE = 3072  # RSA key size for 128 bits of security (modulu size)
RSA_PRIME_SIZE = int(RSA_KEY_SIZE / 2)
ACCUMULATED_PRIME_SIZE = 128  


def gen_n():
    #print("check_n")
    p, q = gen_distinct_primes(RSA_PRIME_SIZE)
    n = get_n(p,q)
    return n

def gen_g(val_n):
    #return a prime smaller than n
    while True:
        g = gen_prime(RSA_PRIME_SIZE)
        if g < val_n:
            return g
        
def file_write(str1, str2, str3):
    WL = open("Proof.txt","a+") #open file in append mode)
    L = ['Website: ', str1 + ' \n ', str2 +' \n ', str3 + " \n "] #list of the elements
    WL.writelines(L) 
    WL.close()

def gen_proof(arr_Website, n, g):  
    hashID = []
    prfs = []
    product = 1
    i = 0
    
    for web_Name in arr_Website:
        curr = str_to_int(web_Name)
        #print(i, ": ", curr)
        #print(int_to_str(curr))
        ID, index = hash_to_prime(curr)
        #print ("ID = ", ID)
        #print("prod = ", product)
        product = (product * ID) % n
        
    for web_Name in arr_Website:
        curr = str_to_int(web_Name)
        #print(i, ": ", curr)
        #print(int_to_str(curr))
        ID, index = hash_to_prime(curr)
        #print ("ID = ", ID)
        #print("prod = ", product)
        proof = pow(g, product//ID, n)
        #print("proof = ", proof)
        file_write(web_Name, str(ID), str(proof))
        i += 1
        prfs.append(proof)
        hashID.append(ID)

    A = pow(g, product, n)
  #  print ("A = ", A)
    return A, hashID, prfs

def retrieve_proof(n, A, hashID, prfs):
    for IDX in range(len(prfs)):
     Hash = hashID[IDX]
     #print("Hash: ", Hash)
     proofs = prfs[IDX]
     #print("Proof: ", proofs)
     val1 = pow(proofs, Hash, n)
     #print("Accumulator Value: ", val1)
    return A

def main():
    #testing all the functions
    websites = [sys.argv[1]]
    print(websites)
    #print(website)
    n = gen_n()
    #n = 1310467955654225255548319207095469366202632422857141301572065534157018827601290990475744614910392148760685563077954167344493884689649741894826626443123585518923225492426093428417679602766547290262462701847624244083892333320539098868364286396730724099296529210138434090794429208778041450139112476388805665213068178879653397581890827655369268446389746796848530987164981432001063622635670654141009423274167700242625869332238455075439978789818634785524665977491905223188406884374021687563603753371680450549792973905570948052786470407900823072266076178801729111649904582197048302144986764279193989974309567639230145090502693633478873537812643562528035340520414502790751475336126646741534585999203307853778842774898067961929156372854049070566658637657438941537496855583447993258773287258152357394779636685250260382324426295223743362161091913383021629070962791443152116858445065703751862899598649333302853951668249861613981775738573
    #print("n = ", n)
    g = gen_g(n)
    #g = 600879881466114331347781620976865519736988138541091483688546177606405326578436624409341616141490078992204927886883649684825993120260112317724450899085474687851114641379313374098771280318764169634531582407656395278231267903984092173815959353489917276910225603100636397484985021376606999922276569346521534535119942331884724868794649853598946389233555644105628229058840012291226128904310229175375949096468743884854326027200380230281557610715859748369095720524654397
    #print("g = ", g)
    A, hashID, prfs = gen_proof(websites, n, g)
    t = retrieve_proof(n, A, hashID, prfs)
    print(t, ';', n)
   # print('Accumulator Value: ', t)
   # print(t)
   # print("t = ", t)
   # data ={
   # "URL":json.dumps(website[0]),
   # "RSA_Key": A,
   # "fromwhitelist":
#}
   # headers = {'Content-Type': "application/json"}
   # url = "http://54.235.32.250:5432/api/website/update/?URL="+website
   # r= requests.get(url)
   # print(r.status)
   # print(r.json)
main()
    
