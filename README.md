[![npm version](https://badge.fury.io/js/react-touch-carousel.svg)](https://www.npmjs.com/package/react-touch-carousel)
[![dependencies Status](https://david-dm.org/xiaody/react-touch-carousel/status.svg)](https://david-dm.org/xiaody/react-touch-carousel)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)

# react-touch-carousel

Micro carousel framework for React.JS https://xiaody.github.io/react-touch-carousel/docs/

Yes, there are [a][slick] [few][Swiper] [carousel][Owl Carousel 2] [libraries][react-swipe] out there.
Most of them are powerful, well tested, easy to use for common usage,
but none of them are convenient enough for the highly customized fancy UX that your team's cool designer wants.

react-touch-carousel does it in a different way.
Instead of accepting some static DOM nodes and providing a thousand options,
it lets you decide what content inside carousel are rendered and how they are styled, totally and dynamically.

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

See some detailed [examples](https://github.com/xiaody/react-touch-carousel/tree/master/examples).

## Options

### props.component {Component}

your container component of the carousel

react-touch-carousel will pass it's touch listeners, dragging/active state, current position cursor to this component

### props.renderCard(index, modIndex, cursor) {Function}

the card renderer

all rendered cards joined as an array will be passed to props.component as it's `children`

### props.cardCount {Number}

the count of your cards, not including the padded ones

### props.cardSize {Number}

the width (or height if vertical is true) in pixels of a card

### props.vertical {Boolean}

listen to vertical touch moves instead of horizontal ones

### props.loop {Boolean}

tail to head, head to tail

### autoplay {Number}

interval in milliseconds, 0 as disabled


[slick]: https://kenwheeler.github.io/slick/
[Swiper]: http://idangero.us/swiper/
[Owl Carousel 2]: https://owlcarousel2.github.io/OwlCarousel2/
[react-swipe]: https://github.com/voronianski/react-swipe
