import json

class Cheese():
    image = ''
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
        output = {}
        output[self.name] = test
        return output

class CheeseJsonEncoder(json.JSONEncoder):
    def default(self, o):
        self.indent=4
        self.sort_keys=True
        return o.getDict()
