import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home = () => {
   const navigate= useNavigate();

   const handleButton =()=>{
    navigate('/guessingGame')
   }
   
  return (
    <div className='home'>
        <h1 className='header'>Welcome to Guessing Number</h1>
        <h1>Guess the Number Game</h1>

        <button  className='btn' id="str" onClick={handleButton} >START</button>
    </div>
  )
}

export default Home
