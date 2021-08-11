"""
Parse http://www.cheeselibrary.com/
"""

from cheese import Cheese, CheeseJsonEncoder
from parser_utils import get_cached_page
from parser_utils import get_data_folder
from parser_utils import get_output_folder
from parser_utils import strip_whitespace

import bs4
from bs4 import BeautifulSoup
import os
import sys
import time
import glob
import codecs
import json
import inspect


def getOutputFolder():
    out_folder = os.path.join(get_output_folder(), "cheese_library")
    if not os.path.exists(out_folder):
        os.makedirs(out_folder)
    return out_folder


def parseCheeseLibrary(library):
    source = 'http://www.cheeselibrary.com/'
    url = source + 'library_of_cheese.html'

    pages = []
    soup = get_cached_page(url, getOutputFolder())
    table = soup.find("table", class_='table_d2e201 usertable main_table')
    for link in table.findAll("a"):
        page = link["href"]
        pages.append(source + page)

    cheese_pages = []
    for page in pages:
        soup = get_cached_page(page, getOutputFolder())
        table = soup.find("table", class_='usertable')
        if table != None:
            links = table.findAll("a")
            for link in links:
                page = link["href"]
                cheese_pages.append(source + page)
        else:
            print("Failed to find cheese information for " + page)

    for cheese_page in cheese_pages:
        soup = get_cached_page(cheese_page, getOutputFolder())
        cheese = Cheese()
        master_table = soup.find("body").table.findAll(
            "tr", recursive=False)[2]
        master_data_table = master_table.find(
            "table").findAll("tr", recursive=False)
        cheese.name = strip_whitespace(master_data_table[0].text)

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
                root_text = unicode(root)
            if ':' in root_text and \
                ':' in chunk_data and \
                    not root_text in chunk_data:
                data = strip_whitespace(chunk_data)
                data_split = data.split(':')
                type = strip_whitespace(data_split[0]).lower()
                value = strip_whitespace(data_split[1])
                if type == 'country':
                    cheese.origin = value
                elif type == 'region':
                    cheese.region = value
                elif type == 'texture':
                    cheese.texture = value
                elif type == 'type of':
                    cheese.made_from = value
                elif type == 'aging':
                    cheese.age = value
                elif type == 'pasteurized':
                    cheese.texture = value
                chunk_data = ''
            if root_text not in chunk_data and (
                "Aging Time:" not in root_text or "Texture:" not in root_text
            ):
                chunk_data += root_text
            if isinstance(root, bs4.Tag) and root.name == 'img':
                break
            root = root.next_element

        cheese.description = strip_whitespace(cheese_data_and_summary[1].text)

        if not library.add(cheese, source):
            break

    return
