/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import { ObservableBase } from '@tsdotnet/observable-base';
export default class ObservableTimer extends ObservableBase<number> {
    private _interval;
    private _maxCount;
    private _initialDelay;
    private _cancel;
    constructor(_interval: number, _maxCount?: number, _initialDelay?: number);
    private _count;
    get count(): number;
    get isRunning(): boolean;
    static startNew(millisecondInterval: number, maxCount?: number, initialDelay?: number): ObservableTimer;
    private static _onTick;
    start(): void;
    stop(): void;
    reset(): void;
    complete(): number;
    cancel(): boolean;
    protected _onDispose(): void;
}
