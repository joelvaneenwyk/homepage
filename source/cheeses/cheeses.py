"""
cheeses.py

Main program that can run various parsers to get cheese data and combine
it together into JSON that's actually usable.
"""

import cheese
import parser_cheese_library
import parser_usda
import parser_cheese

COMMAND_LINE_OPTIONS = (
    (('-v', '--verbose'), {'action': 'store', 'dest': 'verbose', 'default': False,
                             'help': 'Print out extra information'}),
    (('--preview',), {'action': 'store_true', 'dest': 'preview', 'default': False,
                     'help': "Preview changes only and don't do any work"})
    )

def main():
    library = cheese.CheeseLibrary()

    parser_cheese.parseCheese(library)
    parser_cheese_library.parseCheeseLibrary(library)
    parser_usda.parseUSDA(library)

    library.save()

if __name__ == "__main__":
    main()