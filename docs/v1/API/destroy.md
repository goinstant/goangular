# GoAngular#destroy

## Description

Cleans up event listeners and stops further synchronization.  Accepts an optional callback, which will be passed an `errorObject` if an issue is encountered during the tear down.

## Methods

- ##### **goAngular.destroy()**
- ##### **goAngular.destroy(callback(errorObject))**

## Parameters

| callback(errorObject) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A callback function that is returned once the form has completed being destroyed. |
| - `errorObject` will be null, unless an error has occurred. |

## Example
```js
goAngular.destroy(function(err) {
  // done
});
```
