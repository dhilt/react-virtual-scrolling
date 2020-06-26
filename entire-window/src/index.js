import React from 'react'
import ReactDOM from 'react-dom'
import VirtualScroller from './VirtualScroller'
import './style.css'

const SETTINGS = {
  itemHeight: 20,
  tolerance: 5,
  minIndex: 1,
  maxIndex: 10000,
  startIndex: 1
}

const getData = (offset, limit) => {
  const data = []
  const start = Math.max(SETTINGS.minIndex, offset)
  const end = Math.min(offset + limit - 1, SETTINGS.maxIndex)
  console.log(`request [${offset}..${offset + limit - 1}] -> [${start}..${end}] items`)
  if (start <= end) {
    for (let i = start; i <= end; i++) {
      data.push({ index: i, text: `item ${i}` })
    }
  }
  return data
}

const rowTemplate = item => (
  <div className="item" key={item.index}>
    {item.text}
  </div>
)

const AppComponent = () => (
  <VirtualScroller get={getData} settings={SETTINGS} row={rowTemplate}/>
)

ReactDOM.render(<AppComponent />, document.querySelector('#root'))
