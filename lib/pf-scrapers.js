/*
 * pf-scrapers
 * https://github.com/jeffminnear/pf-scrapers
 *
 * Copyright (c) 2019 Jeff Minnear
 * Licensed under the MIT license.
 */

const gog = require('./gog-scraper');
const gm = require('./green-man-scraper');
const steam = require('./steam-scraper');
const gg = require('./gamersgate-scraper');

const scrapers = [gog, gm, steam, gg];

module.exports = scrapers;
