import React, { useState, useEffect } from 'react';

const getInitialState = (settings) => {
  const { itemHeight, tolerance, minIndex, maxIndex, startIndex } = settings
  const amount = Math.floor(window.innerHeight / itemHeight)
  const viewportHeight = amount * itemHeight
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight
  const toleranceHeight = tolerance * itemHeight
  const bufferHeight = viewportHeight + 2 * toleranceHeight
  const bufferedItems = amount + 2 * tolerance
  const itemsAbove = startIndex - tolerance - minIndex
  const topPaddingHeight = itemsAbove * itemHeight
  const bottomPaddingHeight = totalHeight - topPaddingHeight
  const initialPosition = topPaddingHeight + toleranceHeight
  return {
    settings,
    viewportHeight,
    totalHeight,
    toleranceHeight,
    bufferHeight,
    bufferedItems,
    topPaddingHeight,
    bottomPaddingHeight,
    initialPosition,
    data: []
  }
}

const getNewState = (state, get, scrollTop) => {
  const { totalHeight, toleranceHeight, bufferedItems, settings: { itemHeight, minIndex }} = state
  const index = minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight)
  const data = get(index, bufferedItems)

  const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0)
  const bottomPaddingHeight = Math.max(totalHeight - topPaddingHeight - data.length * itemHeight, 0)

  return {
    ...state,
    topPaddingHeight,
    bottomPaddingHeight,
    data
  }
}

const Scroller = ({ get, row, settings }) => {
  const [state, setState] = useState(() => getInitialState(settings))

  useEffect(() => {
    const runScroller = () => setState(s => getNewState(s, get, window.scrollY))
    window.addEventListener('scroll', runScroller, { passive: true })
    window.scroll(0, state.initialPosition)
    if (!state.initialPosition) {
      runScroller()
    }
    return () => window.removeEventListener('scroll', runScroller)
  }, [get, settings, state.initialPosition])

  return (
    <>
      <div style={{ height: state.topPaddingHeight }}></div>
      {state.data.map(row)}
      <div style={{ height: state.bottomPaddingHeight }}></div>
    </>
  )
}

export default Scroller
