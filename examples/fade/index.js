import React, {Component} from 'react'
import {render} from 'react-dom'
import data from '../data'
import NonPassiveTouchTarget from '../NonPassiveTouchTarget'
import TouchCarousel, {clamp} from '../../src'
import touchWithMouseHOC from '../../src/touchWithMouseHOC'
import './index.css'

const cardSize = 300
const cardPadCount = 2

function CarouselContainer (props) {
  const {cursor, carouselState, ...rest} = props
  return (
    <NonPassiveTouchTarget className='carousel-container'>
      <NonPassiveTouchTarget className='carousel-track' {...rest} />
    </NonPassiveTouchTarget>
  )
}

const Container = touchWithMouseHOC(CarouselContainer)

class App extends Component {
  renderCard (index, modIndex, cursor) {
    const item = data[modIndex]
    const opacity = 1 - 1.5 * Math.abs(index + cursor)
    const zIndex = opacity * data.length
    return (
      <div
        key={index}
        className='carousel-card'
        style={{
          opacity: clamp(opacity, 0, 1),
          zIndex
        }}
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
          autoplay={2e3}
          renderCard={this.renderCard}
          stiffness={100}
        />
      </React.StrictMode>
    )
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const ndRoot = document.getElementById('react-root')
  render(<App />, ndRoot)
})
