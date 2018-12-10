import React, {Component} from 'react'
import {render} from 'react-dom'
import data from '../data'
import NonPassiveTouchTarget from '../NonPassiveTouchTarget'
import TouchCarousel from '../../src'
import touchWithMouseHOC from '../../src/touchWithMouseHOC'
import './index.css'

const cardSize = 300
const cardPadCount = 2

function CarouselContainer (props) {
  const {cursor, carouselState, ...rest} = props
  return (
    <NonPassiveTouchTarget className='carousel-container'>
      <NonPassiveTouchTarget
        className='carousel-track'
        data-cursor={cursor}
        {...rest}
      />
    </NonPassiveTouchTarget>
  )
}

const Container = touchWithMouseHOC(CarouselContainer)

class App extends Component {
  renderCard (index, modIndex, cursor) {
    cursor = -cursor
    const item = data[modIndex]
    const translateCard = index > cursor ? 100 * (index - cursor) : 0
    const translateText = index < cursor ? 5 * (index - cursor) : 0
    const translateTitle = translateText * 1.2
    const scaleTitle = index < cursor ? 1 - 0.1 * (cursor - index) : 1
    return (
      <div
        key={index}
        className='carousel-card'
        style={{transform: `translate3d(${translateCard}%, 0, 0)`}}
        data-index={index}
        data-modIndex={modIndex}
      >
        <div
          className='carousel-card-inner'
          style={{
            backgroundColor: item.background
          }}
        >
          <div
            className='carousel-title'
            style={{transform: `scale(${scaleTitle}) translate3d(${translateTitle}%, 0, 0)`}}
          >
            {item.title}
          </div>
          <div
            className='carousel-text'
            style={{transform: `translate3d(${translateText}%, 0, 0)`}}
          >
            {item.text}
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <React.StrictMode>
        <TouchCarousel
          component={Container}
          cardSize={cardSize}
          cardCount={data.length}
          cardPadCount={cardPadCount}
          autoplay={3e3}
          renderCard={this.renderCard}
        />
      </React.StrictMode>
    )
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const ndRoot = document.getElementById('react-root')
  render(<App />, ndRoot)
})
