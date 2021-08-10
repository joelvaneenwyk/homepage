# Dev Notes (Oct 23, 2017)

In updating my blog finally with some dev notes, it became quickly apparent that my website tech was outdated already. Yet another reason I really don't like web dev.

Few things:

* Apparently Bower is now deprecated and need to move to Yarn: [Prevent this by migrating to Yarn](https://bower.io/blog/2017/how-to-migrate-away-from-bower/)
* Currently I maintain a 'private' version and public version of the website. The reasons I did this seem no longer valid.
* I've been paying to have a secure HTTPS version of the site. This no longer seems necessary.

## Chromium Embdedded Foundation (CEF)

As part of this what I'm exploring is the possibility of using CEF inside an game engine, but have the output of the game engine run as an element inside the rendered HTML. So the idea here would be to render the frame into a framebuffer, convert it into something CEF can consume, and have it display it through it's render compositor so that it could be layered appropriately.

This seems like a request others have had as well, but without any solid answers. It's hard to differentiate between OSR (off screen rendering) and this request. However, you can hook into the OSR to handle rendering of certain rects so it's possible you could go through that. Another option would be to do a Pepper plugin like the Flash plugin did.

### Resources

* [Pepper Plugin Docs](https://www.chromium.org/developers/design-documents/pepper-plugin-implementation)
* [CEF Custom Handler](http://magpcss.org/ceforum/viewtopic.php?f=8&t=32&start=10)
* [Rendering to a tag](https://magpcss.org/ceforum/viewtopic.php?f=6&t=13753&start=10&hilit=canvas)
* [Custom image content](https://magpcss.org/ceforum/viewtopic.php?f=6&t=11699&start=0)
* [Display buffer into HTML canvas](https://magpcss.org/ceforum/viewtopic.php?f=6&t=14217&p=33514&hilit=canvas#p33514)
* [Compositing Information](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)
* [Scheme Handler Docs](https://bitbucket.org/chromiumembedded/cef/wiki/GeneralUsage#markdown-header-scheme-handler)
* [CEF Custom Scene](https://thechriskent.com/tag/cefcustomscheme/)
* [OSR issue](https://bitbucket.org/chromiumembedded/cef/issues/518/cef3-add-off-screen-rendering-support)
