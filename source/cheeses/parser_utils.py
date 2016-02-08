"""
Some utilties to help with parsing data off website
"""

import os

def get_output_folder():
    root = os.path.dirname(os.path.realpath(__file__))
    out_folder = os.path.join(root, "output")
    return out_folder

def strip_whitespace(text):
    output = text.replace('\n', '')
    output = output.replace('\r', '')
    output = output.strip()
    while output != output.replace('  ', ' '):
        output = output.replace('  ', ' ')
    output = output.replace(" '", "'")
    return output