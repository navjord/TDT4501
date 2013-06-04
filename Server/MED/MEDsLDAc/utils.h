#ifndef UTILS_H
#define UTILS_H

#include <stdio.h>
#include <math.h>
#include <float.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <sys/types.h>

double log_sum(double log_a, double log_b);
double trigamma(double x);
double digamma(double x);
double log_gamma(double x);
int argmax(double* x, const int &n);

double safe_entropy(double *dist, const int &K);

#endif