'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StreamsCtrl = function StreamsCtrl() {
    _classCallCheck(this, StreamsCtrl);
};

var StreamCtrl = function () {
    function StreamCtrl() {
        _classCallCheck(this, StreamCtrl);
    }

    _createClass(StreamCtrl, [{
        key: 'constructer',
        value: function constructer() {}
    }]);

    return StreamCtrl;
}();

app.component('streamsCmp', {
    $routeConfig: [{
        path: '/',
        name: 'StreamList',
        component: 'streamListCmp'
    }, {
        path: '/:id',
        name: 'Stream',
        component: 'streamCmp'
    }]
});