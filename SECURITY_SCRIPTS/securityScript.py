import sys
import os
import os.path
import subprocess
import requests
from datetime import datetime
path = 'proof.txt'
dirname = os.path.dirname(path)

print(os.getcwd())

def main():
    arglength = len(sys.argv)
    if arglength == 1 or arglength >= 3:
        print("Error. Incorrect parameters. Use either daily or install.")
        return

    if sys.argv[1] == "install":
        print("installing now...")
        p = subprocess.Popen("sudo apt-get install pip", shell=True, stdout=subprocess.PIPE)
        print(p.stdout.readlines())

        
    elif sys.argv[1] == "daily":
        score = 0

        print("running daily updates...")
        #subprocess.run(["ls", "-l"])
        #subprocess.run(["sudo", "apt-get", "update"])

        p = subprocess.Popen("sudo apt-get upgrade", shell=True, stdout=subprocess.PIPE)
        output = p.stdout.readlines()
        print(output[4])
        #for line in output:
            #print(line)

        p = subprocess.Popen("sudo lsof -nP -i", shell=True, stdout=subprocess.PIPE)
        output = p.stdout.readlines()
        print("Currently running services:")
        current_services = set([])
        for line in output:
            print(line.split()[0])
            current_services.add(line.split()[0])

        print(current_services)
        for service in current_services:
            p = subprocess.run(["sudo","apt-get","upgrade",service])

        print("Examining ssh settings...")
        config_file = open("/etc/ssh/sshd_config", "r")
        lines = config_file.readlines()
        print(lines[57])
        if lines[57] == "#PasswordAuthentication yes\n":
            print("Password authentication is currently turned on. Please turn it off in order to greatly increase security.")
            score+=1

        else:
            print("Password authentication is currently off. Looking great.")


        if score < 3:
            authenticate(0, score)
        else:
            authenticate(1, score)


def authenticate(value, score):
    if value == 0:
        myip = requests.get("https://api.ipify.org").content.decode('utf-8')
        payload = {"date":str(datetime.now()),"ip":str(myip),"securityFlag":str(score)}
        r = requests.post("https://httpbin.org/post", data = payload)
        

        #analyzing proof response
        dictionary = r.json()
        proof = dictionary['form']['date'] #date to be replaced with proof
        print(proof) 

        #now we actually create proof.txt
        proof_file = open(dirname, "w")
        proof_file.write(proof)
        return

    elif value == 1:
        print("Sorry. Your server has been deemed to be very rough. :(")
        return



main()

