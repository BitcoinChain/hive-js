'use strict';
window.initHiveApp = function () {
    var Ticker = require('hive-ticker-api').BitcoinAverage;
    var emitter = require('hive-emitter');
    var walletExists = require('hive-wallet').walletExists;
    var fastclick = require('fastclick');
    var initFrame = require('hive-frame');
    var initAuth = require('hive-auth');
    var initGeoOverlay = require('hive-geo-overlay');
    var $ = require('browserify-zepto');
    var getNetwork = require('hive-network');
    var fadeIn = require('hive-transitions/fade.js').fadeIn;

    var appEl = document.getElementById('app');
    var frame = initFrame(appEl);
    var auth = null;
    var _html = $('html');
    var _app = $(appEl);
    fastclick(document.body);

    //initGeoOverlay(document.getElementById('geo-overlay'));

    walletExists(function (exists) {
        auth = exists ? initAuth.pin(null, {userExists: true}) : initAuth.choose();
        var authContentEl = document.getElementById('auth_content');
        authContentEl.style.opacity = 0;
        fadeIn(authContentEl);
        auth.show();
    });

    emitter.on('open-overlay', function () {
        _app.addClass('is_hidden');
        _html.addClass('prevent_scroll');
    });

    emitter.on('close-overlay', function () {
        _app.removeClass('is_hidden');
        _html.removeClass('prevent_scroll');
    });

    emitter.on('balance-ready', function () {
        auth.hide();
        frame.show();
    });

    function updateExchangeRates() {
        var tickerUpdateInterval = 1000 * 60 * 2;
        var ticker = new Ticker(getNetwork());

        ticker.getExchangeRates(function (err, rates) {
            if (rates) emitter.emit('ticker', rates);
            window.setTimeout(updateExchangeRates, tickerUpdateInterval)
        })
    }

    //var sourceWindow;
    //function postMessageListener(event){
    //    console.log('iframe', event);
    //    if('undefined' != typeof(event.data.isDark)) {
    //
    //        sourceWindow = {
    //            source: event.source,
    //            origin: event.origin
    //        };
    //
    //        if(event.data.isDark) {
    //            _html.addClass('dark');
    //        } else {
    //            _html.removeClass('dark');
    //        }
    //    }
    //}
    //
    //
    //var height = $(window).height();
    //console.log(_html, $(window).height());
    //function emitHeight() {
    //    console.log('emitHeight', sourceWindow);
    //    if('undefined' != typeof(sourceWindow)) {
    //        sourceWindow.source.postMessage({walletHeight: _html.height()}, sourceWindow.origin);
    //    }
    //}
    //
    //emitHeight();
    //setInterval(function(){
    //    //if(_html.height() != height) {
    //        height = $(window).height();
    //        emitHeight();
    //    //}
    //}, 200);
    //
    //if (window.addEventListener){
    //    addEventListener("message", postMessageListener, false);
    //} else {
    //    attachEvent("onmessage", postMessageListener);
    //}


    updateExchangeRates();
};
