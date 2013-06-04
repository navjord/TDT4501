// (C) Copyright 2009, Jun Zhu (junzhu [at] cs [dot] cmu [dot] edu)

// This file is part of MedLDA.

// MedLDA is free software; you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License, or (at your
// option) any later version.

// MedLDA is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
// for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
// USA

#include "stdafx.h"
#include "utils.h"

double safe_entropy(double *dist, const int &K)
{
	double dEnt = 0;

	for ( int k=0; k<K; k++ ) {
		if ( dist[k] > 1e-30 ) dEnt -= dist[k] * log( dist[k] );
	}

	return dEnt;
}

double log_sum(double log_a, double log_b)
{
	double dval = 0;

	if (log_a < log_b) {
		dval = log_b + log(1 + exp(log_a - log_b));
	} else {
		dval = log_a + log(1 + exp(log_b - log_a));
	}
	return dval;
}

double trigamma(double x)
{
	double p;
	int i;

	x=x+6;
	p=1/(x*x);
	p=(((((0.075757575757576*p-0.033333333333333)*p+0.0238095238095238)
		*p-0.033333333333333)*p+0.166666666666667)*p+1)/x+0.5*p;
	for (i=0; i<6 ;i++)
	{
		x=x-1;
		p=1/(x*x)+p;
	}
	return(p);
}

double digamma(double x)
{
	double p;
	x=x+6;
	p=1/(x*x);
	p=(((0.004166666666667*p-0.003968253986254)*p+
		0.008333333333333)*p-0.083333333333333)*p;
	p=p+log(x)-0.5/x-1/(x-1)-1/(x-2)-1/(x-3)-1/(x-4)-1/(x-5)-1/(x-6);
	return p;
}


double log_gamma(double x)
{
	double z=1/(x*x);

	x=x+6;
	z=(((-0.000595238095238*z+0.000793650793651)
		*z-0.002777777777778)*z+0.083333333333333)/x;
	z=(x-0.5)*log(x)-x+0.918938533204673+z-log(x-1)-
		log(x-2)-log(x-3)-log(x-4)-log(x-5)-log(x-6);
	return z;
}

int argmax(double* x, const int &n)
{
	double max = x[0];
	int argmax = 0;
	for (int i=1; i<n; i++) {
		if (x[i] > max) {
			max = x[i];
			argmax = i;
		}
	}

	return argmax;
}
