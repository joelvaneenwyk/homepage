#
#  ********************************************************************
#  *                         Makefile                                 *
#  * Airport Tuple Parser                                             *
#  *                                                                  *
#  * Author: Arash Partow - 2002                                      *
#  * URL: http://www.partow.net                                       *
#  *                                                                  *
#  * Copyright Notice:                                                *
#  * Free use of this library is permitted under the guidelines and   *
#  * in accordance with the most current version of the Common Public *
#  * License.                                                         *
#  * http://www.opensource.org/licenses/cpl.php                       *
#  *                                                                  *
#  ********************************************************************
#


CC               = -c++
OPTIONS          = -pedantic -ansi -Wall -o
OPTIONS_LIBS     = -pedantic -ansi -Wall -c


CPP_SRC = StringTokenizer/StringTokenizer.cpp


OBJECTS = $(CPP_SRC:.cpp=.o)


%.o: %.h %.cpp
	$(CC) $(OPTIONS_LIBS) $*.cpp -o $@


all: $(OBJECTS) AirportParser


AirportParser: $(OBJECTS) AirportParser.cpp
	$(CC) $(OPTIONS) AirportParser AirportParser.cpp  $(OBJECTS)


clean:
	rm -f core *.o *.bak *stackdump *#
	rm -f StringTokenizer/core StringTokenizer/*.o StringTokenizer/*.bak StringTokenizer/*stackdump

 

#
# The End !
#
  