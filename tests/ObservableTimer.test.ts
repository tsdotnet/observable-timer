import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ObservableTimer from '../src/ObservableTimer';

describe('ObservableTimer', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('Constructor', () => {
		it('should create an instance with valid parameters', () => {
			const timer = new ObservableTimer(100);
			expect(timer).toBeDefined();
			expect(timer).toBeInstanceOf(ObservableTimer);
			expect(timer.count).toBe(0);
			expect(timer.isRunning).toBe(false);
		});

		it('should create an instance with all parameters', () => {
			const timer = new ObservableTimer(100, 5, 200);
			expect(timer).toBeDefined();
			expect(timer.count).toBe(0);
			expect(timer.isRunning).toBe(false);
		});

		it('should throw ArgumentNullException for null interval', () => {
			expect(() => new ObservableTimer(null as any)).toThrow('Must be a valid number');
		});

		it('should throw ArgumentException for negative interval', () => {
			expect(() => new ObservableTimer(-100)).toThrow('Cannot be negative');
		});
	});

	describe('Properties', () => {
		it('should track count correctly', () => {
			const timer = new ObservableTimer(100);
			expect(timer.count).toBe(0);
		});

		it('should report isRunning correctly when not started', () => {
			const timer = new ObservableTimer(100);
			expect(timer.isRunning).toBe(false);
		});

		it('should report isRunning correctly when started', () => {
			const timer = new ObservableTimer(100);
			timer.start();
			expect(timer.isRunning).toBe(true);
			timer.cancel();
		});
	});

	describe('Static Methods', () => {
		it('should create and start timer with startNew', () => {
			const timer = ObservableTimer.startNew(100);
			expect(timer).toBeInstanceOf(ObservableTimer);
			expect(timer.isRunning).toBe(true);
			timer.cancel();
		});

		it('should create and start timer with all parameters', () => {
			const timer = ObservableTimer.startNew(100, 3, 50);
			expect(timer).toBeInstanceOf(ObservableTimer);
			expect(timer.isRunning).toBe(true);
			timer.cancel();
		});
	});

	describe('Timer Control', () => {
		it('should start and stop timer', () => {
			const timer = new ObservableTimer(100);
			
			timer.start();
			expect(timer.isRunning).toBe(true);
			
			timer.stop();
			expect(timer.isRunning).toBe(false);
		});

		it('should cancel timer and return true when running', () => {
			const timer = new ObservableTimer(100);
			timer.start();
			
			const result = timer.cancel();
			expect(result).toBe(true);
			expect(timer.isRunning).toBe(false);
		});

		it('should cancel timer and return false when not running', () => {
			const timer = new ObservableTimer(100);
			
			const result = timer.cancel();
			expect(result).toBe(false);
			expect(timer.isRunning).toBe(false);
		});

		it('should reset timer count and stop', () => {
			const timer = new ObservableTimer(100);
			timer.start();
			
			// Simulate some ticks by manually incrementing (testing internal behavior)
			(timer as any)._count = 3;
			
			timer.reset();
			expect(timer.count).toBe(0);
			expect(timer.isRunning).toBe(false);
		});

		it('should complete timer and return count', () => {
			const timer = new ObservableTimer(100);
			timer.start();
			
			// Simulate some ticks
			(timer as any)._count = 3;
			
			const result = timer.complete();
			expect(result).toBe(3);
			expect(timer.isRunning).toBe(false);
		});
	});

	describe('Timer Behavior', () => {
		it('should tick at specified intervals', async () => {
			const timer = new ObservableTimer(100);
			const values: number[] = [];
			
			timer.subscribe(value => {
				values.push(value);
			});
			
			timer.start();
			
			// Advance time and check ticks
			vi.advanceTimersByTime(100);
			expect(values).toEqual([0]);
			expect(timer.count).toBe(1);
			
			vi.advanceTimersByTime(100);
			expect(values).toEqual([0, 1]);
			expect(timer.count).toBe(2);
			
			timer.cancel();
		});

		it('should respect maxCount and complete', () => {
			const timer = new ObservableTimer(100, 3);
			const values: number[] = [];
			let completed = false;
			
			timer.subscribe({
				onNext: value => values.push(value),
				onCompleted: () => { completed = true; }
			});
			
			timer.start();
			
			// Should tick 3 times then complete
			vi.advanceTimersByTime(300);
			expect(values).toEqual([0, 1, 2]);
			expect(completed).toBe(true);
			expect(timer.isRunning).toBe(false);
		});

		it('should handle initial delay different from interval', () => {
			const timer = new ObservableTimer(100, 5, 50); // 50ms initial delay, then 100ms interval
			const values: number[] = [];
			
			timer.subscribe(value => values.push(value));
			timer.start();
			
			// First tick after initial delay
			vi.advanceTimersByTime(50);
			expect(values).toEqual([0]);
			
			// Subsequent ticks at regular interval
			vi.advanceTimersByTime(100);
			expect(values).toEqual([0, 1]);
			
			timer.cancel();
		});

		it('should handle timer restart with initial delay', () => {
			const timer = new ObservableTimer(100, 5, 50);
			const values: number[] = [];
			
			timer.subscribe(value => values.push(value));
			timer.start();
			
			// First tick with initial delay - this should restart the timer
			vi.advanceTimersByTime(50);
			expect(values).toEqual([0]);
			expect(timer.count).toBe(1);
			
			// After restart, should use regular interval
			vi.advanceTimersByTime(100);
			expect(values).toEqual([0, 1]);
			
			timer.cancel();
		});

		it('should not start if already at max count', () => {
			const timer = new ObservableTimer(100, 2);
			
			// Manually set count to max
			(timer as any)._count = 2;
			
			timer.start();
			expect(timer.isRunning).toBe(false);
		});

		it('should handle timer with maxCount of 1', () => {
			const timer = new ObservableTimer(100, 1);
			const values: number[] = [];
			let completed = false;
			
			timer.subscribe({
				onNext: value => values.push(value),
				onCompleted: () => { completed = true; }
			});
			
			timer.start();
			
			vi.advanceTimersByTime(100);
			expect(values).toEqual([0]);
			expect(completed).toBe(true);
			expect(timer.isRunning).toBe(false);
		});

		it('should handle timer with maxCount of 0', () => {
			const timer = new ObservableTimer(100, 0);
			const values: number[] = [];
			let completed = false;
			
			timer.subscribe({
				onNext: value => values.push(value),
				onCompleted: () => { completed = true; }
			});
			
			timer.start();
			expect(timer.isRunning).toBe(false);
			
			vi.advanceTimersByTime(200);
			expect(values).toEqual([]);
			expect(completed).toBe(false);
		});
	});

	describe('Observable Behavior', () => {
		it('should notify subscribers on each tick', () => {
			const timer = new ObservableTimer(100);
			const subscriber1 = vi.fn();
			const subscriber2 = vi.fn();
			
			timer.subscribe(subscriber1);
			timer.subscribe(subscriber2);
			timer.start();
			
			vi.advanceTimersByTime(200);
			
			expect(subscriber1).toHaveBeenCalledTimes(2);
			expect(subscriber1).toHaveBeenCalledWith(0);
			expect(subscriber1).toHaveBeenCalledWith(1);
			
			expect(subscriber2).toHaveBeenCalledTimes(2);
			expect(subscriber2).toHaveBeenCalledWith(0);
			expect(subscriber2).toHaveBeenCalledWith(1);
			
			timer.cancel();
		});

		it('should notify onCompleted when maxCount reached', () => {
			const timer = new ObservableTimer(100, 2);
			const onNext = vi.fn();
			const onCompleted = vi.fn();
			
			timer.subscribe({
				onNext,
				onCompleted
			});
			
			timer.start();
			vi.advanceTimersByTime(200);
			
			expect(onNext).toHaveBeenCalledTimes(2);
			expect(onCompleted).toHaveBeenCalledTimes(1);
		});

		it('should notify onCompleted when complete() is called', () => {
			const timer = new ObservableTimer(100);
			const onNext = vi.fn();
			const onCompleted = vi.fn();
			
			timer.subscribe({
				onNext,
				onCompleted
			});
			
			timer.start();
			vi.advanceTimersByTime(100);
			timer.complete();
			
			expect(onNext).toHaveBeenCalledTimes(1);
			expect(onCompleted).toHaveBeenCalledTimes(1);
		});

		it('should handle unsubscription', () => {
			const timer = new ObservableTimer(100);
			const subscriber = vi.fn();
			
			const subscription = timer.subscribe(subscriber);
			timer.start();
			
			vi.advanceTimersByTime(100);
			expect(subscriber).toHaveBeenCalledTimes(1);
			
			subscription.dispose();
			vi.advanceTimersByTime(100);
			expect(subscriber).toHaveBeenCalledTimes(1); // Should not be called again
			
			timer.cancel();
		});
	});

	describe('Disposal', () => {
		it('should cancel timer on disposal', () => {
			const timer = new ObservableTimer(100);
			timer.start();
			
			expect(timer.isRunning).toBe(true);
			
			timer.dispose();
			expect(timer.isRunning).toBe(false);
		});
	});

	describe('Edge Cases', () => {
		it('should handle zero interval', () => {
			const timer = new ObservableTimer(0);
			expect(timer).toBeDefined();
			timer.start();
			expect(timer.isRunning).toBe(true);
			timer.cancel();
		});

		it('should handle very large maxCount', () => {
			const timer = new ObservableTimer(100, Number.MAX_SAFE_INTEGER);
			expect(timer).toBeDefined();
			timer.start();
			expect(timer.isRunning).toBe(true);
			timer.cancel();
		});

		it('should handle calling start multiple times', () => {
			const timer = new ObservableTimer(100);
			
			timer.start();
			expect(timer.isRunning).toBe(true);
			
			// Starting again should not create multiple timers
			timer.start();
			expect(timer.isRunning).toBe(true);
			
			timer.cancel();
		});

		it('should handle calling stop/cancel multiple times', () => {
			const timer = new ObservableTimer(100);
			timer.start();
			
			expect(timer.cancel()).toBe(true);
			expect(timer.cancel()).toBe(false);
			expect(timer.cancel()).toBe(false);
		});

		it('should handle initial delay same as interval', () => {
			const timer = new ObservableTimer(100, 5, 100); // Same initial delay and interval
			const values: number[] = [];
			
			timer.subscribe(value => values.push(value));
			timer.start();
			
			vi.advanceTimersByTime(100);
			expect(values).toEqual([0]);
			
			vi.advanceTimersByTime(100);
			expect(values).toEqual([0, 1]);
			
			timer.cancel();
		});
	});
});
