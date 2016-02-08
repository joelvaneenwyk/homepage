import cheese

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

def parseCheese():
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

    # TODO: Download the JPG for the images
    # TODO: Figure out lat / long from https://developers.google.com/maps/documentation/geocoding/intro
