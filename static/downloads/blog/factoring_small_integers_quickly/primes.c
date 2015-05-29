#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#define MAX_PRIME 1000000000
#define MAX_INT ULLONG_MAX

#define NOT_PRIME 1
#define PRIME 0

typedef unsigned long long int bigInt; 

int main() {

   short *nums = (short*) calloc(MAX_PRIME, sizeof(short));
   
   FILE *fp;
   fp = fopen("primes.txt", "w");

   if(fp == NULL) exit(-1);
   
   bigInt i, j, counter = 0;
   for(i = 2; i < MAX_PRIME; i++) {
      if(nums[i] == PRIME) {
         fprintf(fp, "%llu\n", i);
         for(j = i; j < MAX_PRIME; j += i) {
            nums[j] = NOT_PRIME;
         }
      }
   }  

   fclose(fp);
   free(nums);
   return 0;
}