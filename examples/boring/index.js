import React, {Component} from 'react'
import {render} from 'react-dom'
import cx from 'classnames'
import data from '../data'
import TouchCarousel, {clamp} from '../../src'
import './index.css'

const query = window.location.search.slice(1)
const enableLoop = /\bloop\b/.test(query)
const enableAutoplay = /\bautoplay\b/.test(query)

const cardSize = 300
const cardPadCount = enableLoop ? 3 : 0
const carouselWidth = clamp(window.innerWidth, 0, 960)

function log (text) {
  document.getElementById('console').innerText = text
}

function CarouselContainer (props) {
  const {cursor, active, dragging, ...rest} = props
  let current = -Math.round(cursor) % data.length
  while (current < 0) {
    current += data.length
  }
  // Put current card at center
  const translateX = (cursor - cardPadCount) * cardSize + (carouselWidth - cardSize) / 2
  return (
    <div
      className={cx(
        'carousel-container',
        {
          'is-active': active,
          'is-dragging': dragging
        }
      )}
    >
      <div
        className='carousel-track'
        style={{transform: `translate3d(${translateX}px, 0, 0)`}}
        {...rest}
      />

      <div className='carousel-pagination-wrapper'>
        <ol className='carousel-pagination'>
          {data.map((_, index) => (
            <li
              key={index}
              className={current === index ? 'current' : ''}
            />
          ))}
        </ol>
      </div>
    </div>
  )
}

class App extends Component {
  renderCard (index, modIndex) {
    const item = data[modIndex]
    return (
      <div
        key={index}
        className='carousel-card'
        onClick={() => log(`clicked card ${1 + modIndex}`)}
      >
        <div
          className='carousel-card-inner'
          style={{backgroundColor: item.background}}
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
        loop={enableLoop}
        autoplay={enableAutoplay ? 2e3 : false}
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

  let optionExplain = []
  if (enableLoop) {
    optionExplain.push('loop')
  }
  if (enableAutoplay) {
    optionExplain.push('autoplay=2000')
  }
  if (optionExplain.length) {
    document.getElementById('option-explain').textContent = optionExplain.join(' ')
  }
})
