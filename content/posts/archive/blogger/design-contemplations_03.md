---
title: 'Design contemplations'
date: 2005-09-03T20:16:00.001-07:00
draft: false
---

Today started out bright and early with a trip to the driving class, which lasted all the way to 4pm. It was quite awful. The class was filled with mostly teenagers, and some people from other countries that had never driven a car before. All that to say I was a bit out of place...college student seeking cheaper insurance...weird. We spent most of the time watching cheesy videos on how people can die from being stupid on the road. It was...special. But it's over, so all is good.

Once I got back from that I switched straight over to the engine. It's really starting to come together. A lot of the base code is now in place and functional, so I'm able to load a mesh and send it to the scene manager, which renders the mesh with the proper materials and everything. Not very special, but since it's been rebuilt from the ground-up with a new design, it's not a shabby accomplishment.

This time around, there were some different priorities. First off, it's not just limited to OpenGL anymore...it has support for any APIs. You just need to create a new class off of the render class, implement a few drawing functions, and you're done. Second, it now has support for shaders via GLSL and HLSL, but again, flexible enough that other languages could be added. Both of these were not priorities in the last engine (just a simple viewport for Agents), but for the game it's very important. Once this render engine is in a more stable/usable state, I will be using it for Agents as well.

On Agents, I need to go into some of the custom controls I made ever so long ago and clean it up a bit. As needs have morphed considerably since the beginning, a lot of changes were made with the "Code and Fix" methodology, which I HATE. Now that I have a good idea of what I need, it needs a rewrite. Plus, the look of the controls is, for the most part, hard-coded, which is very...not good.

Random link for today: [Project Offset](http://projectoffset.com/). If you haven't checked it out already, it has cool tech vids...so go check it out!

Alright, enough ramblings. Off to bed...need to get an early start tomorrow.
