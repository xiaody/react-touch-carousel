import React, {Component} from 'react'
import {render} from 'react-dom'
import data from '../data'
import TouchCarousel, {clamp} from '../../src'
import './index.css'

const cardSize = 300
const cardPadCount = 3
const carouselWidth = clamp(window.innerWidth, 0, 960)

function CarouselContainer (props) {
  const {cursor, carouselState, ...rest} = props
  // Put current card at center
  const translateX = (cursor - cardPadCount) * cardSize + (carouselWidth - cardSize) / 2
  return (
    <div className='carousel-container'>
      <div
        className='carousel-track'
        style={{transform: `translate3d(${translateX}px, 0, 0)`}}
        {...rest}
      />
    </div>
  )
}

class App extends Component {
  renderCard (index, modIndex, cursor) {
    const item = data[modIndex]
    const rotate = 40 * (index + cursor)
    const onTop = Math.abs(index + cursor) < 0.5
    return (
      <div key={index} className='carousel-card'>
        <div
          className='carousel-card-inner'
          style={{
            backgroundColor: item.background,
            transform: `rotate(${rotate}deg)`,
            zIndex: onTop ? 1 : 0
          }}
        >
          <div className='carousel-title'>{item.title}</div>
          <div className='carousel-text'>{item.text}</div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <TouchCarousel
        component={CarouselContainer}
        cardSize={cardSize}
        cardCount={data.length}
        cardPadCount={cardPadCount}
        autoplay={2e3}
        renderCard={this.renderCard}
      />
    )
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const ndRoot = document.getElementById('react-root')
  render(<App />, ndRoot)
  if (!('ontouchmove' in window)) {
    document.getElementById('mobile-tip').removeAttribute('hidden')
  }
})
