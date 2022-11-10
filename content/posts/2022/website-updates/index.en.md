---
title: "Website Updates and Cleanup"
date: 2022-11-10T15:58:26+08:00
description: "Updating website and repositories"
tags: ["News", "Programming", "Web"]
categories: ["News"]
weight: 1
draft: false
---

Moving to a static website was certainly the right one, but despite the move, I still needed to make quite a few updates once I came back to the site. Some areas that changed:

* Yarn/NPM dependencies needed to be update, see [Upgrade all packages and run audit fixes · joelvaneenwyk/homepage@5f8068a](https://github.com/joelvaneenwyk/homepage/commit/5f8068aaec308cb4a9165ee07d50211d89680284)
  * [yarn-audit-fix](https://www.npmjs.com/package/yarn-audit-fix)
* GitHub actions were deprecated and needed updates, see [Upgrade GitHub actions that were deprecated · joelvaneenwyk/homepage@c89f452](https://github.com/joelvaneenwyk/homepage/commit/c89f452d9ad5f7d9ae204cd1917bfb2cf9a49f98).
  * [GitHub Actions: Deprecating save-state and set-output commands | GitHub Changelog](https://github.blog/changelog/2022-10-11-github-actions-deprecating-save-state-and-set-output-commands/)
