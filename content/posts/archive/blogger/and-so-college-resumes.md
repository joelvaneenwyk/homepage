---
title: 'And so college resumes...'
date: 2005-10-16T21:40:00.000-07:00
draft: false
---

It was certainly nice to have a bit of a break. I still did some homework, but I tried really hard to relax as much as possible. Worked some more on my engine and website...both are coming along nicely. Ran into somewhat of a snag with the engine, though.

Was trying to split the engine up into separate dynamic libraries (they were all static before), and it was extremely easy for the render engine and scene graph, but my custom controls made in wxWidgets was a serious pain. Essentially, I wanted to compile a library that contained all of wxWidgets functions as well as my own, but it seems the only way to do this is include all the source files of wxWidgets into my project to compile it to a library. Strangely enough, you can't compile the static library of wxWidgets into your own dynamic library. I asked around on the wxWidgets forums, and that seems to be their conclusion as well. Seems terribly bizarre, but I'm not going to worry about it until I need to when I make an official release. Unfortunately, that whole mess pretty much killed my Friday as I worked most of the day on it....rather disappointing.

On the bright side, I played some B&W 2 as well as some SSX on Tour. Both are very fun games, but I actually enjoyed SSX on Tour a lot more. The moves are cool and there's a lot you can do. Then again, I love to ski, so that could have something to do with it. Not saying I don't like playing god once in a while, but it certainly gets old after a while. :)

Think that pretty much sums up the last few days. Hope you all had a great weekend!

EDIT: Was looking through the cg char forums and found this: [TSM 2.0](http://cgchar.toonstruck.com/forum/index.php?topic=4857.0). It's a really nice rig for Maya that's being developed for TSM 2.0. Go check it out!
