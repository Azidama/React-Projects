import { useState, useEffect, useRef } from "react"
import "./styles.css"

export function RSVPEventForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [attendees, setAttendees] = useState(1)
  const [preferences, setPreferences] = useState('')
  const [guests, setGuests] = useState(false)
  const [submittedData, setSubmittedData]= useState(null);
  
  const handleSubmit =(e)=>{
    setSubmittedData({ name, email, attendees, preferences, guests })
    e.preventDefault()
  }
  const handleAttendees = (e) => {
    if(e.target.value < 1) return
    setAttendees(e.target.value)
  }
  return (
    <div className='form-container'>
      <h2>Event RSVP Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:
          <input
            className='input-field'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>Email:
          <input 
            className='input-field' 
            type='email' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>Number of Attendees:
          <input 
            className='input-field' 
            type='number' 
            value={attendees}
            onChange={handleAttendees}
            required
            min='1'
          />
        </label>
        <label>Dietary Preferences:
          <input 
            className='input-field' 
            type='text' 
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
          />
        </label>
        <label>Bringing additional guests?
          <input 
            type='checkbox' 
            value={guests}
            onChange={(e) => setGuests(e.target.checked)}
          />
        </label>
        <button
          className='input-field'
          type='submit'
        >
          Confirm RSVP
        </button>
      </form>
      {submittedData && (
        <div>
          <h3>Confirmation</h3>
          <p><strong>Name:</strong> {submittedData.name}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Number of Attendees:</strong> {submittedData.attendees}</p>
          <p><strong>Dietary Preferences:</strong> {submittedData.preferences || 'None'}</p>
          <p><strong>Bringing Additional Guests?:</strong>  {submittedData.guests ? 'Yes' : 'No'}</p>
        </div>)}
    </div>
  )
}