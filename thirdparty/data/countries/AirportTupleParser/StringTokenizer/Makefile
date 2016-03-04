#
#  **********************************************************************
#  *                            Makefile                                *
#  *                         StringTokenizer                            *
#  *                                                                    *
#  * Author: Arash Partow - 2000                                        *
#  * URL: http://www.partow.net/programming/stringtokenizer/index.html  *
#  *                                                                    *
#  * Copyright Notice:                                                  *
#  * Free use of this library is permitted under the guidelines and     *
#  * in accordance with the most current version of the Common Public   *
#  * License.                                                           *
#  * http://www.opensource.org/licenses/cpl.php                         *
#  *                                                                    *
#  **********************************************************************
#


CC            =  c++

OPTIONS       = -pedantic -ansi -Wall -o
OPTIONS_LIBS  = -pedantic -ansi -Wall -c


all  : StringTokenizer.o
	$(CC) $(OPTIONS) strtoktest strtoktest.cpp StringTokenizer.o

StringTokenizer.o : StringTokenizer.cpp StringTokenizer.h
	$(CC) $(OPTIONS_LIBS) StringTokenizer.cpp

clean:
	rm -f *.o *.bak


#
# The End !
#

