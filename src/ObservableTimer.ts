/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import ArgumentException from '@tsdotnet/exceptions/dist/ArgumentException';
import ArgumentNullException from '@tsdotnet/exceptions/dist/ArgumentNullException';
import ObservableBase from '@tsdotnet/observable-base/dist/ObservableBase';

/**
 * A timer class that uses an Observable pattern to allow for subscribing to ticks.
 */
export default class ObservableTimer
	extends ObservableBase<number>
{
	private _cancel?: () => void;

	constructor (
		private _interval: number,
		private _maxCount: number = Infinity,
		private _initialDelay     = _interval)
	{
		super();

		if(_interval==null)
			throw new ArgumentNullException('interval', 'Must be a valid number.');
		if(_interval<0)
			throw new ArgumentException('interval', 'Cannot be negative.');
	}

	private _count: number = 0;

	/**
	 * Returns the number of times the timer has ticked (onNext);
	 * @returns {number}
	 */
	get count (): number
	{
		return this._count;
	}

	/**
	 * Returns true if the timer is running.
	 * @returns {boolean}
	 */
	get isRunning (): boolean
	{
		return !!this._cancel;
	}

	/**
	 * Initializes a new timer and starts it.
	 * @param millisecondInterval
	 * @param maxCount
	 * @param initialDelay
	 * @returns {ObservableTimer}
	 */
	static startNew (
		millisecondInterval: number,
		maxCount: number     = Infinity,
		initialDelay: number = millisecondInterval): ObservableTimer
	{
		const t = new ObservableTimer(millisecondInterval, maxCount, initialDelay);
		t.start();
		return t;
	}

	// We use a private static here so there's no need to create a handler every time.
	private static _onTick (
		timer: ObservableTimer,
		reInitTimer?: boolean): void
	{
		const
			index      = timer._count++,
			max        = timer._maxCount,
			isComplete = timer._count>=max;

		if(reInitTimer)
		{
			timer.cancel();
			timer.start();
		}

		if(isComplete)
		{
			timer.stop();
		}

		if(index<max)
		{
			timer._onNext(index);
		}

		if(isComplete)
		{
			timer._onCompleted();
		}
	}

	/**
	 * Starts the timer.
	 */
	start (): void
	{
		const _ = this;
		_.throwIfDisposed('This timer has been disposed and can\'t be reused.');
		if(!_._cancel && _._count<_._maxCount)
		{
			// For now, if it's isn't the start...
			if(_._count || _._initialDelay===_._interval)
			{
				const i = setInterval(
					ObservableTimer._onTick,
					_._interval,
					_);

				_._cancel = () => {
					clearInterval(i);
				};
			}
			else
			{
				const i = setTimeout(
					ObservableTimer._onTick,
					_._initialDelay,
					_, true);

				_._cancel = () => {
					clearTimeout(i);
				};
			}
		}

	}

	/**
	 * Stops the timer.  Is the same as cancel.
	 */
	stop (): void
	{
		this.cancel();
	}

	/**
	 * Stops the timer and resets the count.
	 */
	reset (): void
	{
		this.stop();
		this._count = 0;
	}

	/**
	 * Forces the onComplete to propagate and returns the number of times the timer ticked.
	 * @returns {number}
	 */
	complete (): number
	{
		this.cancel();
		this._onCompleted();
		return this._count;
	}

	/**
	 * Cancels the timer and returns true if the timer was running.  Returns false if already cancelled.
	 * @returns {boolean}
	 */
	cancel (): boolean
	{
		if(this._cancel)
		{
			this._cancel();
			this._cancel = undefined;
			return true;
		}
		return false;
	}

	protected _onDispose (): void
	{
		this.cancel();
		super._onDispose();
	}

}
