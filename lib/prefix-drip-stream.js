var Stream = require('stream');

// Set both readable and writable in constructor.
var PrefixDripStream = function (prefix, dripRate) {
    this.readable = true;
    this.writable = true;
    this._prefix = prefix;
    this._dripRate = dripRate;

    this._dripped = 0;
    this._written = 0;
    this._startDripping();
};

// Inherit from base stream class.
require('util').inherits(PrefixDripStream, Stream);

PrefixDripStream.prototype._startDripping = function () {
    this._dripTimeout = setTimeout(function () {
        if (this._dripped < this._prefix.length) {
            this.emit('data', this._prefix.slice(this._dripped, ++this._dripped));
            this.emit('dripped');
            this._startDripping();
        }
    }.bind(this), this._dripRate);
};

PrefixDripStream.prototype._stopDripping = function () {
    clearTimeout(this._dripTimeout);
};

PrefixDripStream.prototype.write = function (data) {
    this._stopDripping();
    if (this._written < this._dripped) {
        var delta = Math.min(this._dripped - this._written, data.length);
        data = data.slice(delta);
    }
    if (data.length > 0) {
        this._written += data.length;
        this.emit('data', data);
    }
};

PrefixDripStream.prototype.end = function () {
    this.emit('end');
};

module.exports = PrefixDripStream;