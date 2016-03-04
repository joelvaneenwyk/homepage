/*
  ********************************************************************
  *                                                                  *
  *                Airport Database Tuple Parser                     *
  * Author: Arash Partow - 2002                                      *
  * URL: http://www.partow.net                                       *
  *                                                                  *
  * Copyright Notice:                                                *
  * Free use of this library is permitted under the guidelines and   *
  * in accordance with the most current version of the Common Public *
  * License.                                                         *
  * http://www.opensource.org/licenses/cpl.php                       *
  *                                                                  *
  ********************************************************************
*/


#include <stdio.h>
#include <stdlib.h>
#include "StringTokenizer/StringTokenizer.h"



void parseAirport(std::string data);

int main(void)
{


   parseAirport("EDDF:FRA:FRANKFURT MAIN:FRANKFURT:GERMANY:50:01:35:N:08:32:35:E:0364 ");

   exit(EXIT_SUCCESS);
   return true;

}


void parseAirport(std::string data)
{

 /*

    Airport Tuple contains the following pieces of information:

    01.)Airport ICAO Code (4)
    02.)Airport IATA (3)
    03.)Airport Name (?)
    04.)City or Town or Suburb (?)
    05.)Country (?)
    06.)Latitude Degrees (2)
    07.)Latitude Minutes (2)
    08.)Latitude Seconds (2)
    09.)Latitude Direction (2)
    10.)Longitude Degrees (1)
    11.)Longitude Minutes (2)
    12.)Longitude Seconds (2)
    13.)Longitude Direction (1)
    14.)Altitude (?)

 */



   StringTokenizer strtok = StringTokenizer(data,":");


   /* Extract ICAO Code */
   if (strtok.hasMoreTokens()) std::cout << "ICAO Code:           "  << strtok.nextToken()                << std::endl;

   /* Extract IATA Code */
   if (strtok.hasMoreTokens()) std::cout << "IATA Code:           "  << strtok.nextToken()                << std::endl;

   /* Extract Airport Name */
   if (strtok.hasMoreTokens()) std::cout << "Airport Name:        "  << strtok.nextToken()                << std::endl;

   /* Extract Town/City Name */
   if (strtok.hasMoreTokens()) std::cout << "Town\\City:           " << strtok.nextToken()                << std::endl;

   /* Extract Country Name */
   if (strtok.hasMoreTokens()) std::cout << "Country:             "  << strtok.nextToken()                << std::endl;

   /*  Extract Latitude Degree      */
   if (strtok.hasMoreTokens()) std::cout << "Latitude Degree:     "  << atoi(strtok.nextToken().c_str())  << std::endl;

   /*  Extract Latitude Minute      */
   if (strtok.hasMoreTokens()) std::cout << "Latitude Minute:     "  << atoi(strtok.nextToken().c_str())  << std::endl;

   /*  Extract Latitude Second      */
   if (strtok.hasMoreTokens()) std::cout << "Latitude Second:     "  << atoi(strtok.nextToken().c_str())  << std::endl;

   /*  Extract Latitude Direction   */
   if (strtok.hasMoreTokens()) std::cout << "Latitude Direction:  "  << strtok.nextToken()[0]             << std::endl;

   /*  Extract Longitude Degree     */
   if (strtok.hasMoreTokens()) std::cout << "Longitude Degree:    "  << atoi(strtok.nextToken().c_str())  << std::endl;

   /*  Extract Longitude Minute     */
   if (strtok.hasMoreTokens()) std::cout << "Longitude Minute:    "  << atoi(strtok.nextToken().c_str())  << std::endl;

   /*  Extract Longitude Second     */
   if (strtok.hasMoreTokens()) std::cout << "Longitude Second:    "  << atoi(strtok.nextToken().c_str())  << std::endl;

   /*  Extract Longitude Direction  */
   if (strtok.hasMoreTokens()) std::cout << "Longitude Direction: "  << strtok.nextToken()[0]             << std::endl;

   /*  Extract Altitude             */
   if (strtok.hasMoreTokens()) std::cout << "Altitude:            "  << atoi(strtok.nextToken().c_str())  << std::endl;


};
