import { useState, useEffect, useRef } from "react"
import "./styles.css"

export const ColorPicker = () => {
  const [pickColor, setPickColor] = useState('#ffffff')
  const handleColorChange = (e) => {
    setPickColor(e.target.value)
  }
  return (
    <div id="color-picker-container" style={{backgroundColor: pickColor}}>
      <input 
        type="color" 
        id="color-input"
        value={pickColor}
        onChange={handleColorChange}
      />
    </div>
  )
};
