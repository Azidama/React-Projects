import { useState, useEffect, useRef } from "react"
import "./styles.css"

export const OTPGenerator = () => {
  const [otp, setOtp] = useState(0)
  const [timer, setTimer] = useState(0)
  const hasTime = timer > 0
  const otpGenerated = otp > 0
  const disableCursor = { cursor: hasTime ? "not-allowed" : "" }

  const handleClick = ()=>{
    setOtp(()=> Math.floor(100000 + Math.random() * 900000))
    setTimer(5)
  }

  useEffect(()=>{
    if(!hasTime && otpGenerated) {
      return
    }
    const timerId = setInterval(()=>{ setTimer(timer-1) }, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [timer])

  return (
    <div className="container">
      <h1 id="otp-title">OTP Generator</h1>
      <h2 id="otp-display">{otpGenerated ? otp : "Click 'Generate OTP' to get a code"}</h2>
      <p id="otp-timer" aria-live="polite">
          {otpGenerated ? (timer > 0
            ? `Expires in: ${timer} seconds`
            : "OTP expired. Click the button to generate a new OTP."
          ) : ''}
        </p>
      <button 
        style={disableCursor} 
        disabled={hasTime} 
        id="generate-otp-button" 
        onClick={handleClick}
      >
        Generate OTP
      </button>
    </div>
  )
};