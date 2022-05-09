# Let's Certify


# **What Is This?**

Our senior project that is centered on creating a self certifying API that provides SELF certification of a server. Whenever a server needs to self-certify itself, it will first download a security script that will test the server's vulnerability to penetration attacks. After passing the tests, the scripts responsible for the tests will then submit to the "Let's Certify" server in hopes for the server to be white listed. "Let's Certify" will maintain a database of the whitelisted server names, which will then be used in a cryptographic technique called an RSA accumulator. To verify if a server is part of the daily updated list of whitelisted servers, the accumulator only needs to perform a power function on a 3072 bit number. In order to make this more practical and applicable to websites visited by the user on their daily browser, a plug in will be developed that will interecept any URL requests, in order to obtain the "Let's Certify" certificate associated with that respective URL. Afterwards, the user will be notified that the website is deemed safe, and the security check is done.

Group members are as follows: Tomasz Mamro, Eduard Marcencov, Justin Graver, Joshua-Ronald Cruz.


- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [Basic writing and formatting syntax](https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/eddiem22/letscertify/settings/pages). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
