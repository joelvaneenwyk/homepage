# Joel Van Eenwyk

These are the pages and source for [joelvaneenwyk.github.io](https://joelvaneenwyk.github.io/).

[![Build Status](https://travis-ci.org/joelvaneenwyk/homepage.svg?branch=main)](https://travis-ci.org/joelvaneenwyk/homepage)
[![Build Status](https://ci.appveyor.com/api/projects/status/github/joelvaneenwyk/homepage?branch=main&svg=true)](https://ci.appveyor.com/project/joelvaneenwyk/homepage)
[![Code Climate](https://codeclimate.com/github/joelvaneenwyk/homepage/badges/gpa.svg)](https://codeclimate.com/github/joelvaneenwyk/homepage) [![Test Coverage](https://codeclimate.com/github/joelvaneenwyk/homepage/badges/coverage.svg)](https://codeclimate.com/github/joelvaneenwyk/homepage/coverage)

This is the source code for the homepage of Joel Van Eenwyk (<https://www.joelvaneenwyk.com>). Going open source was not my original plan for this, but there are a lot of benefits to doing this. Perhaps my favorite reason being continuous integration (CI) support for free if hosted on a public repository.

The staging branch is also deployed automatically to Heroku here: <http://jvaneenwyk.herokuapp.com/>

![Joel Van Eenwyk](source/joelvaneenwyk/www/images/stamp.png)

## Links

* 🔒 [jvaneenwyk | Heroku](https://dashboard.heroku.com/apps/jvaneenwyk)

## Structure

* 📃 `app.json` - Defines the application for deploying to Heroku, more details at [app.json Schema | Heroku Dev Center](https://devcenter.heroku.com/articles/app-json-schema).
* 📃 `heroku.yml` - Configuration file for [Heroku](https://devcenter.heroku.com/articles/build-docker-images-heroku-yml) that replaces the [Procfile](https://devcenter.heroku.com/articles/procfile#procfile-and-heroku-yml).
* 📁 `content` - Markdown files and the text content of the site.
* 📁 `static` - Assets not intended to change e.g., stylesheets, images,
etc.

## Principles and Guidelines

Based on the previous version of this site, there were a lot of learnings. The primary take-away is that the previous site was too complicated. This was especially apparent when trying to go back and revise/update it. This is in part poor documentation but also just relying on unreliable technology. Unfortunately, in the world of the web this is hard to avoid -- it moves at an incredible pace and technology you choose **will** get deprecated and replaced by something that may or may not be production ready.

1. Use only statically typed languages i.e., no JavaScript
2. Everything in the project must be linted
3. CI must be enabled from the start
4. Architecture must be well documented

**Keep it simple.**

## Build and Run

1. [Install Hugo](https://gohugo.io/getting-started/installing/)
    * Recommend using [Scoop](https://scoop.sh/) on Windows
2. Install Heroku CLI
3. From the root, run `heroku git:remote -a jvaneenwyk` so that the app name is assigned
4. Install NodeJS
5. Install Yarn
6. Run `yarn install`
7. Run `yarn start` or just `hugo server`

### Windows Setup

1. Install [Scoop](https://scoop.sh/). Open a PowerShell terminal (version 5.1 or later) and run:

    ```pwsh
    # Optional: Needed to run a remote script the first time
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    irm get.scoop.sh | iex
    ```

2. [Install Hugo](https://gohugo.io/getting-started/installing/): `scoop install hugo-extended`
3. Start Hugo server: `hugo server`
