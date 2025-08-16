/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import { ObservableBase } from '@tsdotnet/observable-base';
/**
 * A timer class that uses an Observable pattern to allow for subscribing to ticks.
 */
export default class ObservableTimer extends ObservableBase<number> {
    private _interval;
    private _maxCount;
    private _initialDelay;
    private _cancel?;
    constructor(_interval: number, _maxCount?: number, _initialDelay?: number);
    private _count;
    /**
     * Returns the number of times the timer has ticked (onNext);
     * @returns {number}
     */
    get count(): number;
    /**
     * Returns true if the timer is running.
     * @returns {boolean}
     */
    get isRunning(): boolean;
    /**
     * Initializes a new timer and starts it.
     * @param millisecondInterval
     * @param maxCount
     * @param initialDelay
     * @returns {ObservableTimer}
     */
    static startNew(millisecondInterval: number, maxCount?: number, initialDelay?: number): ObservableTimer;
    private static _onTick;
    /**
     * Starts the timer.
     */
    start(): void;
    /**
     * Stops the timer.  Is the same as cancel.
     */
    stop(): void;
    /**
     * Stops the timer and resets the count.
     */
    reset(): void;
    /**
     * Forces the onComplete to propagate and returns the number of times the timer ticked.
     * @returns {number}
     */
    complete(): number;
    /**
     * Cancels the timer and returns true if the timer was running.  Returns false if already cancelled.
     * @returns {boolean}
     */
    cancel(): boolean;
    protected _onDispose(): void;
}
