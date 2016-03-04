#include "StringTokenizer.h"


StringTokenizer::StringTokenizer(string str, string delim)
{

   if ((str.length() == 0) || (delim.length() == 0)) return;

   tokenStr    = str;
   this->delim = delim;

  /*
     Remove sequential delimiter
  */
   unsigned int currentPos = 0;

   while(true)
   {
      if ((currentPos = tokenStr.find(delim,currentPos)) != string::npos)
      {
         currentPos +=delim.length();
         while(tokenStr.find(delim,currentPos) == currentPos)
         {
            tokenStr.erase(currentPos,delim.length());
         }
      }
      else
       break;
   }


   /*
     Trim leading delimiter
   */
   if (tokenStr.find(delim,0) == 0)
   {
      tokenStr.erase(0,delim.length());
   }

   /*
     Trim ending delimiter
   */
   currentPos = 0;
   if ((currentPos = tokenStr.rfind(delim)) != string::npos)
   {
      if (currentPos != (tokenStr.length()-delim.length())) return;
      tokenStr.erase(tokenStr.length()-delim.length(),delim.length());
   }

};

int StringTokenizer::countTokens()
{

   unsigned int prevPos = 0;
   int numTokens        = 0;


   if (tokenStr.length() > 0)
   {
      numTokens = 0;

      unsigned int currentPos = 0;
      while(true)
      {
         if ((currentPos = tokenStr.find(delim,currentPos)) != string::npos)
         {
            numTokens++;
            prevPos     = currentPos;
            currentPos += delim.length();
         }
         else
          break;
      }
      return ++numTokens;
   }
   else
   {
      return 0;
   }

};


bool StringTokenizer::hasMoreTokens()
{
   return (tokenStr.length() > 0);
};


string StringTokenizer::nextToken()
{

   if (tokenStr.length() == 0)
     return "";

   string       tStr ="";
   unsigned int pos  = tokenStr.find(delim,0);

   if (pos != string::npos)
   {
      tStr     = tokenStr.substr(0,pos);
      tokenStr = tokenStr.substr(pos+delim.length(),tokenStr.length()-pos);
   }
   else
   {
      tStr = tokenStr.substr(0,tokenStr.length());
      tokenStr = "";
   }

   return tStr;
};


int  StringTokenizer::nextIntToken()
{
   return atoi(nextToken().c_str());
};


double StringTokenizer::nextFloatToken()
{
   return atof(nextToken().c_str());
};


string StringTokenizer::nextToken(string delimiter)
{

   if (tokenStr.length() == 0)
     return "";

   string       tStr ="";
   unsigned int pos  = tokenStr.find(delimiter,0);

   if (pos != string::npos)
   {
      tStr     = tokenStr.substr(0,pos);
      tokenStr = tokenStr.substr(pos+delimiter.length(),tokenStr.length()-pos);
   }
   else
   {
      tStr = tokenStr.substr(0,tokenStr.length());
      tokenStr = "";
   }

   return tStr;
};


string StringTokenizer::remainingString()
{
   return  tokenStr;
};


string StringTokenizer::filterNextToken(string filterStr)
{
   string       str        = nextToken();
   unsigned int currentPos = 0;

   while((currentPos = str.find(filterStr,currentPos)) != string::npos)
   {
      str.erase(currentPos,filterStr.length());
   }

   return str;
};
