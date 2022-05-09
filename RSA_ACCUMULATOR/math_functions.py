#functions to determine primality, calculate key

import random
import math
import secrets #secrets library allows for the generation of cryptographically strong numbers
import hashlib

def rabin_miller(n):
    if n == 2:
        return True

    if n % 2 == 0:
        return False

    r = 0
    s = n - 1
    while s % 2 == 0:
        r += 1
        s //= 2
    for _ in range(5):
        a = random.randrange(2, n - 1)
        x = pow(a, s, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    return True

def is_prime(num):
    # Return True if num is a prime number. This function does a quicker
    # prime number check before calling rabin_miller().

    if (num < 2):
        return False # 0, 1, and negative numbers are not prime

    # About 1/3 of the time we can quickly determine if num is not prime
    # by dividing by the first few dozen prime numbers. This is quicker
    # than rabin_miller(), but unlike rabin_miller() is not guaranteed to
    # prove that a number is prime.
    lowPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997]

    if num in lowPrimes:
        return True

    # See if any of the low prime numbers can divide num
    for prime in lowPrimes:
        if (num % prime == 0):
            return False

    # If all else fails, call rabin_miller() to determine if num is a prime.
    return rabin_miller(num)

def get_n(p1, p2):
    #check to see if they values entered are prime
    if (is_prime(p1) == False | is_prime(p2) == False):
        return False
    n = p1 * p2
    return n

def gen_prime(x_bits):
    #generates a prime by choosing a random value within a range and checking it until a prime is created
    while True:
        val = secrets.randbelow(pow(2, x_bits)) #returns random int in range 0 to 2^x_bit
        if is_prime(val): #if the generated value is prime
            return val

def gen_distinct_primes(x_bits):
    #generates one prime, then continually generates a second prime until they do not match
    p = gen_prime(x_bits)
    print("finished")
    #n3 = input("how would you rate your experience today?")
    while True:
        q = gen_prime(x_bits)
        while q != p:
            return p, q

def egcd(a, b):
    #get greatest common diviser of 2 integers
    if a == 0:
        return (b, 0, 1)
    else:
        #recursive call
        g, y, x = egcd(b % a, a)
        return (g, x - (b // a) * y, y)

def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
        raise Exception('modular inverse does not exist')
    else:
        return x % m

def str_to_int(a):
    return int.from_bytes(a.encode(), 'little')

#testing
def int_to_str(a):
    return a.to_bytes(math.ceil(a.bit_length() / 8), 'little').decode()

#Hash
def hash_to_prime(x):
    x_bits = 128
    temp = 0
    while True:
        #finds the closest prime integer greater than the value to be hashed
        num = hash_to_length(x + temp, x_bits)
        if is_prime(num):
            return num, temp
        temp = temp + 1
        #print(temp)
        
def hash_to_length(x, x_bits):
    pseudo_random_hex_string = ""
    num_of_blocks = math.ceil(x_bits / 256)
    for i in range(0, num_of_blocks):
        #Calls library function to encrypt using RSA
        pseudo_random_hex_string += hashlib.sha256(str(x + i).encode()).hexdigest()

    if x_bits % 256 > 0:
        pseudo_random_hex_string = pseudo_random_hex_string[int((x_bits % 256)/4):]  #assume it's divisible by 4
    return int(pseudo_random_hex_string, 16)

