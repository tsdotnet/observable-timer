import { describe, it, expect } from 'vitest';
import ObservableTimer from '../src/ObservableTimer';

describe('ObservableTimer', () => {
	it('should create an instance', () => {
		const timer = new ObservableTimer(100);
		expect(timer).toBeDefined();
		expect(timer).toBeInstanceOf(ObservableTimer);
	});

	it('null should not equal 0', () => {
		expect(null == 0).toBe(false);
	});
});
