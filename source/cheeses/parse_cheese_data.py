"""
parse_cheese_data.py

Parses SR22 data and cheeses.com and generates JSON files.
"""

from bs4 import BeautifulSoup
import urlparse
from urllib2 import urlopen
from urllib import urlretrieve
import os
import sys
import time
import glob
from random import randint
import codecs
import json
import inspect

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

def strip_whitespace(text):
    output = text.replace('\n', '')
    output = output.replace('\r', '')
    output = output.strip()
    while output != output.replace('  ', ' '):
        output = output.replace('  ', ' ')
    output = output.replace(" '", "'")
    return output
    

def main():
    doParseCheeseWeb = True
    doParseSR22 = False

    if doParseCheeseWeb:
        parseCheeseWeb()

    if doParseSR22:
        parseSR22()

def parseFdaLine(line):
    fields = []
    for field in line.split('^'):
        fields.append(field.strip('~'))
    return fields

def parseFdaFileUniqueDict(filename):
    output = {}
    lines = open(filename,'r').readlines()
    for line in lines:
        fields = parseFdaLine(line)
        output[fields[0]] = fields[1:]
    return output

def parseFdaFileArray(filename):
    output = {}
    lines = open(filename,'r').readlines()

    # For debugging so that it doesn't parse forever
    numLineLimit = 1000
    lineIndex = 0

    for line in lines:
        fields = parseFdaLine(line)
        if not output.has_key(fields[0]):
            output[fields[0]] = []
        output[fields[0]].append(fields[1:])
        lineIndex += 1
        if lineIndex > numLineLimit:
            break
    return output
    

def parseSR22():
    root = os.path.dirname(os.path.realpath(__file__))
    sr22 = os.path.join(root, 'sr22')
    food_descriptions_filename = os.path.join(sr22, 'FOOD_DES.txt')
    food_descriptions = parseFdaFileUniqueDict(food_descriptions_filename)

    food_groups_filename = os.path.join(sr22, 'FD_GROUP.txt')
    food_groups = parseFdaFileUniqueDict(food_groups_filename)

    nutritional_data_filename = os.path.join(sr22, 'NUT_DATA.txt')
    nutritional_data = parseFdaFileArray(nutritional_data_filename)

    nutritional_definitions_filename = os.path.join(sr22, 'NUTR_DEF.txt')
    nutritional_definitions = parseFdaFileUniqueDict(nutritional_definitions_filename)

    food_descriptions_headers = ['FdGrp_Cd', 'Long_Desc', 'Shrt_Desc', 'ComName']
    nutritional_data_headers = ['Nutr_No', 'Nutr_Val', 'Num_Data_Pts', 'ComName']
    nutritional_definition_headers = ['Units', 'Tagname', 'NutrDesc']

    for (ndb_no, food) in food_descriptions.iteritems():
        if ndb_no in nutritional_data:
            nutritions = nutritional_data[ndb_no]
            food_name = food[ food_descriptions_headers.index('Shrt_Desc') ]
            print(food_name)
            for nutrition in nutritions:
                nutritional_definition_index = nutrition[nutritional_data_headers.index('Nutr_No')]
                nutritional_definition = nutritional_definitions[nutritional_definition_index]
                value = nutrition[ nutritional_data_headers.index('Nutr_Val') ]
                units = nutritional_definition[ nutritional_definition_headers.index('Units') ]
                name = nutritional_definition[ nutritional_definition_headers.index('NutrDesc') ]
                if float(value) > 0 and not ':' in name:
                    print('%s %s %s' % (value, name, units))
    
def parseCheeseWeb():
    url = 'http://www.cheese.com/alphabetical/?page=%d&per_page=20&i=%s#top'
    root = os.path.dirname(os.path.realpath(__file__))
    out_folder = os.path.join(root, "output")
    if not os.path.exists(out_folder):
        os.makedirs(out_folder)
    letters = map(chr, range(97, 123))

    findCheeseTypes = False
    if findCheeseTypes:
        for letter in letters:
            lastPage = False
            lastPageData = ""
            currentPage = 0
            while not lastPage:
                currentUrl = url % (currentPage, letter)   
                outputFile = os.path.join(out_folder, "cheese_%s_page%d.html" % (letter, currentPage))
                if os.path.exists(outputFile):
                    f = codecs.open(outputFile, encoding='utf-8')
                    lastPageData = f.read()
                    currentPage += 1
                else:
                    print('Parsing %s' % currentUrl)         
                    html = urlopen(currentUrl)
                    soup = BeautifulSoup(html, 'html.parser')
                    data = soup.prettify()
                    if data == lastPageData:
                        lastPage = True
                    else:
                        file = open(outputFile, "w")
                        file.write(data.encode('utf8'))
                        file.close()
                        currentPage += 1
                        lastPageData = data

                    sleepTime = randint(0,5)
                    time.sleep(sleepTime)

    parseCheeseFiles = False
    if parseCheeseFiles:
        cheesesFiles = glob.glob(out_folder + "\\cheese*.html")
        for cheeseFile in cheesesFiles:
            data = open(cheeseFile,'r').read()
            soup = BeautifulSoup(data, 'html.parser')
            for div in soup.findAll("div", class_='unit'):
                type = div.a["href"]
                currentUrl = 'http://www.cheese.com' + type
                outputFile = os.path.join(out_folder, "type_%s.html" % type[1:-1])
                if os.path.exists(outputFile):
                    print('Skipping %s' % outputFile)   
                else:
                    succeeded = False
                    while not succeeded:
                        try:
                            print('Parsing %s' % currentUrl)         
                            html = urlopen(currentUrl)
                            soup = BeautifulSoup(html, 'html.parser')
                            data = soup.prettify()
                            file = open(outputFile, "w")
                            file.write(data.encode('utf8'))
                            file.close()
                            succeeded = True
                        except:
                            print("Failed to parse URL. Trying again...")
                        sleepTime = randint(0,5)
                        time.sleep(sleepTime)

    cheeseTypesFiles = glob.glob(out_folder + "\\type_*.html")
    data_folder = os.path.join(root, os.path.pardir, os.path.pardir, "data")
    filename = os.path.join(data_folder, "cheeses.json")
    if os.path.exists(filename):
        os.remove(filename)
    file = codecs.open(filename, "a", encoding='utf-8')
    file.write("{\n")
    cheeseIndex = 0
    for cheeseTypeFile in cheeseTypesFiles:
        print(cheeseTypeFile)
        data = codecs.open(cheeseTypeFile).read()
        soup = BeautifulSoup(data, 'html.parser')
        unit = soup.find("div", class_='unit')

        cheese = Cheese()
        tmb = unit.find("div", class_='tmb')
        if tmb != None:
            cheese.image = tmb.a.img["src"]
            credits_div = tmb.find("div")
            if credits_div != None:
                cheese.image_credits = tmb.find("div").getText().strip()
        cheese.name = unit.h3.getText().strip()
        cheese.summary = unit.find("div", class_='summary').p.text.strip()
        for detail in unit.find("ul").findAll("li"):
            body = detail.text.strip()
            if "Made from" in body:
                cheese.made_from = strip_whitespace(body.replace('Made from', ''))
            elif "Country of" in body:
                cheese.origin = strip_whitespace(body.replace('Country of origin:', ''))
            elif "Type:" in body:
                cheese.type = [s.strip() for s in strip_whitespace(body.replace('Type:', '')).split(',')]
            elif "Fat content" in body:
                cheese.fat = strip_whitespace(body.replace('Fat content:', ''))
            elif "Texture:" in body:
                cheese.texture = strip_whitespace(body.replace('Texture:', ''))
            elif "Rind:" in body:
                cheese.rind = strip_whitespace(body.replace('Rind:', ''))
            elif "Colour:" in body:
                cheese.color = strip_whitespace(body.replace('Colour:', ''))
            elif "Flavour" in body:
                cheese.flavor = [s.strip() for s in strip_whitespace(body.replace('Flavour:', '')).split(',')]
            elif "Aroma" in body:
                cheese.aroma = [s.strip() for s in strip_whitespace(body.replace('Aroma:', '')).split(',')]
            elif "Vegetarian" in body:
                cheese.vegetarian = strip_whitespace(body.replace('Vegetarian:', ''))
            elif "Producers" in body:
                cheese.producers = strip_whitespace(body.replace('Producers:', ''))
            elif "Synonyms" in body:
                cheese.synonyms = [s.strip() for s in strip_whitespace(body.replace('Synonyms:', '')).split(',')]
        cheeseIndex += 1
        cheeseJson = ""
        cheeseJson = json.JSONEncoder(indent=4, sort_keys=True).encode( cheese.getDict() )
        cheeseJson = cheeseJson.strip()[1:-1].strip()
        if cheeseIndex < cheeseTypesFiles.count:
            cheeseJson += ",\n"
        file.write(cheeseJson)
    file.write('}')
    file.close()

if __name__ == "__main__":
    main()