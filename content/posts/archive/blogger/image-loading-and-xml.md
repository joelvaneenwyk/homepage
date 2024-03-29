---
title: 'Image loading and XML'
date: 2005-09-04T20:43:00.000-07:00
draft: false
---

Today was much more productive than yesterday. After getting back from shopping (needed some food desperately), I started work on the engine. Previously, my engine only supported `TGA` format for textures, which was fine before, but as this is more generic, it needed more format support. Therefore, looked around a bit and decided to use [DevIL](http://openil.sourceforge.net/). It's open source and under the Lesser GPL (a necessity since the engine might be used commercially). Plus, it supports a host of different formats: JPG, TGA, TIFF, etc etc...all packaged into a nice library. So, got that implemented into my engine and it's working beautifully. The loading code is now very small thanks to the library. I did, however, run into a bit of a hitch when implementing it. For some reason, all textures on the models I tested were completely messed up. Turns out I had to call:

iluFlipImage();

When loading images with the library it loads the images flipped, so you have to unflip it. That was really the only problem I had with it, so that's not too bad.

Now that techniques, passes and all that have been implemented, I now need a way of storing that data to disk. Originally, I had thought of using a simple script to represent a material (like Quake 3 and OGRE), but considering it some more, XML seems to be the better approach. Scripts are easier to read, but I intend on creating a UI for creating materials so that's not a problem. As for speed, parsing an XML file is extremely fast, and [TinyXml](http://www.grinninglizard.com/tinyxml/) is an excellent library for the job. Used the library with Agents, and it worked like a charm. So there...that's what I'm going to do.

So that's pretty much where I stand now. Next on the agenda is to integrate my shader handling classes into the mix, so that I can get some per-pixel lighting, parallax mapping, and all that fun stuff implemented.

Alright, that about does it...another update will be coming tomorrow.
