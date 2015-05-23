#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <math.h>

#define MAX_PRIME 1000000000
#define MAX_INT ULLONG_MAX

typedef unsigned long long int bigInt; 

int main(int argc, char *argv[]) {

   bigInt n, prime;

   if(argc == 1) {
     printf("Please enter a number to factor as an argument.\n\n");
     exit(0);
  }

   n = strtoull(argv[1], NULL, 10);
   FILE *fp = fopen("primes.txt", "r");
   bigInt sqrtN = (bigInt) sqrt(n); 
   while (fscanf(fp, "%llu", &prime) != EOF && prime <= sqrtN) {
      if(n % prime == 0) {
         printf("%llu = %llu * %llu\n", n, prime, n/prime);
         exit(0);
      }
   }

   printf("%llu is prime.\n", n);
   return 0;
}
