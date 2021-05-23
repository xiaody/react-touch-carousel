[![Node.js CI](https://github.com/xiaody/react-touch-carousel/actions/workflows/node.js.yml/badge.svg)](https://github.com/xiaody/react-touch-carousel/actions/workflows/node.js.yml)
[![npm version](https://badge.fury.io/js/react-touch-carousel.svg)](https://www.npmjs.com/package/react-touch-carousel)
[![dependencies Status](https://david-dm.org/xiaody/react-touch-carousel/status.svg)](https://david-dm.org/xiaody/react-touch-carousel)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)

# react-touch-carousel

Micro carousel framework for React.JS https://xiaody.github.io/react-touch-carousel/docs/

Yes, there are [a][slick] [few][Swiper] [carousel][Owl Carousel 2] [libraries][react-swipe] out there.
Most of them are mature and easy to use for common usage,
but none of them are convenient for the highly customized fancy UX that your team's cool designer wants.

react-touch-carousel does it in a different way.
Instead of accepting some static DOM nodes and providing a thousand options,
it does an inversion of control and lets you decide
what content inside carousel are rendered and how they are styled, totally and dynamically.

## Installation

To install the stable version:

```
npm install --save react-touch-carousel
```

## Usage

```jsx
import TouchCarousel from 'react-touch-carousel'

const listOfData = [
  // your data array here
]

function CarouselContainer (props) {
  // render the carousel structure
}

function renderCard (index, modIndex, cursor) {
  const item = listOfData[modIndex]
  // render the item
}


<TouchCarousel
  component={CarouselContainer}
  cardCount={listOfData.length}
  cardSize={375}
  renderCard={renderCard}
  loop
  autoplay={3000}
/>
```

The `CarouselContainer()` and `renderCard()` are where all the magic happens,
which shall be directed by you.
See some detailed [examples](https://github.com/xiaody/react-touch-carousel/tree/master/examples).

## Options

### props.component {Component}

Your container component of the carousel.

react-touch-carousel will pass it's touch listeners, dragging/active state, current position cursor to this component.

It is actually called like this:

```jsx
<Component
  cursor={usedCursor}
  carouselState={carouselState}
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
  onTouchCancel={onTouchCancel}
>
  {allYourRenderedCards}
</Component>
```

### props.renderCard(index, modIndex, cursor, carouselState) {Function}

The card renderer.

All rendered cards joined as an array will be passed to props.component as it's `children`.

### props.cardCount {Number}

The count of your cards, not including the padded ones.

### props.cardPadCount {Number}

The count of padded cards, necessary for looping.

Ignored if `loop` is `false`.

### props.cardSize {Number}

The width (or height if `vertical` is `true`) in pixels of a card.

### props.vertical {Boolean}

Listen to vertical touch moves instead of horizontal ones. Default `false`.

### props.loop {Boolean}

Tail to head, head to tail. Default `true`.

### props.autoplay {Number}

Interval in milliseconds, 0 as disabled. Default `0`.

### props.defaultCursor {Number}

The cursor value for initial render.

Notice the sign of the number, normally it should be negative or zero(default).

### props.onRest(index, modIndex, cursor, carouselState) {Function}

Callback when the carousel is rested at a card.

### props.onDragStart/onDragEnd/onDragCancel

Add some listeners if you need.

### props.ignoreCrossMove {Number|Boolean}

If `deltCrossAxis * ignoreCrossMove > deltMainAxis`, carousel would ignore the dragging.

`true` as `1` and `false` as `0`. Default `true`.

## Concepts

### Cursor

A cursor indicates the transition position of the carousel.

When the user swipes right, the number gets bigger. When the user swipes left, the number get smaller.

There are three steps to calculating the cursor's final value:
specified, computed, used.

In most cases you just use the used cursor value to render your carousel content.

### CarouselState

A carouselState is always passed to your `component` and `renderCard`.

It contains:
```js
{
  cursor, // the specified cursor
  active, // is user interacting with the component, no matter dragging or pressing or clicking?
  dragging, // is user dragging the component?
  springing, // has user dragged and released the component, and the component is transitioning to the specified cursor?
  moding // is the cursor moding?
}
```

### Mod

This happens if you enable `loop`. We keep the cursor in a valid range by "moding" it.

## Advanced options

There are some advanced options, but normally you don't need to touch them.

## Methods

### go(targetCursor)

Transition to a position.

### next()

Transition to next card.

### prev()

Transition to previous card.

### modAs(targetCursor)

Hard jump to a position.

## Mouse support

We provide an HOC for very basic mouse support. Internally it simulates touch events with the mouse events.

```jsx
import touchWithMouseHOC from 'react-touch-carousel/lib/touchWithMouseHOC'

const Container = touchWithMouseHOC(CarouselContainer)

<TouchCarousel
  component={Container}
/>
```

[slick]: https://kenwheeler.github.io/slick/
[Swiper]: http://idangero.us/swiper/
[Owl Carousel 2]: https://owlcarousel2.github.io/OwlCarousel2/
[react-swipe]: https://github.com/voronianski/react-swipe
