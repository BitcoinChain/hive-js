'use strict';

require('browsernizr/lib/load');
require('browsernizr/test/storage/localstorage');
require('browsernizr/test/storage/websqldatabase');
require('browsernizr/test/indexedDB');
require('browsernizr/test/workers/webworkers');
require('browsernizr/test/blob');
require('browsernizr/test/crypto/getrandomvalues');

var token = require('hive-network')();
var animateLogo = require('hive-transitions/loader.js').in;
var fadeOut = require('hive-transitions/loader.js').out;
var Modernizr = require('browsernizr');
var languages = require('hive-i18n').languages;

document.getElementsByTagName('html')[0].classList.add(token);

if(window.location.hash.indexOf("dark") > -1) {
    document.getElementsByTagName('html')[0].classList.add('dark')
}

var elems =  {
  block1: document.getElementById('logo_block1'),
  block2: document.getElementById('logo_block2'),
  block3: document.getElementById('logo_block3'),
  block4: document.getElementById('logo_block4'),
  block5: document.getElementById('logo_block5')
};

var containerEl = document.getElementById('loader');
var goodToGo;

animateLogo(elems);

Modernizr.on('indexeddb', function(hasIndexedDB){
  var supportsPouchDB = hasIndexedDB || Modernizr.websqldatabase;
  var language = findTranslation();

  Modernizr.load({
    test: supportsPouchDB && (Modernizr.localstorage && Modernizr.webworkers && Modernizr.blobconstructor && Modernizr.getrandomvalues),
    yep: 'assets/js/application-' + language + '.js',
    nope: 'assets/js/nope-' + language + '.js',
    callback: function(testResult, key) {
      goodToGo = key
    },
    complete: function() {
      if(goodToGo) {
        setTimeout(function(){
          fadeOut(containerEl)
        }, 1000)
      }
    }
  })
});

function findTranslation(){
  var language = navigator.language.toLocaleLowerCase() || 'en';
  return languages.filter(function(l){
    return language === l || language.substr(0, 2) === l
  })[0] || 'en'
}

//monkey patch URL for safari 6
window.URL = window.URL || window.webkitURL;

