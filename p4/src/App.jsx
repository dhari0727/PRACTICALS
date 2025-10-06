import { useState } from 'react'
import './App.css'

function CounterApp() {
  const [count, setCount] = useState(0)
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')

  const inc = () => setCount(count + 1)
  const dec = () => setCount(count - 1)
  const reset = () => setCount(0)
  const incrementFive = () => setCount(count + 5)

  return (
    <div className="container">
      <h1>React Counter App</h1>
      <h2>Count: {count}</h2>

      <div className="button-container">
        <button onClick={inc}>Increment</button>
        <button onClick={dec}>Decrement</button>
        <button onClick={reset}>Reset</button>
        <button onClick={incrementFive}>Increment by 5</button>
      </div>

      <hr style={{ margin: '20px 0', borderColor: '#ff69b4' }} />

      <div>
        <input
          type="text"
          placeholder="First Name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Surname"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
        />
      </div>

      <h3>Your Name: {fname} {lname}</h3>
    </div>
  )
}

export default CounterApp
