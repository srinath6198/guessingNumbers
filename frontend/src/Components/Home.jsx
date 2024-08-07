import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home = () => {
   const navigate= useNavigate();

   const handleButton =()=>{
    navigate('/guessingGame')
   }
   const style ={
    
  button:{
        width:'200px',height:'200px', borderRadius:'50%',
        marginLeft:'100px'
    }
    
   }
  return (
    <div>
        <h1>Welcome to Guessing Number</h1>

        <button  onClick={handleButton} style={style.button}>START</button>
    </div>
  )
}

export default Home