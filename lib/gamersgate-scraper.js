#! /usr/bin/env node

/*
 * gamersgate-scraper
 * Copyright (c) 2019 Jeff Minnear
 * Licensed under the MIT license.
 */

const puppeteer = require('puppeteer');

const simplify = require('./simplify');

function ggScraper(args) {
    let ggSearchUrl = "https://www.gamersgate.com/games?prio=relevance&q=";
    let gameSearchUrl = ggSearchUrl + encodeURIComponent(args.title);

    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(gameSearchUrl);

            let items = await page.evaluate(() => {
                let listItems = [];
                document.querySelectorAll('ul.biglist li').forEach(item => {
                    function getPrice(item) {
                        let price;
                        let priceItem = item.querySelector('.big.red');
                        if (!priceItem) {
                            price = item.querySelector('.textstyle1.bigger').innerText;
                        } else {
                            price = priceItem.innerText;
                        }
                        return price;
                    }

                    function getNormalPrice(item) {
                        let normalPrice;
                        let normalPriceItem = item.querySelector('.textstyle1.linethrough');
                        if (!normalPriceItem) {
                            normalPrice = null;
                        } else {
                            normalPrice = normalPriceItem.innerText;
                        }
                        return normalPrice;
                    }

                    let listItem = {
                        title: item.querySelector('a.ttl').getAttribute('title').trim(),
                        price: getPrice(item),
                        normalPrice: getNormalPrice(item),
                        imageURL: item.querySelector('img.loadonscroll').getAttribute('src'),
                        linkURL: item.querySelector('a.ttl').getAttribute('href')
                    }

                    listItems.push(listItem);
                });

                return listItems;
            });

            let results = items.splice(0, args.limit);
            results.forEach(result => {
                result.simplifiedTitle = simplify.simplifyString(result.title);
                result.store = 'gamersgate.com';
            });

            browser.close();
            resolve(results);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = ggScraper;
