<a href="https://tsdotnet.github.io/observable-timer/"><img src="https://cdn.jsdelivr.net/gh/tsdotnet/observable-timer@master/assets/banner.svg" alt="@tsdotnet/observable-timer: A clock you subscribe to. Interval ticks as an observable."></a>

[![npm version](https://img.shields.io/npm/v/@tsdotnet/observable-timer.svg?style=flat-square)](https://www.npmjs.com/package/@tsdotnet/observable-timer)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/tsdotnet/observable-timer/blob/master/LICENSE)

An observable that emits a count on a fixed interval, with optional limit and initial delay.

## Install

```sh
npm install @tsdotnet/observable-timer
```

## Usage

```ts
import ObservableTimer from '@tsdotnet/observable-timer';

const timer = ObservableTimer.startNew(1000, 3); // every second, three ticks
timer.subscribe(
	n => console.log(n), // 0, 1, 2
	undefined, // no error handler
	() => console.log('done'));
```

Use `new ObservableTimer(interval)` to create one without starting it, then `start()`, `stop()` and `reset()` as needed. Disposing it cancels the timer.

## Use it from

ESM (`import ObservableTimer from '@tsdotnet/observable-timer';`) or CommonJS (`const ObservableTimer = require('@tsdotnet/observable-timer').default;`).

<details><summary>In a browser, without a bundler</summary>

```html
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/exceptions@1/dist/umd/exceptions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/type@1/dist/umd/type.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/compare@1/dist/umd/compare.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/collection-base@2/dist/umd/collection-base.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/disposable@2/dist/umd/disposable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/linked-node-list@1/dist/umd/linked-node-list.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/ordered-registry@1/dist/umd/ordered-registry.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/observable-base@2/dist/umd/observable-base.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/observable-timer@2/dist/umd/observable-timer.min.js"></script>
<script>
  const ObservableTimer = tsdotnet.observableTimer.default;
</script>
```

</details>

## Docs

[tsdotnet.github.io/observable-timer](https://tsdotnet.github.io/observable-timer/)
