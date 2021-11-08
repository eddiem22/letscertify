# letscertify

My senior seminar project that involves a light, yet effective method of ensuring the security of any
website through several methods, such as validating a webistes presence in a pre-given whitelist
through an RSA accumulator that implements Euler's Formula, and assigns each website URL a private key that
is used through a modulo operation to confirm it is a coprime of a predetermined prime number. A chrome plugin
will be available for the client, which will be able to converse with a remote server that contains a
readily available database, in addition to hosting a website that would provide a regularly updated whitelist.
For websites not available in the whitelist, the provided security scripts would then test several
website vulnerabilities, including XSS injection. By passing a test, the boolean flag of a website's security 
check would be set to True, and false, vice versa. While a website included in the pregiven whitelist
would automatically have its boolean flag set to true, its "From Whitelist" flag would also be set to true as well.
This is done to ensure the user that although the website passed the tests, there is still the posibility
that the website may incorporate a relatively newer method of a malicious attack, or one that we simply may
have looked over. This would, of course, notify the user by informing them that the site is deemed "safe"
by our security scripts, but is not guarenteed to be 100% fully safe. Each client would regularly update
the server with new queries and additional website entries, and would collectively grow larger as more clients
use the application. 
