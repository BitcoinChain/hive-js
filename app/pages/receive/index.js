'use strict';

var Ractive = require('hive-ractive');
var emitter = require('hive-emitter');
var Hive = require('hive-wallet');
var showTooltip = require('hive-modal-tooltip');
var showQr = require('hive-modal-qr');
var geo = require('hive-geo');
var showError = require('hive-modal-flash').showError;
var showSetDetails = require('hive-modal-set-details');
var fadeIn = require('hive-transitions/fade.js').fadeIn;
var fadeOut = require('hive-transitions/fade.js').fadeOut;

module.exports = function(el){
  var ractive = new Ractive({
    el: el,
    template: require('./index.ract').template,
    data: {
      address: '',
      qrVisible: false,
      btn_message: 'Turn Waggle on',
      connecting: false,
      broadcasting: false
    }
  });

  emitter.on('balance-ready', function(){
    ractive.set('address', getAddress())
  });

  emitter.on('wallet-ready', function(){
    ractive.set('address', getAddress())
  });

  ractive.on('show-qr', function(){
    showQr({
      address: ractive.get('address')
    })
  });

  function getAddress(){
    return Hive.getWallet().getNextAddress()
  }

  return ractive;
};
