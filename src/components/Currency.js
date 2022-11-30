import React, {useState, useEffect} from 'react';

// const BASE_URL = 'http://api.exchangeratesapi.io/v1/latest?access_key=mm3NreLJHowYZg6brN6419854OVto8hb';
// const CONVERT_URL = 'http://api.exchangeratesapi.io/v1/convert?access_key=mm3NreLJHowYZg6brN6419854OVto8hb';

var myHeaders = new Headers();
myHeaders.append('apikey', 'mm3NreLJHowYZg6brN6419854OVto8hb');

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

function Currency() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [from, setFrom] = useState();
  const [to, setTo] =  useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  console.log(currencyOptions);
  console.log(exchangeRate);

  useEffect(() => {
    fetch('https://api.apilayer.com/exchangerates_data/latest?', requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const firstCurrency = Object.keys(data.rates)[0];
      console.log(firstCurrency);
      setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
      setFrom(data.base);
      setTo(firstCurrency);
      //setExchangeRate(data.rates[firstCurrency]);
      setExchangeRate(data.rates.firstCurrency);
    })
    .catch((error) => console.log('error', error));
  }, []);

  useEffect(() => {
    if(from != null && to != null) {
      fetch(`https://api.apilayer.com/exchangerates_data/convert?from=${from}&to=${to}&amount=${amount}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        //setExchangeRate(data.rates[to])})
        setExchangeRate(data.info.rate)})
      .catch((error) => console.log('error', error));
    }
  }, [from, to]);
  
  let fromAmount, toAmount;
  if(amountInFromCurrency) {
    fromAmount = amount;
    toAmount = fromAmount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = toAmount / exchangeRate;
  }

  return (
    <div className='counter-container'>
      <div className='text-box'>
        <div className='inputarea'>
          <div className='navbar-container'>
            <h2>CURRENCY CONVERTER</h2> 
          </div>
          <div className='from'>
            <input 
              type='number' 
              placeholder='Enter Amount' 
              value={fromAmount} 
              onChange={(e) => {
                setAmount(e.target.value);
                setAmountInFromCurrency(true);
              }}
            />
            <select 
              value={from} 
              onChange={(e) => {
                setFrom(e.target.value);
              }}
            >
              {currencyOptions.map((item) => {
                return <option value={item} key={item + Math.random()}>{item}</option>
              })}
            </select>
            <h1>=</h1>
            <div className='to'>
              <input 
                type='number' 
                placeholder='Enter Amount' 
                value={toAmount} 
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountInFromCurrency(false);
                }}
              />
              <select 
                value={to} 
                onChange={(e) => {
                  setTo(e.target.value);
                }}
              >
                {currencyOptions.map((item) => {
                  return <option value={item} key={item + Math.random()}>{item}</option>
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Currency;
