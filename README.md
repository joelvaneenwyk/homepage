# Joel Van Eenwyk Homepage

[![Build Status](https://travis-ci.org/joelvaneenwyk/homepage.svg?branch=master)](https://travis-ci.org/joelvaneenwyk/homepage)
[![Build Status](https://ci.appveyor.com/api/projects/status/github/joelvaneenwyk/homepage?branch=master&svg=true)](https://ci.appveyor.com/project/joelvaneenwyk/homepage)

[![Code Climate](https://codeclimate.com/github/joelvaneenwyk/homepage/badges/gpa.svg)](https://codeclimate.com/github/joelvaneenwyk/homepage) [![Test Coverage](https://codeclimate.com/github/joelvaneenwyk/homepage/badges/coverage.svg)](https://codeclimate.com/github/joelvaneenwyk/homepage/coverage)

[![Dependency Status](https://david-dm.org/joelvaneenwyk/homepage.svg)](https://david-dm.org/joelvaneenwyk/homepage)

[![Stories in Ready](https://badge.waffle.io/joelvaneenwyk/homepage.png?label=ready&title=Ready)](https://waffle.io/joelvaneenwyk/homepage)

This is the source code for the homepage of Joel Van Eenwyk (https://www.joelvaneenwyk.com). Going open source was not my original plan for this, but there are a lot of benefits to doing this. Perhaps my favorite reason being continuous integration (CI) support for free if hosted on a public repository.

The staging branch is also deployed automatically to Heroku here: http://jvaneenwyk.herokuapp.com/

![Joel Van Eenwyk](source/joelvaneenwyk/www/images/stamp.png)

Source for the website is in *source/joelvaneenwyk/*

## Install (Windows)

1. Install NodeJS (https://nodejs.org/en/download/)
2. Install Heroku Toolbelt (https://toolbelt.heroku.com/)
3. Install JDK (needed by htmllint)
4. Run 'prompt.bat' from the root
5. Run 'copy .env.template env'
6. Update GITHUB_TOKEN
7. Run 'npm install -g npm'
8. Run 'npm install -g bower'
9. Run 'npm install -g grunt'
10. Run 'npm install'
