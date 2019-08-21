#! /usr/bin/env node

/*
 * green-man-scraper
 * Copyright (c) 2019 Jeff Minnear
 * Licensed under the MIT license.
 */

const puppeteer = require('puppeteer');

const simplify = require('./simplify');

function gmScraper(args) {
    const baseUrl = "http://www.greenmangaming.com";
    let gameSearchUrl = baseUrl + '/search/' + encodeURIComponent(args.title);

    return new Promise (async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(gameSearchUrl);

            let items = await page.evaluate(() => {
                let listItems = [];
                document.querySelectorAll('li[ng-repeat="product in search.results"]').forEach(item => {
                    let listItem = {
                        title: item.querySelector('p.prod-name').innerHTML,
                        price: item.querySelector('.current-price price span').innerHTML,
                        imageURL: item.querySelector('.media-object img').getAttribute('src'),
                        linkURL: item.querySelector('.media-object a').getAttribute('href')
                    }

                    if (item.querySelector('.prev-price price span')) {
                        listItem.normalPrice = item.querySelector('.prev-price price span').innerHTML;
                    } else {
                        listItem.normalPrice = null;
                    }

                    listItems.push(listItem);
                });
                return listItems;
            });
            
            let results = items.splice(0, args.limit);
            results.forEach(result => {
                result.linkURL = baseUrl + result.linkURL;
                result.simplifiedTitle = simplify.simplifyString(result.title);
                result.store = 'greenmangaming.com';
                result.normalPrice = result.normalPrice === result.price ? null : result.normalPrice;
            });

            browser.close();
            return resolve(results);
        } catch (err) {
            return reject(err);
        }
    });
};

module.exports = gmScraper;
