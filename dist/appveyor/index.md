# AppVeyor Explorations


After my very positive experience with Travis CI (see
[Homepage Build](https://travis-ci.org/joelvaneenwyk/homepage)), I decided it was time to take a look at some Windows options for builds. This led me very quickly to [AppVeyor](https://www.appveyor.com/). But unfortunately, I don't have a Windows project to test this on, so I made one up.

I've long been a fan of DosBox and since I follow [DosNostalgic](https://twitter.com/dosnostalgic) I can't help but be reminded daily of how much I love past games. That mixed with my recent adoption of VSCode for my hobby coding (which is slowly deprecating Sublime for me) resulted in me wanting to create a plugin for VSCode to quickly preview sample assembler projects. I decided perhaps the best way to do this was hook into DosBox.

So yeah, I forked off <https://github.com/dreamlayers/em-dosbox> and went at it. I thought about instead starting from <https://github.com/joncampbell123/dosbox-x> especially given the goal they have of targeting the demo scene, but it's a bit more of a deviation from standard DosBox than I wanted. Plus, it'd be nice to perhaps merge some of my work back to mainline someday, though the realist in me thinks that'll never happen.

You can find my work here: <https://github.com/joelvaneenwyk/dosbox>

So the two tasks I wanted to achieve short-term:

* Convert to VS2015
* Have it build automatically with AppVeyor

This was amazingly easy and already working here: <https://ci.appveyor.com/project/joelvaneenwyk/dosbox>

And look how simple the configuration for this is:

~~~~
version: 1.0.{build}
configuration: Release
platform: x86
install:
- cmd: >-
    git submodule update --init --recursive
    python src\version.py include/version.h . none
before_build:
- cmd: build/build_dependencies.bat
build:
  project: visualc_net/dosbox.sln
  verbosity: minimal
~~~~

We live in an amazing time. I wish we had such simple build scripts at work!

Now that this is working, the next step is to get Emscripten build working.

