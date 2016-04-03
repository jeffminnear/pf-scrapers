/*
 * pf-scrapers
 * https://github.com/jeffminnear/pf-scrapers
 *
 * Copyright (c) 2016 Jeff Minnear
 * Licensed under the MIT license.
 */

'use strict';

const amazon = require('./amazon-scraper.js');
const gog = require('./gog-scraper.js');
const gm = require('./green-man-scraper.js');
const steam = require('./steam-scraper.js');

const scrapers = [steam, gm, gog, amazon];

module.exports = scrapers;
