"""
cheeses.py

Main program that can run various parsers to get cheese data and combine
it together into JSON that's actually usable.
"""

import cheese
import parser_cheese_library
import parser_usda
import parser_cheese
import parser_utils
import sys

COMMAND_LINE_OPTIONS = (
    (('-v', '--verbose'), {'action': 'store', 'dest': 'verbose', 'default': False,
                            'help': 'Print out extra information'}),
    (('--preview',), {'action': 'store_true', 'dest': 'preview', 'default': False,
                    'help': "Preview changes only and don't do any work"})
    )

def main(options):
    library = cheese.CheeseLibrary()

    parser_cheese.parseCheese(library)
    parser_cheese_library.parseCheeseLibrary(library)
    parser_usda.parseUSDA(library)

    library.save()

if __name__ == "__main__":
    from optparse import OptionParser
    PARSER = OptionParser('')
    for options in COMMAND_LINE_OPTIONS:
        PARSER.add_option(*options[0], **options[1])
    (OPTIONS, ARGV) = PARSER.parse_args()
    sys.exit(main(OPTIONS))
