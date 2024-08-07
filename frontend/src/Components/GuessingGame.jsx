import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './GuessingGame.css';
import profile from '../Assets/profile.png';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa'; // Import the close icon from react-icons

const generateUniqueNumber = () => {
    const digits = '0123456789'.split('');
    let number = '';
    
    while (number.length < 4) {
        const index = Math.floor(Math.random() * digits.length);
        number += digits[index];
        digits.splice(index, 1);
    }
    console.log(number);
    return number;
};

Modal.setAppElement('#root');

const GuessingGame = () => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [guesses, setGuesses] = useState(0);
    const [bestScore, setBestScore] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchBestScore = async () => {
            const response = await axios.get('http://localhost:5000/api/scores/best');
            setBestScore(response.data);
        };

        fetchBestScore();
       
    }, []);

    // console.log(bestScore);
    useEffect(() => {
        if (startTime) {
            intervalRef.current = setInterval(() => {
                setTimer(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        
        return () => clearInterval(intervalRef.current);
    }, [startTime]);

    const startNewGame = () => {
        const newNumber = generateUniqueNumber();
        setNumber(newNumber);
        setGuess('');
        setFeedback('');
        setGuesses(0);
        setStartTime(Date.now());
        setTimer(0);
    };

    const restartGame = () => {
        startNewGame();
    };

    const calculateScore = (time, guesses) => {
        const weightTime = 2;
        const weightGuesses = 1;
        return (weightTime * time + weightGuesses * guesses) / (weightTime + weightGuesses);
    };

    const handleGuess = async () => {
        console.log('User Guess:', guess);
        let newFeedback = '';
        let computerNumber = number.split('');
        let userGuess = guess.split('');
        let correct = 0;
        let feedbackArray = ['.', '.', '.', '.'];

        for (let i = 0; i < userGuess.length; i++) {
            if (userGuess[i] === computerNumber[i]) {
                feedbackArray[i] = '+';
                correct++;
                computerNumber[i] = null;
            } else if (computerNumber.includes(userGuess[i])) {
                feedbackArray[i] = '-';
            }
        }

        newFeedback = feedbackArray.join('');
        setFeedback(newFeedback);
        setGuesses(guesses + 1);

        if (correct === 4) {
            const endTime = Date.now();
            const totalTimeTaken = (endTime - startTime) / 1000;
            // const score = calculateScore(totalTimeTaken, guesses + 1);
            const  roundedScore= calculateScore(totalTimeTaken, guesses + 1);
            const  score = parseFloat(roundedScore.toFixed(2));

            const response = await axios.post('http://localhost:5000/api/scores', {
                name,
                score,
                guesses: guesses + 1,
                timeTaken: totalTimeTaken
            });

            setBestScore(response.data);
            clearInterval(intervalRef.current);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // window.location.reload();
    };
    const closeModals = () => {
        setIsModalOpen(false);
        window.location.reload();
    };

    return (
        <div className="container">
            <h1>Guess the Number Game</h1>
            {!number ? (
                <>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={startNewGame}>Start New Game</button>
                </>
            ) : (
                <>
                    <h2>Guess the 4-digit number</h2>
                    <span className="modal-close-button" onClick={closeModals}>X</span>
                    <div className="timer">
                        <h2>Time: {timer}s</h2>
                        <span className='best-score'>
                            <p>Name:{bestScore.name}</p>
                            <p>Best Score:{bestScore.score}</p>
                        </span>
                    </div>
                    <div className="userName">
                        <span><img src={profile} alt="User Profile" /></span>
                        <p>{name}</p>
                    </div>
                    <input
                        type="text"
                        maxLength="4"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                    />
                    <button onClick={handleGuess}>Submit Guess</button>
                    <p className="feedback">Feedback: {feedback}</p>
                    <p>Guesses: {guesses}</p>
                    <button onClick={restartGame}>Restart Game</button>
                </>
            )}

            <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal">
                <h2>Your Score</h2>
                {bestScore && (
                    <div className="best-score">
                        <p>Name: {bestScore.name}</p>
                        <p>Score: {bestScore.score}</p>
                        <p>Guesses: {bestScore.guesses}</p>
                        <p>Time Taken: {bestScore.timeTaken}s</p>
                    </div>
                )}
                <button onClick={closeModal}><FaTimes /></button>
            </Modal>
        </div>
    );
};

export default GuessingGame;
