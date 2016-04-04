
/*
 * simplify
 * Copyright (c) 2016 Jeff Minnear
 * Licensed under the MIT license.
 */

var simplify = {
    simplifyString : function (string) {
        return string.toLowerCase().split(/\W/).filter(function(e) { return e; }).join(' ');
    }
};

module.export = simplify;
