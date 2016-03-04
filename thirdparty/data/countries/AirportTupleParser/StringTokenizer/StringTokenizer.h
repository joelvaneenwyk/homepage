/*
 ***********************************************************************
 * Class: StringTokenizer                                              *
 * By Arash Partow - 2000                                              *
 * URL: http://www.partow.net/programming/stringtokenizer/index.html   *
 *                                                                     *
 * Copyright Notice:                                                   *
 * Free use of this library is permitted under the guidelines and      *
 * in accordance with the most current version of the Common Public    *
 * License.                                                            *
 * http://www.opensource.org/licenses/cpl.php                          *
 *                                                                     *
 ***********************************************************************
*/



#ifndef INCLUDE_STRINGTOKENIZER_H
#define INCLUDE_STRINGTOKENIZER_H


#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <string>


using namespace std;

class StringTokenizer
{

   public:

    StringTokenizer(string str, string delim);
   ~StringTokenizer(){};

    int    countTokens();
    bool   hasMoreTokens();
    string nextToken();
    int    nextIntToken();
    double nextFloatToken();
    string nextToken(string delim);
    string remainingString();
    string filterNextToken(string filterStr);

   private:

    string  tokenStr;
    string  delim;

};

#endif
