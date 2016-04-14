"""
Some utilties to help with parsing data off website
"""

import os

from urllib2 import urlopen
from urllib import urlretrieve
from urlparse import urlparse, urlsplit
from random import randint
from bs4 import BeautifulSoup
import codecs

def get_output_folder():
    root = os.path.dirname(os.path.realpath(__file__))
    out_folder = os.path.join(root, "output")
    return out_folder

def get_data_folder():
    root = os.path.dirname(os.path.realpath(__file__))
    out_folder = os.path.join(root, os.path.pardir, os.path.pardir, "data", "cheeses")
    return out_folder

def strip_whitespace(text):
    output = text.replace('\n', '')
    output = output.replace('\r', '')
    output = output.strip()
    while output != output.replace('  ', ' '):
        output = output.replace('  ', ' ')
    output = output.replace(" '", "'")
    return output

def get_cached_page(page, folder):
    result = None
    url = urlsplit(page)
    pagename = url.path.split('/')[-1]
    outputFile = os.path.join(folder, pagename)
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
