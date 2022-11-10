---
title: 'Long day...'
date: 2005-09-08T20:18:00.000-07:00
draft: false

<!-- cspell:ignore Gilles,Vollant's >
---

Today I sat down, looked at the zip problem again, and had it done in around 30 minutes. Hate when that sort of thing happens. At any rate, it is now implemented into my render engine. All shaders, models, and textures are all loaded from a zip file now (with password protection). I added another level of abstraction for the file management, so that all procedures could read from zips or off the hard drive directly. Makes life a whole lot easier. What ended up helping me the most was an article from GameDev:

[http://www.gamedev.net/reference/articles/article1992.asp](http://www.gamedev.net/reference/articles/article1992.asp)

The article was interesting, but mainly the links were useful. Primarily the link to Gilles Vollant's `unzip.h`. I happened upon it yesterday, but it was a much older version that was incompatible with the newest version of zlib. This one worked great! I only made a few slight changes to unzip.h and then added a wrapper for it. Here's a trimmed down version for all of you who would like to work with zip files: [ZipTest](http://www.vfxjournal.net/ZipTest.zip)

Although not well documented, it should help you out if you want to use zip files in your own projects. I included full source as well as the project files for VS7 so you should be good to go. Let me know if there are any terrible bugs in it.

Alright, that's now over so I can get back to the rest of the engine. Yay!
