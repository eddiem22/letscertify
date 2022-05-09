package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
)

func main() {

	run_type := flag.String("f", "install", "This allows you to select how to run the health script.\nFor installation, use -f=install.\n-f=daily is for general usage.\n")
	//domain_name := flag.String("d", "example.com", "Used in order to specify domain name.")
	//fmt.Println(*domain_name)

	flag.Parse()

	switch *run_type {
	case "install":
		{
			fmt.Println("Installing now.")
			install()
		}
	case "daily":
		{
			fmt.Println("Running daily functions.")
			check_health()
		}
	}

	fmt.Println(os.Getwd())

}

func check_health() {
	domain_file, err := ioutil.ReadFile("domain_info.txt")
	if err != nil {
		fmt.Println("Error reading domain file.")
	}

	domain_name := string(domain_file)

	var score int

	uid := os.Geteuid()

	if uid == -1 {
		fmt.Println("Looks like I'm sitting on Windows. :)")
	} else {

		//checking for current running services under root
		cmd := exec.Command("sudo", "lsof", "-nP", "-i")
		out, err := cmd.CombinedOutput()
		if err != nil {
			log.Fatalf("cmd.Run() failed with %s\n", err)
		}

		services_string := string(out)
		services_string_lines := strings.Split(services_string, "\n")
		fmt.Println(services_string_lines[1])

		for _, value := range services_string_lines {
			if strings.Contains(value, "root") {
				fmt.Println("The service:", value, "contains root")
			}
		}

		authenticate(score, &domain_name)

	}

}

type PostRequest struct {
	URL string
}

type Website struct {
	URL          string
	securityFlag bool
}

type Response struct {
	id            string
	URL           string
	securityFlag  bool
	categoryID    int
	RSA_KEY       int
	hash          string
	fromwhitelist bool
	createdAt     string
	updatedAt     string
}

func authenticate(score int, domain_name *string) {
	fmt.Println("My domain name:", *domain_name)
	fmt.Println(score)
	fmt.Println("UID of myself:", os.Geteuid())
	name, _ := os.Hostname()
	fmt.Println("Hostname of myself:", name)

	//http/net business, creating client for outbound requests
	client := &http.Client{}

	if score > 3 {
		fmt.Println("Bad score sorry.")
	} else {
		site := Website{
			URL:          *domain_name,
			securityFlag: true,
		}
		json_resp, err := json.Marshal(site)
		req1, err := http.NewRequest(http.MethodPut, "http://54.235.32.250:5432/api/website/update", bytes.NewBuffer(json_resp))
		req1.Header.Set("Content-Type", "application/json; charset=utf-8")
		resp1, err := client.Do(req1)
		fmt.Println(resp1)

		req, err := http.NewRequest("GET", "http://54.235.32.250:5432/api/website?URL="+*domain_name, nil)
		resp, err := client.Do(req)

		if err != nil {
			log.Println(err)
		}

		if resp != nil {
			log.Println("Resp has a response")
			body, err := ioutil.ReadAll(resp.Body)
			defer resp.Body.Close()
			if err != nil {
				log.Println(err)
			}

			var response Response

			err2 := json.Unmarshal(body, &response)
			if err2 != nil {
				fmt.Println(err2)

			}

			fmt.Println(response)

			sb := string(body)
			fmt.Println(sb)
			proof_file, err := os.Create("/var/www/html/proof.txt")
			if err != nil {
				fmt.Println("Error creating proof file. Are you sudo'd?")
			}
			length, err := proof_file.WriteString(sb)
			if err != nil {
				fmt.Println("Error writing to proof file.")

			}
			fmt.Println("Wrote in", length, "bytes")

		}
	}
}

func install() {
	var temp_domain string
	fmt.Println("Please enter the domain name attached to this web server:")
	fmt.Scan(&temp_domain)

	fmt.Println(temp_domain)
	domain_file, err := os.Create("domain_info.txt")
	if err != nil {
		fmt.Println("error making file")

	}
	length, err := domain_file.WriteString(temp_domain)
	if err != nil {
		fmt.Println("error writing to file")
	}
	fmt.Println("length written:", length)
	defer domain_file.Close()

	client := &http.Client{}

	new_request := PostRequest{
		URL: temp_domain,
	}
	json_out, err := json.Marshal(new_request)
	req1, err := http.NewRequest(http.MethodPost, "http://54.235.32.250:5432/api/website/create", bytes.NewBuffer(json_out))
	req1.Header.Set("Content-Type", "application/json; charset=utf-8")
	resp1, _ := client.Do(req1)
	fmt.Println(resp1)

	/*cmd := exec.Command("crontab", "-l", ";", "echo", "* * * * * /home/xom/go/src/letscertify/healthscript")
	out, err := cmd.CombinedOutput()
	if err != nil {
		log.Fatalf("cmd.Run() failed with %s\n", err)
	}
	services_string := string(out)
	services_string_lines := strings.Split(services_string, "\n")
	fmt.Println(services_string_lines[1])*/

}
