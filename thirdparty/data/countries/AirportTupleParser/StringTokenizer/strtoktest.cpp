/*
 ***********************************************************************
 * StringTokenizer Test Case                                           *
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


#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <string>
#include "StringTokenizer.h"


int main()
{

   //string tempStr = "|x|x|x~|x|x|x~aa~ |x ~b~b |x ~c~c~ |x|x|x|x ~d~d~|xw|xs|xd|x3|x4|xd|xf|x1|x222|xwwww|xgg|xjj|xkk|xvv|x|x22|x#3";
   //StringTokenizer strtok = StringTokenizer(tempStr,"|x");

   string tempStr = "01|02|03|04|05|06|07|08|09|10|11|12";

   StringTokenizer strtok = StringTokenizer(tempStr,"|");


   cout << "Number Of Tokens: " << strtok.countTokens()     << endl;
   cout << "String:           " << strtok.remainingString() << endl;

   int cnt = strtok.countTokens();
   string finalString ="";

   for(int i=0; i < cnt; i++)
   {
      string tempStr ="";
      cout << "Token[" << i << "] ------> [" << (tempStr=strtok./*filterN*/nextToken(/*" "*/)) << "]       ";
      cout << "Token Count" << strtok.countTokens() << endl;
      finalString += tempStr;

   }

   cout << endl << "Final String: " << finalString <<  endl;

   return 1;

}
