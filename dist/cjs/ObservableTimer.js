"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("@tsdotnet/exceptions");
const observable_base_1 = require("@tsdotnet/observable-base");
/**
 * A timer class that uses an Observable pattern to allow for subscribing to ticks.
 */
class ObservableTimer extends observable_base_1.ObservableBase {
    constructor(_interval, _maxCount = Infinity, _initialDelay = _interval) {
        super();
        this._interval = _interval;
        this._maxCount = _maxCount;
        this._initialDelay = _initialDelay;
        this._count = 0;
        if (_interval == null)
            throw new exceptions_1.ArgumentNullException('interval', 'Must be a valid number.');
        if (_interval < 0)
            throw new exceptions_1.ArgumentException('interval', 'Cannot be negative.');
    }
    /**
     * Returns the number of times the timer has ticked (onNext);
     * @returns {number}
     */
    get count() {
        return this._count;
    }
    /**
     * Returns true if the timer is running.
     * @returns {boolean}
     */
    get isRunning() {
        return !!this._cancel;
    }
    /**
     * Initializes a new timer and starts it.
     * @param millisecondInterval
     * @param maxCount
     * @param initialDelay
     * @returns {ObservableTimer}
     */
    static startNew(millisecondInterval, maxCount = Infinity, initialDelay = millisecondInterval) {
        const t = new ObservableTimer(millisecondInterval, maxCount, initialDelay);
        t.start();
        return t;
    }
    // We use a private static here so there's no need to create a handler every time.
    static _onTick(timer, reInitTimer) {
        const index = timer._count++, max = timer._maxCount, isComplete = timer._count >= max;
        if (reInitTimer) {
            timer.cancel();
            timer.start();
        }
        if (isComplete) {
            timer.stop();
        }
        if (index < max) {
            timer._onNext(index);
        }
        if (isComplete) {
            timer._onCompleted();
        }
    }
    /**
     * Starts the timer.
     */
    start() {
        const _ = this;
        _.throwIfDisposed('This timer has been disposed and can\'t be reused.');
        if (!_._cancel && _._count < _._maxCount) {
            // For now, if it's isn't the start...
            if (_._count || _._initialDelay === _._interval) {
                const i = setInterval(ObservableTimer._onTick, _._interval, _);
                _._cancel = () => {
                    clearInterval(i);
                };
            }
            else {
                const i = setTimeout(ObservableTimer._onTick, _._initialDelay, _, true);
                _._cancel = () => {
                    clearTimeout(i);
                };
            }
        }
    }
    /**
     * Stops the timer.  Is the same as cancel.
     */
    stop() {
        this.cancel();
    }
    /**
     * Stops the timer and resets the count.
     */
    reset() {
        this.stop();
        this._count = 0;
    }
    /**
     * Forces the onComplete to propagate and returns the number of times the timer ticked.
     * @returns {number}
     */
    complete() {
        this.cancel();
        this._onCompleted();
        return this._count;
    }
    /**
     * Cancels the timer and returns true if the timer was running.  Returns false if already cancelled.
     * @returns {boolean}
     */
    cancel() {
        if (this._cancel) {
            this._cancel();
            this._cancel = undefined;
            return true;
        }
        return false;
    }
    _onDispose() {
        this.cancel();
        super._onDispose();
    }
}
exports.default = ObservableTimer;
//# sourceMappingURL=ObservableTimer.js.map