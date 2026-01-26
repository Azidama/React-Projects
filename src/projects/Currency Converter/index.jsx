import { useState, useEffect, useRef, useMemo } from "react"
import "./styles.css"

export function CurrencyConverter() {
  const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 156.7
  }
  const currencies = Object.keys(exchangeRates)
  const [startCurrency, setStartCurrency] = useState(currencies[0])
  const [targetCurrency, setTargetCurrency] = useState(currencies[0])
  const [convertFrom, setConvertFrom] = useState(1)

  const converted = useMemo(() => {
    const from = exchangeRates[startCurrency]
    let rateList = {}
    for(let curr in exchangeRates){
        rateList[curr] = ((exchangeRates[curr] / from) * convertFrom).toFixed(2)
    }
    return rateList
  }, [startCurrency, convertFrom])

  return (
    <div className='container'>
      <h1>Currency Converter</h1>
      <h2 className='to-convert content'>{startCurrency} to {targetCurrency} conversion</h2>
      <input 
        type='number' 
        className='user-input' 
        value={convertFrom}
        onChange={(e) => setConvertFrom(e.target.value)}
      />
      <p className='currency content'>Convert From</p>
      <select
        className='user-input' 
        value={startCurrency} 
        onChange={(prev) => setStartCurrency(prev.target.value)}
      >
        {currencies.map((curr) => 
          <option key={curr}>{curr}</option>
        )}
      </select>
      <p className='currency content'>Convert To</p>
      <select 
        className='user-input' 
        value={targetCurrency} 
        onChange={(e) => setTargetCurrency(e.target.value)}
      >
          {currencies.map((curr) => 
            <option key={curr}>{curr}</option>
          )}
      </select>
      <h2 className='converted content'>Converted Amount: {converted[targetCurrency]} {targetCurrency}</h2>
    </div>
  )
}