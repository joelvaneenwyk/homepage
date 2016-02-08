"""
cheeses.py

Main program that can run various parsers to get cheese data and combine
it together into JSON that's actually usable.
"""

import parser_cheese_library
import parser_usda
import parser_cheese

def main():
    doParseCheeseWeb = False
    doParseSR22 = False
    doParseCheeseLibrary = True

    if doParseCheeseLibrary:
        parser_cheese_library.parseCheeseLibrary()

    if doParseCheeseWeb:
        parseCheeseWeb()

    if doParseSR22:
        parseUSDA()

if __name__ == "__main__":
    main()