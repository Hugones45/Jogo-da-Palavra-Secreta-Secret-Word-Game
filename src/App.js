import StarScreen from './components/StartScreen';
import Game from './components/Game'
import GameOver from './components/GameOver';

import './App.css';

import { useCallback, useState, useEffect } from 'react';
import { wordsList } from './data/word'


const stages = [
  { id: 1, name: 'Start' },
  { id: 2, name: 'Game' },
  { id: 3, name: 'End' }
]

function App() {

  const [gameState, setGameStage] = useState(stages[0].name)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  const [word] = useState(wordsList)

  const pickWordAndCategory = () => {
    const categories = Object.keys(word)

    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)]

    const words = word[category][Math.floor(Math.random() * word[category].length)]

    return { words, category }
  }

  const startGame = useCallback(() => {
    clearLetterStates()

    const { words, category } = pickWordAndCategory()

    let wordLetters = words.split("")

    wordLetters = wordLetters.map((letter) => letter.toLowerCase())
    console.log(wordLetters)

    setPickedCategory(category)
    setPickedWord(words)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  })

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setGuessedLetters((wrongGuessedLetters) => [
        ...wrongGuessedLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    if (guessedLetters.length === uniqueLetters.length && gameState === stages[1].name) {
      setScore((actualScore) => (actualScore += 100))

      startGame()
    }

  }, [guessedLetters, letters, startGame, gameState])



  const retry = () => {

    setScore(0)
    setGuesses(3)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">

      {gameState === 'Start' && <StarScreen startGame={startGame} />}
      {gameState === 'Game' && <Game verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />}
      {gameState === 'End' && <GameOver retry={retry}
        score={score}
      />}
    </div>
  );
}

export default App;
