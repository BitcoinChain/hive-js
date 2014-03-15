'use strict';

var Ractive = require('ractify')
var wallet = require('hive-wallet')
var emitter = require('hive-emitter')

module.exports = function(el){
  var ractive = new Ractive({
    el: el,
    template: require('./index.ract')
  });

  ractive.on('open-wallet', function(event){
    event.original.preventDefault()

    wallet.openWallet(getPassphrase(), getNetwork())
    emitter.emit('wallet-ready')

    location.hash = '#profile'
  })

  function getPassphrase(){
    return ractive.get('passphrase').trim()
  }

  function getNetwork() {
    if(location.search.indexOf('testnet=true') > 0) {
      return 'testnet'
    }
  }

  return ractive
}