/*
 * gog-scraper
 * Copyright (c) 2016 Jeff Minnear
 * Licensed under the MIT license.
 */


const request = require('request');
const simplify = require('./simplify');

function gogScraper(args) {
    var gogSearchUrl = 'http://www.gog.com/games/ajax/filtered?limit=' + args.limit + '&search=';
    var gameSearchUrl = gogSearchUrl + encodeURIComponent(args.title);

    var results = [];

    return new Promise(function (resolve, reject) {
        request(gameSearchUrl, function(error, response, body){
            if ( error != null ) {
                return reject(error);
            }

            var json = JSON.parse(body);
            var products = json.products;

            // parse JSON object for game info
            for (var i = 0; i < products.length; i++) {
                // create search result object
                var searchResult = {
                    title: null,
                    simplifiedTitle: null,
                    price: null,
                    normalPrice: null,
                    imageURL: null,
                    linkURL: null,
                    store: 'gog.com'
                };

                searchResult.title = products[i].title.trim();
                searchResult.simplifiedTitle = simplify.simplifyString(searchResult.title);
                searchResult.price = '$' + products[i].price.amount;
                searchResult.imageURL = products[i].image + '_196.jpg';
                searchResult.linkURL = 'https://www.gog.com' + products[i].url;
                // only assign value of normalPrice if game is on sale
                if (products[i].price.isDiscounted) {
                    searchResult.normalPrice = '$' + products[i].price.baseAmount;
                }

                if (searchResult.title) {
                    results.push(searchResult);
                }
            }

            resolve(results);
        });
    });
};

module.exports = gogScraper;
