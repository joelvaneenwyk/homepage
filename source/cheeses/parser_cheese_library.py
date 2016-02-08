import cheese
import parser_utils

import bs4
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
from urlparse import urlparse, urlsplit

def getOutputFolder():
    out_folder = os.path.join(parser_utils.get_output_folder(), "cheese_library")
    if not os.path.exists(out_folder):
        os.makedirs(out_folder)
    return out_folder

def getCachedPage(page):
    result = None
    url = urlsplit(page)
    pagename = url.path.split('/')[-1]
    outputFile = os.path.join(getOutputFolder(), pagename)
    if os.path.exists(outputFile):
        f = codecs.open(outputFile, encoding='utf-8')
        data = f.read()
        result = BeautifulSoup(data, 'html.parser')
    else:
        print('Parsing %s' % page)         
        html = urlopen(page)

        # Always sleep for 1 to 5 seconds so that we don't get blocked
        sleepTime = randint(1, 5)
        time.sleep(sleepTime)

        soup = BeautifulSoup(html, 'html.parser')
        data = soup.prettify()
        file = open(outputFile, "w")
        file.write(data.encode('utf8'))
        file.close()
        result = soup
    return  result

def parseCheeseLibrary():
    base_url = 'http://www.cheeselibrary.com/'
    url = base_url + 'library_of_cheese.html'

    pages = []
    soup = getCachedPage(url)
    table = soup.find("table", class_='table_d2e201 usertable main_table')
    for link in table.findAll("a"):
        page = link["href"]
        pages.append(base_url + page)

    cheese_pages = []
    for page in pages:
        soup = getCachedPage(page)
        table = soup.find("table", class_='usertable')
        if table != None:
            links = table.findAll("a")
            for link in links:
                page = link["href"]
                cheese_pages.append(base_url + page)
        else:
            print("Failed to find cheese information for " + page)
    
    for cheese in cheese_pages:
        soup = getCachedPage(cheese)
        name = soup.find("meta").title.text
        master_table = soup.find("body").table.findAll("tr", recursive=False)[2]
        master_data_table = master_table.find("table").findAll("tr", recursive=False)
        cheese_header = parser_utils.strip_whitespace(master_data_table[0].text)
        print(cheese_header)

        cheese_data_and_summary = master_data_table[1].findAll("td")
        cheese_data_divs = cheese_data_and_summary[0].findAll("div")
        for div in cheese_data_divs:
            if "Country:" in div.text:
                cheese_data = div
                break
        chunk_data = ""
        root = cheese_data.next_element
        while root != None:
            root_text = ''
            if isinstance(root, bs4.Tag):
                root_text = root.text
            elif isinstance(root, bs4.NavigableString):
                root_text = unicode(root);
            if ':' in root_text and \
                ':' in chunk_data and \
                not root_text in chunk_data:
                data = parser_utils.strip_whitespace(chunk_data)
                data_split = data.split(':')
                type = parser_utils.strip_whitespace(data_split[0])
                value = parser_utils.strip_whitespace(data_split[1])
                print('%s = %s' % (type, value))
                chunk_data = ''
            if (not root_text in chunk_data) and not ("Aging Time:" in root_text and "Texture:" in root_text):
                chunk_data += root_text 
            if isinstance(root, bs4.Tag) and root.name == 'img':
                break
            root = root.next_element

        cheese_summary = parser_utils.strip_whitespace(cheese_data_and_summary[1].text)
        print(cheese_summary.encode(sys.stdout.encoding, errors='replace'))   