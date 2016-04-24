"""
parser_usda.py

Parses data from the USDA text files.
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

def parseUSDA(library):
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
    
