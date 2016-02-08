import json

class Cheese():
    image = ''
    image_credits = ''
    name = ''
    summary = ''
    made_from = ''
    origin = ''
    type = ''
    fat = ''
    texture = ''
    rind = ''
    color = ''
    flavor = ''
    aroma = ''
    vegetarian = ''
    producers = ''
    synonyms = []

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
        return o.getDict()
