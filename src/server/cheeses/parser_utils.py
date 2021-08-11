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
from math import cos, sin, atan2, sqrt, degrees, radians
import json
import geopy

def get_root():
    root = os.path.dirname(os.path.realpath(__file__))
    out_folder = os.path.abspath(os.path.join(root, os.path.pardir, os.path.pardir))
    return out_folder

def get_output_folder():
    root = os.path.dirname(os.path.realpath(__file__))
    out_folder = os.path.join(root, "output")
    return out_folder

def get_data_folder():
    out_folder = os.path.join(get_root(), "data", "cheeses")
    return out_folder

def get_map_folder():
    out_folder = os.path.join(get_root(), "data", "map")
    return out_folder

def get_env():
    file = os.path.join(get_root(), ".env")
    env = dict()
    with open(file) as f:
        for line in f:
            vals = line.split('=')
            key = vals[0].strip()
            value = vals[1].strip()
            env[key] = value
    return env


def get_country_coordinates(country):
    """
    Return (latitude, longitude) either from disk or from the internet
    """

    coord = (0.0, 0.0)
    env = get_env()

    locationReceived = False

    if not locationReceived:
        coords_path = os.path.join(get_map_folder(), "countries", "country-geo-cordinations.json")
        if os.path.exists(coords_path):
            with open(coords_path) as data_file:    
                try:
                    coords = json.load(data_file)
                    for c in coords:
                        if c["country"] == country:
                            top_left = (c["north"], c["west"])
                            bottom_right = (c["south"], c["east"])
                            coord = center_geolocation( [top_left, bottom_right] )
                            locationReceived = True
                            break
                except ex:
                    print("Failed to load file")
                    print(ex)

    if not locationReceived:
        try:
            google = geopy.GoogleV3(
                api_key=env['GOOGLE_API_KEY_SERVER'] )
            address = google.geocode(country)
            coord = (address.latitude, address.longitude)
            locationReceived = True
        except:
            locationReceived = False;

    return coord


def extract_elements_from_sentence(sentence):
    o = sentence.split(u' and')
    out = []
    for origin in o:
        out.extend(origin.split(u','))
    out = map(unicode.strip, out)
    return out


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

#
# https://gist.github.com/amites/3718961
#
# Return (lat, long)
#
def center_geolocation(geolocations):
    """
    Provide a relatively accurate center lat, lon returned as a list pair, given
    a list of list pairs.
    ex: in: geolocations = ((lat1,lon1), (lat2,lon2),)
        out: (center_lat, center_lon)
    """
    x = 0
    y = 0
    z = 0

    for lat, lon in geolocations:
        lat = radians(float(lat))
        lon = radians(float(lon))
        x += cos(lat) * cos(lon)
        y += cos(lat) * sin(lon)
        z += sin(lat)

    x = float(x / len(geolocations))
    y = float(y / len(geolocations))
    z = float(z / len(geolocations))

    return ( degrees(atan2(z, sqrt(x * x + y * y))), degrees(atan2(y, x)) ) 
