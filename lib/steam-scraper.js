#! /usr/bin/env node

/*
 * steam-scraper
 * Copyright (c) 2016 Jeff Minnear
 * Licensed under the MIT license.
 */


const request = require('request');
const cheerio = require('cheerio');
const simplify = require('./simplify');

function steamScraper(args) {
    var steamSearchUrl = "http://store.steampowered.com/search/?snr=1_7_7_151_12&term=";

    var formattedPrice = function formattedPrice(price) {
        price.trim();
        var prices = price.split("$");
        prices.shift();

        return prices;
    };

    var gameSearchUrl = steamSearchUrl + encodeURIComponent(args.title);

    var results = [];

    return new Promise(function (resolve, reject) {
        request(gameSearchUrl, function(error, response, html){
            if ( error != null ) {
                return reject(error);
            }

            var $ = cheerio.load(html);

            var i = 0;

            while (i <= args.limit - 1) {

                // create search result object
                var searchResult = {
                    title: null,
                    simplifiedTitle: null,
                    price: null,
                    normalPrice: null,
                    imageURL: null,
                    store: 'steam'
                };

                // get title
                $('a div div span.title').eq(i).filter(function (){
                    var data = $(this);

                    searchResult.title = data.text();
                    searchResult.simplifiedTitle = simplify.simplifyString(searchResult.title);
                });

                // get normal and current price
                $('.search_price.responsive_secondrow').eq(i).filter(function (){
                    var data = $(this);

                    var price = data.text();

                    // format prices for display
                    var prices = formattedPrice(price);

                    if (prices.length) {
                        if (prices.length > 1) {
                            searchResult.normalPrice = "$" + prices[0];
                            searchResult.price = "$" + prices[1].trim();
                        } else {
                            searchResult.price = "$" + prices[0].trim();
                        }
                    }
                });

                // get image URL
                $('a.search_result_row').eq(i).filter(function (){
                    searchResult.imageURL = $(this).find('img').attr('src');
                });

                if (searchResult.title) {
                    // log output
                    results.push(searchResult);
                }

                i++;
            }

            resolve(results);
        });
    });
};

module.exports = steamScraper;
