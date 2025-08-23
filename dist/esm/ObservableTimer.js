import { ArgumentNullException, ArgumentException } from '@tsdotnet/exceptions';
import { ObservableBase } from '@tsdotnet/observable-base';

/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
class ObservableTimer extends ObservableBase {
    _interval;
    _maxCount;
    _initialDelay;
    _cancel;
    constructor(_interval, _maxCount = Infinity, _initialDelay = _interval) {
        super();
        this._interval = _interval;
        this._maxCount = _maxCount;
        this._initialDelay = _initialDelay;
        if (_interval == null)
            throw new ArgumentNullException('interval', 'Must be a valid number.');
        if (_interval < 0)
            throw new ArgumentException('interval', 'Cannot be negative.');
    }
    _count = 0;
    get count() {
        return this._count;
    }
    get isRunning() {
        return !!this._cancel;
    }
    static startNew(millisecondInterval, maxCount = Infinity, initialDelay = millisecondInterval) {
        const t = new ObservableTimer(millisecondInterval, maxCount, initialDelay);
        t.start();
        return t;
    }
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
    start() {
        const _ = this;
        _.assertIsAlive(true);
        if (!_._cancel && _._count < _._maxCount) {
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
    stop() {
        this.cancel();
    }
    reset() {
        this.stop();
        this._count = 0;
    }
    complete() {
        this.cancel();
        this._onCompleted();
        return this._count;
    }
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

export { ObservableTimer as default };
//# sourceMappingURL=ObservableTimer.js.map
