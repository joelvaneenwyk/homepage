import json
import inspect    
import os
import parser_utils
import codecs
import pprint
import copy

class CheeseLibrary():
    def __init__(self):
        self.cheeses = dict()
        self.filename = os.path.abspath(os.path.join(parser_utils.get_data_folder(), "cheeses.json"))
        self.load()

    def load(self):
        if os.path.exists(self.filename):
            with open(self.filename) as data_file:    
                try:
                    self.cheeses = json.load(data_file)
                except:
                    self.cheeses = dict()

    def add(self, cheese, source):
        try:
            # Make sure the name is UTF8
            cheese.name = cheese.name.decode('utf-8', errors='replace')
        except:
            # Ignore this because it just means that it's already decoded to Unicode
            print("Failed to decode cheese name")

        try:
            # Make the display name a string if possible
            display_name = cheese.name.encode('cp850', errors='replace')
        except:
            print("Failed to generate display name")

        if not cheese.name in self.cheeses:
            self.cheeses[cheese.name] = cheese
        else:
            print(display_name + " already in database!")

        print("Adding " + display_name)
        
    

    def save(self):
        if os.path.exists(self.filename):
            os.remove(self.filename)

        jsonData = json.dumps( self.cheeses, indent=4, sort_keys=True, cls=CheeseJsonEncoder )

        file = codecs.open(self.filename, "w", encoding='utf-8')
        file.write(jsonData)

class Cheese():
    image = ''
    sources = []
    image_credits = ''
    name = ''
    summary = ''
    made_from = ''
    origin = ''
    region = ''
    type = ''
    fat = ''
    texture = ''
    rind = ''
    age = ''
    color = ''
    flavor = ''
    aroma = ''
    vegetarian = ''
    producers = ''
    pasteurized = ''
    synonyms = []
    description = ''

    def __init__(self):
        name = ''

    def getDict(self):
        test = dict(inspect.getmembers(self))
        del test['__init__']
        del test['__module__']
        del test['__doc__']
        del test['getDict']
        result = copy.copy(test)
        for key, value in test.iteritems():
            if value == '' or len(value) == 0:
                del result[key]
        return result

class CheeseJsonEncoder(json.JSONEncoder):
    def default(self, o):
        self.indent="\t"
        self.sort_keys=True
        return o.getDict()
