import React, {Component} from 'react'
import {render} from 'react-dom'
import NonPassiveTouchTarget from '../NonPassiveTouchTarget'
import TouchCarousel, {clamp, range} from '../../src'
import touchWithMouseHOC from '../../src/touchWithMouseHOC'
import './index.css'

const data = range(0, 999).map(n => ({
  title: `Card ${n}`,
  text: `This is card ${n}`
}))
const queryPage = parseInt(window.location.search.slice(1))
const startPage = queryPage ? clamp(queryPage, 0, data.length - 1) : 0

const carouselWidth = clamp(window.innerWidth, 0, 960)
const cardSize = carouselWidth

class App extends Component {
  constructor (props) {
    super(props)
    const renderedData = this.getRenderedData(startPage)
    this.state = {
      page: clamp(startPage, 0, data.length - renderedData.length),
      renderedData
    }
    this.defaultCursor = (data.length - renderedData.length) - startPage
  }

  // Open a length-3 window on the data
  getRenderedData (cursor) {
    switch (cursor) {
      case 0: {
        return data.slice(0, 3)
      }
      case data.length - 1: {
        return data.slice(data.length - 3)
      }
      default: {
        return data.slice(cursor - 1, cursor + 2)
      }
    }
  }

  modPage = () => {
    const cursor = this.carousel.getCursor()
    const {page, renderedData} = this.state
    if (Math.round(cursor) !== cursor) return
    if ( // Do we reach the edge of the window but not the edge of the data?
      (page !== 0 && cursor === 0) ||
      (page !== data.length - renderedData.length && cursor === 1 - renderedData.length)
    ) {
      // Then move the window.
      const newCursor = -1 // put cursor at center
      const newPage = page - cursor + newCursor
      this.setState({
        page: newPage,
        renderedData: this.getRenderedData(newPage)
      })
      // This kinda breaks grabbing. But not a big deal I guess.
      this.carousel.modAs(newCursor)
    }
  }

  container = touchWithMouseHOC((props) => {
    const {cursor, carouselState, ...rest} = props
    const translateX = cursor * cardSize
    return (
      <NonPassiveTouchTarget
        className='carousel-container'
        onTouchStart={this.modPage}
        onMouseDown={this.modPage}
      >
        <NonPassiveTouchTarget
          className='carousel-track'
          style={{transform: `translate3d(${translateX}px, 0, 0)`}}
          {...rest}
        />
      </NonPassiveTouchTarget>
    )
  })

  renderCard = (index, _, cursor) => {
    const {page} = this.state
    const item = data[page + index]

    return (
      <div key={index} className='carousel-card'>
        <div className='carousel-card-inner'>
          <div className='carousel-title'>{item.title}</div>
          <div className='carousel-text'>{item.text}</div>
        </div>
      </div>
    )
  }

  render () {
    const {renderedData} = this.state
    const CarouselContainer = this.container
    return (
      <React.StrictMode>
        <TouchCarousel
          ref={elt => { this.carousel = elt }}
          component={CarouselContainer}
          cardSize={cardSize}
          cardCount={renderedData.length}
          loop={false}
          renderCard={this.renderCard}
          defaultCursor={this.defaultCursor}
        />
      </React.StrictMode>
    )
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const ndRoot = document.getElementById('react-root')
  render(<App />, ndRoot)
})
