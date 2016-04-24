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
        self.locations_filename = os.path.abspath(os.path.join(parser_utils.get_data_folder(), "locations.json"))
        self.locations = dict()
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

        if cheese.origin != "":
            o = cheese.origin.split(u' and')
            cheese.origin = []
            for origin in o:
                cheese.origin.extend(origin.split(u','))
            
            cheese.origin = map(unicode.strip, cheese.origin)
            for location in cheese.origin:
                location = location.replace("countries throughout the world", "")
                location = location.replace("Swtizerland", "Switzerland")
                location = location.replace("Originally in", "")   
                location = location.strip()
                if location != "":
                    if not location in self.locations:
                        self.locations[location] = 0
                    self.locations[location] += 1

        if not cheese.name in self.cheeses:
            self.cheeses[cheese.name] = cheese

        print("Adding " + display_name)
        
    

    def save(self):
        jsonData = json.dumps( self.cheeses, indent=4, sort_keys=True, cls=CheeseJsonEncoder )
        file = codecs.open(self.filename, "w", encoding='utf-8')
        file.write(jsonData)

        jsonData = json.dumps( self.locations, indent=4, sort_keys=True )
        file = codecs.open(self.locations_filename, "w", encoding='utf-8')
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
