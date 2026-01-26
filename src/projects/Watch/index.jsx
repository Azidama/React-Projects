import { useState, useEffect, useRef } from "react"
import "./styles.css"

export const Watch = () => {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  
  const incrementor = (n) => {
    if(n < 9){
      n = n + 1
      return `0${String(n)}`
    }
    n = n + 1
    return String(n)
  }
  const decrementor = (n) => {
    if(n < 9){
      n = n - 1
      return `0${String(n)}`
    }
    n = n - 1
    return String(n)
  }
  
  const getNumber = (num, crememtor, setter) => {
    const intNum = Number(num)
    setter(crememtor(intNum))
  }
  function handleHoursUpButtonClick() {
    if (hours === '23') {
       setHours('00')
       return
      }
    getNumber(hours, incrementor, setHours)
  }

  function handleHoursDownButtonClick() {
    if (hours === '00') { 
      setHours('23')
       return
    }
    getNumber(hours, decrementor, setHours)
  }

  function handleMinutesUpButtonClick() {
    if (minutes === '59') { 
      setMinutes('00')
      handleHoursUpButtonClick()
      return
    }
    getNumber(minutes, incrementor, setMinutes)
  }

  function handleMinutesDownButtonClick() {
    if (minutes === '00') {
       setMinutes('59')
       handleHoursDownButtonClick()
       return
      }
    getNumber(minutes, decrementor, setMinutes)
  }

  return (
    <div id="ClockUpdater" className="container">
      <div className="row">
        <button
          id="hours-up-button"
          onClick={handleHoursUpButtonClick}
          className="btn btn-outline-primary col"
        >
          &uarr;
        </button>

        <button
          id="minutes-up-button"
          className="btn btn-outline-primary col"
          onClick={handleMinutesUpButtonClick}
        >
          &uarr;
        </button>
      </div>

      <div className="row">
        <div id="clock" className="badge badge-primary col">
          {`${hours}:${minutes}`}
        </div>
      </div>

      <div className="row">
        <button
          id="hours-down-button"
          onClick={handleHoursDownButtonClick}
          className="btn btn-outline-primary col"
        >
          &darr;
        </button>

        <button
          id="minutes-down-button"
          className="btn btn-outline-primary col"
          onClick={handleMinutesDownButtonClick}
        >
          &darr;
        </button>
      </div>
    </div>
  );
};
