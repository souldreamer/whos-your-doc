var app = angular.module('whos_your_doc', [
    'ionic',
    'ngStorage',
    'ionic-numberpicker',
    'whos_your_doc.services',
    'whos_your_doc.factories',
    'whos_your_doc.filters',
    'whos_your_doc.controllers',
    'ngCordova',
    'ngMap'
]);

var factories = angular.module('whos_your_doc.factories', []);
var filters = angular.module('whos_your_doc.filters', []);
var directives = angular.module('whos_your_doc.directives', []);
var services = angular.module('whos_your_doc.services', []);

