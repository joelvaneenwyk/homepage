---
title: "Hugo Website Refresh"
date: 2021-08-11T15:58:26+08:00
lastmod: 2021-08-11T15:58:26+08:00
description: "Switch to Hugo static site"
tags: ["News", "Programming", "Web"]
categories: ["News"]
weight: 1
draft: false
---

Finally made the switch to [Hugo](https://gohugo.io/) after battling with my hand-crafted website for too long. Final straw was that there were just too many out-of-date dependencies which caused everything to break in small and subtle ways. My options were to either spend a lot of time fixing that site or start from scratch. The former option would mean being stuck with hand-crafted garbage that would inevitably break again or switch to something that would last a bit longer (hopefully) and be a bit more battle-tested.

* Was able to trivially migrate Blogger posts with [blog2md](https://github.com/palaniraja/blog2md). Only downside was some of the files resulted in errors in Hugo that gave me no valuable information at all. Turns out the issue was due to comments not being handled properly.

    ```shell
    Error: Error building site: failed to render pages:
        render of "page" failed:
        execute of template failed:
            template: posts/single.html:85:140:
            executing "content" at <partial "function/content.html">:
            error calling partial: "D:\Projects\joelvaneenwyk\joelvaneenwyk-homepage\themes\base\layouts\partials\function\content.html:4:19":
        execute of template failed:
            template: partials/function/content.html:4:19:
            executing "partials/function/content.html" at <partial "function/ruby.html" $content>:
            error calling partial: partial that returns a value needs a non-zero
    argument.
    ```
