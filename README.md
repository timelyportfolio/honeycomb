# Honeycomb

Another hex grid library made in JavaScript, heavily inspired by [Red Blob Games'](http://www.redblobgames.com/grids/hexagons/) code samples.

All existing JS hex grid libraries I could find are coupled with some form of view. Most often a `<canvas>` element or the browser DOM. I want more separation of concerns...and a new hobby project to spend countless hours on.

## Installation

```bash
npm i honeycomb-grid
```

## Documentation

### Origins

Hexes and views have an `origin` property that define the entity's point:

A hex's origin is its center by default (with a value if `Point(0, 0)`). If a hex's origin is set to `Point(5, 10)` it means its origin is 5 units right and 10 units down of the hex's center. When a hex is converted to a point, its origin is returned (relative to whatever it's converted from).

A view's origin is its container's top left corner by default (with a value of `Point(0, 0)`). This corresponds to how HTML elements are positioned in the DOM. If you want the center of the container as the view's origin, set it to `Point(containerWidth / 2, containerHeight / 2)`.

### Converting hexes to points and points to hexes

Mapping points to hexes and vice versa can be confusing (I thought it was confusing making this library 😕). This table might clear things up:

| Method                                | Input   | Output                                                                                         |
|---------------------------------------|---------|------------------------------------------------------------------------------------------------|
| [`Hex#toPoint`](/#hextopoint)         | N/A     | the hex's origin point relative to the start hex (`Hex(0, 0, 0)`)                              |
| [`Grid#hexToPoint`](/#gridhextopoint) | a hex   | same as [`Hex#toPoint`](/#hextopoint)                                                          |
| [`Grid#pointToHex`](/#gridpointtohex) | a point | the hex that contains the point                                                                |
| [`View#hexToPixel`](/#viewhextopixel) | a hex   | the hex's [top left point](/#hextopleft) relative to its origin, relative to the view's origin |
| [`View#pixelToHex`](/#viewpixeltohex) | a point | the hex that contains the point relative to the view's origin                                  |

## API

http://abbekeultjes.nl/honeycomb/docs/api/

## Backlog

### Bugs

1.  Get `babel-polyfill` (or `babel-runtime`?) to work with `babel-preset-env`, preferably without including a bazillion unused polyfills in the dist...
2.  Docs: find a way to link modules together. Currently, methods of the factory functions doesn't seem to belong to their factory functions (in the context of jsdoc). This bug is nasty, tried lots of things already...

### Features

1.  Expose `Hex` on `Honeycomb`, adding the possibility to create (individual) hexes and use `Hex`'s static methods without having to create a grid first.
2.  Add possibility to [stretch hexes](http://www.redblobgames.com/grids/hexagons/implementation.html#layout-test-size-tall); they needn't be regularly shaped. This is an [actual request](https://github.com/flauwekeul/honeycomb/issues/1) as well.
3.  Make it possible to filter overlapping hexes when multiple shapes are rendered.
4.  Use JSFiddle for better examples.
5.  Explain (hex) directions.
6.  Shiny github.io pages 😎
7.  View should be hex-orientation-agnostic (always pointy) and just use `transform` to toggle orientations.
8.  Maybe add instance methods for `Grid` and `Views.DOM` to get/set options. Then it's optional to pass the options to the `Grid` and `Views.DOM` factories and makes it possible to get/set those options later.
10. Add helper to easily fall back to a hex's prototype?

### Refactorings

1.  Don't transpile to ES5. Who needs IE anyway?
1.  Only use a single `options` object for a function argument and never multiple separate arguments?
2.  Replace Webpack by Rollup, because it's supposed to be [more suitable for libraries](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c).
3.  Update code (and tests) of `Point` to be more consice with other modules.
4.  Grid shape methods should return Sets instead of arrays?
5.  Put tests in same directory as the code they're testing?
