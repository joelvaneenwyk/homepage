# Joel Van Eenwyk

These are the pages and source for [joelvaneenwyk.github.io](https://joelvaneenwyk.github.io/).

## Principles and Guidelines

Based on the previous version of this site, there were a lot of learnings. The primary take-away is that the previous site was too complicated. This was especially apparent when trying to go back and revise/update it. This is in part poor documentation but also just relying on unreliable technology. Unfortunately, in the world of the web this is hard to avoid -- it moves at an incredible pace and technology you choose **will** get deprecated and replaced by something that may or may not be production ready.

1. Use only statically typed languages i.e., no JavaScript
2. Everything in the project must be linted
3. CI must be enabled from the start
4. Architecture must be well documented

**Keep it simple.**

## Setup

1. [Install Hugo](https://gohugo.io/getting-started/installing/)
    * Recommend using [Scoop](https://scoop.sh/) on Windows
2. Run `hugo serve` to see page live in a browser

### Building

`hugo build`

### Development

1. Install Yarn 3.x
2. Run `yarn install`

## Templates

Current Hugo template is not ideal as it does not have good support for blog content (time-based content) along with general documentation and/or articles. Some other options:

* [Goldydocs](https://example.docsy.dev/)
* [Portio](https://portio-hugo.staticmania.com/)
* [hugoBasicExample: Example site to use with Hugo & Hugo Themes](https://github.com/gohugoio/hugoBasicExample)
