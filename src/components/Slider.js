import React, { useState } from 'react'

const Slider = ({
  initialSliderValue,
  min,
  max,
  updateValue
}) => {
  const [sliderValue, setSliderValue] = useState(initialSliderValue)
  const handleChange = event => {
    setSliderValue(event.target.value)
    updateValue(event.target.value)
  }
  return (
    <input
      type='range'
      className='slider'
      min={min}
      max={max}
      value={sliderValue}
      onChange={handleChange}
    />
  )
}

export default Slider
