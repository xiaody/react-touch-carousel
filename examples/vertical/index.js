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
  const translateY = (cursor - cardPadCount) * cardSize
  return (
    <NonPassiveTouchTarget className='carousel-container'>
      <NonPassiveTouchTarget
        className='carousel-track'
        style={{transform: `translate3d(0, ${translateY}px, 0)`}}
        {...rest}
      />
    </NonPassiveTouchTarget>
  )
}

const Container = touchWithMouseHOC(CarouselContainer)

class App extends Component {
  renderCard (index, modIndex) {
    const item = data[modIndex]
    return (
      <div
        key={index}
        className='carousel-card'
        data-index={index}
        data-modIndex={modIndex}
      >
        <div
          className='carousel-card-inner'
          style={{
            backgroundColor: item.background
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
      <React.StrictMode>
        <TouchCarousel
          component={Container}
          cardSize={cardSize}
          cardCount={data.length}
          cardPadCount={cardPadCount}
          autoplay={3e3}
          vertical
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
