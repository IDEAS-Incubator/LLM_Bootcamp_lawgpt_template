import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GptIcon } from '../../assets'
import './style.scss'

const RegisterPendings = ({ _id }) => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fName: '',
    lName: ''
  })

  const formHandle = (e) => {
    e.preventDefault()
    
    // Frontend-only logic for form submission (no API call)
    if (formData?.fName && formData?.lName) {
      // Simulate registration success and navigate to login or home
      alert("Registration successful!");
      navigate('/login');
    } else {
      alert("Please enter your full name.");
    }
  }

  return (
    <div className='Contain'>
      <div className='icon'>
        {/*<GptIcon />*/}
      </div>

      <h1>Tell us about you</h1>

      <form className="pendings" onSubmit={formHandle}>
        <div className="fullName">
          <input 
            type="text"
            value={formData.fName}
            placeholder='First name'
            onInput={(e) => setFormData({ ...formData, fName: e.target.value })}
          />
          <input 
            type="text"
            value={formData.lName}
            placeholder='Last name'
            onInput={(e) => setFormData({ ...formData, lName: e.target.value })}
          />
        </div>

        <button type='submit'>Continue</button>

        <div>
          <p>By clicking "Continue", you agree to our <span>Terms</span>, <br /><span>Privacy policy</span> and confirm you're 18 years or older.</p>
        </div>
      </form>
    </div>
  )
}

export default RegisterPendings
