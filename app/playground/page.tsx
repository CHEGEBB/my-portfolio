"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { 
  Cpu, Brain, Eye, Play, Lock, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6,
  Trophy, Star, Target, Zap, Heart, Diamond, Club, Spade, ArrowRight,
  RefreshCw, Home, Settings, User, BookOpen, Lightbulb, Activity,
  MessageCircle, ThumbsUp, ThumbsDown, HelpCircle, Award, Gamepad2
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function PlaygroundPage() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])

  // Game States
  const [activeGame, setActiveGame] = useState(null)
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    achievements: []
  })

  // Trivia Game State
  const [triviaQuestion, setTriviaQuestion] = useState(null)
  const [triviaLoading, setTriviaLoading] = useState(false)
  const [triviaScore, setTriviaScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showTriviaResult, setShowTriviaResult] = useState(false)

  // Card Game State
  const [deck, setDeck] = useState(null)
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [gamePhase, setGamePhase] = useState('start') // start, playing, result

  // Number Facts State
  const [numberFact, setNumberFact] = useState("")
  const [factLoading, setFactLoading] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState(Math.floor(Math.random() * 100) + 1)

  // Yes/No Decision State
  const [decision, setDecision] = useState(null)
  const [decisionLoading, setDecisionLoading] = useState(false)
  const [userQuestion, setUserQuestion] = useState("")

  // Activity Suggestion State
  const [activity, setActivity] = useState(null)
  const [activityLoading, setActivityLoading] = useState(false)

  // Advice State
  const [advice, setAdvice] = useState("")
  const [adviceLoading, setAdviceLoading] = useState(false)

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [memoryMoves, setMemoryMoves] = useState(0)

  // Dice Game State
  const [diceRolls, setDiceRolls] = useState([1, 1])
  const [diceTotal, setDiceTotal] = useState(2)
  const [diceHistory, setDiceHistory] = useState([])

  // Rock Paper Scissors State
  const [playerChoice, setPlayerChoice] = useState(null)
  const [computerChoice, setComputerChoice] = useState(null)
  const [rpsResult, setRpsResult] = useState("")
  const [rpsScore, setRpsScore] = useState({ player: 0, computer: 0 })

  // Fetch Trivia Question
  const fetchTriviaQuestion = async () => {
    setTriviaLoading(true)
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple')
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        const question = data.results[0]
        const answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)
        setTriviaQuestion({
          ...question,
          all_answers: answers
        })
      }
    } catch (error) {
      console.error('Error fetching trivia:', error)
    }
    setTriviaLoading(false)
  }

  // Initialize Card Deck
  const initializeDeck = async () => {
    try {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      const data = await response.json()
      setDeck(data)
      setPlayerHand([])
      setDealerHand([])
      setGamePhase('start')
    } catch (error) {
      console.error('Error initializing deck:', error)
    }
  }

  // Draw Cards
  const drawCards = async (count) => {
    if (!deck) return []
    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${count}`)
      const data = await response.json()
      return data.cards || []
    } catch (error) {
      console.error('Error drawing cards:', error)
      return []
    }
  }

  // Fetch Number Fact
  const fetchNumberFact = async () => {
    setFactLoading(true)
    try {
      const response = await fetch(`http://numbersapi.com/${selectedNumber}`)
      const fact = await response.text()
      setNumberFact(fact)
    } catch (error) {
      setNumberFact(`${selectedNumber} is a pretty cool number!`)
    }
    setFactLoading(false)
  }

  // Get Yes/No Decision
  const getDecision = async () => {
    setDecisionLoading(true)
    try {
      const response = await fetch('https://yesno.wtf/api')
      const data = await response.json()
      setDecision(data)
    } catch (error) {
      console.error('Error getting decision:', error)
    }
    setDecisionLoading(false)
  }

  // Get Activity Suggestion
  const getActivity = async () => {
    setActivityLoading(true)
    try {
      const response = await fetch('https://www.boredapi.com/api/activity/')
      const data = await response.json()
      setActivity(data)
    } catch (error) {
      console.error('Error getting activity:', error)
    }
    setActivityLoading(false)
  }

  // Get Advice
  const getAdvice = async () => {
    setAdviceLoading(true)
    try {
      const response = await fetch('https://api.adviceslip.com/advice')
      const data = await response.json()
      setAdvice(data.slip.advice)
    } catch (error) {
      console.error('Error getting advice:', error)
    }
    setAdviceLoading(false)
  }

  // Initialize Memory Game
  const initializeMemoryGame = () => {
    const symbols = ['🎮', '🎯', '🎲', '🎭', '🎨', '🎪', '🎸', '🎤']
    const cards = [...symbols, ...symbols].map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    })).sort(() => Math.random() - 0.5)
    
    setMemoryCards(cards)
    setFlippedCards([])
    setMatchedCards([])
    setMemoryMoves(0)
  }

  // Handle Memory Card Click
  const handleMemoryCardClick = (cardId) => {
    if (flippedCards.length === 2) return
    if (flippedCards.includes(cardId)) return
    if (matchedCards.includes(cardId)) return

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMemoryMoves(memoryMoves + 1)
      const [first, second] = newFlipped
      const firstCard = memoryCards.find(c => c.id === first)
      const secondCard = memoryCards.find(c => c.id === second)

      if (firstCard.symbol === secondCard.symbol) {
        setMatchedCards([...matchedCards, first, second])
      }

      setTimeout(() => {
        setFlippedCards([])
      }, 1000)
    }
  }

  // Roll Dice
  const rollDice = () => {
    const roll1 = Math.floor(Math.random() * 6) + 1
    const roll2 = Math.floor(Math.random() * 6) + 1
    const total = roll1 + roll2
    
    setDiceRolls([roll1, roll2])
    setDiceTotal(total)
    setDiceHistory([...diceHistory, { rolls: [roll1, roll2], total }].slice(-10))
  }

  // Play Rock Paper Scissors
  const playRPS = (choice) => {
    const choices = ['rock', 'paper', 'scissors']
    const computer = choices[Math.floor(Math.random() * 3)]
    
    setPlayerChoice(choice)
    setComputerChoice(computer)
    
    let result = ""
    if (choice === computer) {
      result = "It's a tie!"
    } else if (
      (choice === 'rock' && computer === 'scissors') ||
      (choice === 'paper' && computer === 'rock') ||
      (choice === 'scissors' && computer === 'paper')
    ) {
      result = "You win!"
      setRpsScore({ ...rpsScore, player: rpsScore.player + 1 })
    } else {
      result = "Computer wins!"
      setRpsScore({ ...rpsScore, computer: rpsScore.computer + 1 })
    }
    
    setRpsResult(result)
  }

  // Dice component
  const DiceIcon = ({ value }) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    const Icon = icons[value - 1]
    return <Icon className="w-12 h-12 text-emerald-400" />
  }

  const games = [
    {
      id: 'trivia',
      title: "Brain Quiz Master",
      description: "Test your knowledge with trivia questions",
      icon: Brain,
      difficulty: "Medium",
      color: "from-blue-500 to-cyan-600",
      status: "ACTIVE",
    },
    {
      id: 'cards',
      title: "Card Draw Challenge",
      description: "Draw cards and test your luck",
      icon: Diamond,
      difficulty: "Easy",
      color: "from-red-500 to-pink-600",
      status: "ACTIVE",
    },
    {
      id: 'numbers',
      title: "Number Facts Explorer",
      description: "Discover amazing facts about numbers",
      icon: Target,
      difficulty: "Easy",
      color: "from-purple-500 to-indigo-600",
      status: "ACTIVE",
    },
    {
      id: 'decision',
      title: "Decision Maker Oracle",
      description: "Get cosmic answers to your questions",
      icon: Eye,
      difficulty: "Easy",
      color: "from-green-500 to-teal-600",
      status: "ACTIVE",
    },
    {
      id: 'activity',
      title: "Boredom Buster",
      description: "Get personalized activity suggestions",
      icon: Activity,
      difficulty: "Easy",
      color: "from-yellow-500 to-orange-600",
      status: "ACTIVE",
    },
    {
      id: 'advice',
      title: "Wisdom Generator",
      description: "Receive life-changing advice",
      icon: Lightbulb,
      difficulty: "Easy",
      color: "from-cyan-500 to-blue-600",
      status: "ACTIVE",
    },
    {
      id: 'memory',
      title: "Memory Matrix",
      description: "Match pairs and challenge your memory",
      icon: Cpu,
      difficulty: "Hard",
      color: "from-pink-500 to-rose-600",
      status: "ACTIVE",
    },
    {
      id: 'dice',
      title: "Dice Roll Fortune",
      description: "Roll the dice and track your luck",
      icon: Dice1,
      difficulty: "Easy",
      color: "from-indigo-500 to-purple-600",
      status: "ACTIVE",
    },
    {
      id: 'rps',
      title: "Rock Paper Scissors",
      description: "Classic game with score tracking",
      icon: Zap,
      difficulty: "Easy",
      color: "from-emerald-500 to-green-600",
      status: "ACTIVE",
    },
  ]

  // Game Components
  const renderGameContent = () => {
    switch (activeGame) {
      case 'trivia':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">Score: {triviaScore}</h3>
              <button
                onClick={fetchTriviaQuestion}
                disabled={triviaLoading}
                className="cyber-button px-6 py-3 text-lg"
              >
                {triviaLoading ? "Loading..." : "New Question"}
              </button>
            </div>
            
            {triviaQuestion && (
              <div className="glass-dark p-6 rounded-lg border border-blue-400/30">
                <h4 className="text-xl mb-4 text-white" dangerouslySetInnerHTML={{ __html: triviaQuestion.question }} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {triviaQuestion.all_answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedAnswer(answer)
                        setShowTriviaResult(true)
                        if (answer === triviaQuestion.correct_answer) {
                          setTriviaScore(triviaScore + 10)
                        }
                      }}
                      disabled={showTriviaResult}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        showTriviaResult
                          ? answer === triviaQuestion.correct_answer
                            ? 'border-green-400 bg-green-400/20 text-green-400'
                            : answer === selectedAnswer
                            ? 'border-red-400 bg-red-400/20 text-red-400'
                            : 'border-gray-600 text-gray-500'
                          : 'border-blue-400/30 hover:border-blue-400 text-white'
                      }`}
                      dangerouslySetInnerHTML={{ __html: answer }}
                    />
                  ))}
                </div>
                
                {showTriviaResult && (
                  <div className="mt-4 text-center">
                    <p className={`text-lg ${selectedAnswer === triviaQuestion.correct_answer ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedAnswer === triviaQuestion.correct_answer ? '🎉 Correct!' : '❌ Wrong!'}
                    </p>
                    <button
                      onClick={() => {
                        setShowTriviaResult(false)
                        setSelectedAnswer(null)
                        fetchTriviaQuestion()
                      }}
                      className="cyber-button mt-2"
                    >
                      Next Question
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case 'cards':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={initializeDeck}
                className="cyber-button px-6 py-3 text-lg mr-4"
              >
                New Deck
              </button>
              <button
                onClick={async () => {
                  const cards = await drawCards(1)
                  if (cards.length > 0) {
                    setPlayerHand([...playerHand, ...cards])
                  }
                }}
                disabled={!deck}
                className="cyber-button px-6 py-3 text-lg"
              >
                Draw Card
              </button>
            </div>

            {playerHand.length > 0 && (
              <div className="glass-dark p-6 rounded-lg border border-red-400/30">
                <h4 className="text-xl mb-4 text-white">Your Cards:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {playerHand.map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg p-2 text-center shadow-lg"
                    >
                      <img src={card.image} alt={`${card.value} of ${card.suit}`} className="w-full" />
                    </motion.div>
                  ))}
                </div>
                <button
                  onClick={() => setPlayerHand([])}
                  className="cyber-button mt-4"
                >
                  Clear Hand
                </button>
              </div>
            )}
          </div>
        )

      case 'numbers':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <input
                  type="number"
                  value={selectedNumber}
                  onChange={(e) => setSelectedNumber(e.target.value)}
                  className="cyber-input w-32 text-center text-2xl"
                  min="1"
                  max="999999"
                />
              </div>
              <button
                onClick={fetchNumberFact}
                disabled={factLoading}
                className="cyber-button px-6 py-3 text-lg"
              >
                {factLoading ? "Loading..." : "Get Fact"}
              </button>
            </div>

            {numberFact && (
              <div className="glass-dark p-6 rounded-lg border border-purple-400/30">
                <p className="text-lg text-white text-center">{numberFact}</p>
              </div>
            )}
          </div>
        )

      case 'decision':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Ask a yes/no question..."
                  className="cyber-input w-full max-w-md text-center"
                />
              </div>
              <button
                onClick={getDecision}
                disabled={decisionLoading}
                className="cyber-button px-6 py-3 text-lg"
              >
                {decisionLoading ? "Consulting the universe..." : "Get Answer"}
              </button>
            </div>

            {decision && (
              <div className="glass-dark p-6 rounded-lg border border-green-400/30 text-center">
                <div className="mb-4">
                  <img src={decision.image} alt={decision.answer} className="w-32 h-32 mx-auto rounded-lg" />
                </div>
                <h3 className="text-3xl font-bold text-emerald-400 uppercase">{decision.answer}</h3>
                {userQuestion && (
                  <p className="text-gray-300 mt-2">"{userQuestion}"</p>
                )}
              </div>
            )}
          </div>
        )

      case 'activity':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={getActivity}
                disabled={activityLoading}
                className="cyber-button px-6 py-3 text-lg"
              >
                {activityLoading ? "Finding activities..." : "Suggest Activity"}
              </button>
            </div>

            {activity && (
              <div className="glass-dark p-6 rounded-lg border border-yellow-400/30">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">{activity.activity}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-emerald-400">Type:</strong> {activity.type}
                  </div>
                  <div>
                    <strong className="text-emerald-400">Participants:</strong> {activity.participants}
                  </div>
                  <div>
                    <strong className="text-emerald-400">Price:</strong> {activity.price === 0 ? 'Free' : '$'.repeat(Math.ceil(activity.price * 4))}
                  </div>
                  <div>
                    <strong className="text-emerald-400">Accessibility:</strong> {Math.round(activity.accessibility * 100)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'advice':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={getAdvice}
                disabled={adviceLoading}
                className="cyber-button px-6 py-3 text-lg"
              >
                {adviceLoading ? "Channeling wisdom..." : "Get Advice"}
              </button>
            </div>

            {advice && (
              <div className="glass-dark p-6 rounded-lg border border-cyan-400/30">
                <div className="text-center">
                  <Lightbulb className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <p className="text-xl text-white italic">"{advice}"</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'memory':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <span className="text-emerald-400 text-lg">Moves: {memoryMoves}</span>
                <span className="text-purple-400 text-lg ml-6">
                  Matched: {matchedCards.length / 2} / {memoryCards.length / 2}
                </span>
              </div>
              <button
                onClick={initializeMemoryGame}
                className="cyber-button px-6 py-3 text-lg"
              >
                New Game
              </button>
            </div>

            {memoryCards.length > 0 && (
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {memoryCards.map((card) => (
                  <motion.button
                    key={card.id}
                    onClick={() => handleMemoryCardClick(card.id)}
                    className={`aspect-square rounded-lg text-3xl font-bold transition-all ${
                      flippedCards.includes(card.id) || matchedCards.includes(card.id)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-transparent'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.symbol : '?'}
                  </motion.button>
                ))}
              </div>
            )}

            {matchedCards.length === memoryCards.length && memoryCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-emerald-400">Congratulations!</h3>
                <p className="text-white">You completed the game in {memoryMoves} moves!</p>
              </motion.div>
            )}
          </div>
        )

      case 'dice':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={rollDice}
                className="cyber-button px-6 py-3 text-lg"
              >
                Roll Dice
              </button>
            </div>

            <div className="glass-dark p-6 rounded-lg border border-indigo-400/30">
              <div className="flex justify-center items-center space-x-8 mb-6">
                <DiceIcon value={diceRolls[0]} />
                <span className="text-2xl text-white">+</span>
                <DiceIcon value={diceRolls[1]} />
                <span className="text-2xl text-white">=</span>
                <span className="text-4xl font-bold text-emerald-400">{diceTotal}</span>
              </div>

              {diceHistory.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Recent Rolls:</h4>
                  <div className="grid grid-cols-5 gap-2 text-sm">
                    {diceHistory.slice(-10).map((roll, index) => (
                      <div key={index} className="bg-gray-800 p-2 rounded text-center">
                        <div className="text-emerald-400">{roll.rolls.join(' + ')}</div>
                        <div className="text-white font-bold">{roll.total}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 'rps':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <span className="text-emerald-400 text-lg">You: {rpsScore.player}</span>
                <span className="text-red-400 text-lg ml-6">Computer: {rpsScore.computer}</span>
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                {['rock', 'paper', 'scissors'].map((choice) => (
                  <button
                    key={choice}
                    onClick={() => playRPS(choice)}
                    className="cyber-button px-6 py-4 text-4xl"
                  >
                    {choice === 'rock' ? '🪨' : choice === 'paper' ? '📄' : '✂️'}
                  </button>
                ))}
              </div>
            </div>

            {playerChoice && computerChoice && (
              <div className="glass-dark p-6 rounded-lg border border-emerald-400/30">
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <h4 className="text-emerald-400 font-bold">You</h4>
                    <div className="text-6xl">
                      {playerChoice === 'rock' ? '🪨' : playerChoice === 'paper' ? '📄' : '✂️'}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl">VS</span>
                  </div>
                  <div>
                    <h4 className="text-red-400 font-bold">Computer</h4>
                    <div className="text-6xl">
                      {computerChoice === 'rock' ? '🪨' : computerChoice === 'paper' ? '📄' : '✂️'}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white">{rpsResult}</h3>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  useEffect(() => {
    // Initialize some games on load
    initializeMemoryGame()
    rollDice()
  }, [])

  return (
    <div className="min-h-screen pt-20 px-4 relative overflow-hidden bg-slate-900">
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-emerald-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
      </motion.div>

      {/* Floating Particles */}
      <div className="fixed inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono"
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            GAME_NEXUS
          </motion.h1>
          <motion.p 
            className="text-xl text-cyan-300 font-mono max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {">"} Interactive playground where boredom comes to die
          </motion.p>
          
          {/* Stats Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center space-x-8 mt-8"
          >
            <div className="glass-dark px-6 py-3 rounded-lg border border-emerald-400/30">
              <div className="text-emerald-400 text-sm font-mono">GAMES PLAYED</div>
              <div className="text-2xl font-bold text-white">{gameStats.gamesPlayed}</div>
            </div>
            <div className="glass-dark px-6 py-3 rounded-lg border border-purple-400/30">
              <div className="text-purple-400 text-sm font-mono">TOTAL SCORE</div>
              <div className="text-2xl font-bold text-white">{gameStats.totalScore}</div>
            </div>
            <div className="glass-dark px-6 py-3 rounded-lg border border-cyan-400/30">
              <div className="text-cyan-400 text-sm font-mono">ACHIEVEMENTS</div>
              <div className="text-2xl font-bold text-white">{gameStats.achievements.length}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Game Selection Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-mono">
            SELECT_GAME
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02, rotateY: 5 }}
                className="group cursor-pointer"
                onClick={() => setActiveGame(activeGame === game.id ? null : game.id)}
              >
                <div className={`glass-dark p-8 rounded-lg border transition-all duration-500 ${
                  activeGame === game.id 
                    ? 'border-emerald-400/60 bg-emerald-400/5' 
                    : 'border-emerald-400/20 hover:border-emerald-400/40'
                }`}>
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 text-xs font-mono rounded-full border bg-green-500/20 text-green-400 border-green-400/50">
                      {game.status}
                    </span>
                    <span className="px-3 py-1 text-xs font-mono bg-blue-500/20 text-blue-400 border border-blue-400/50 rounded-full">
                      {game.difficulty}
                    </span>
                  </div>

                  {/* Game Icon */}
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${game.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <game.icon className="w-full h-full text-white" />
                  </div>

                  {/* Game Info */}
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                    {game.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">{game.description}</p>

                  {/* Play Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-lg font-mono text-center transition-all duration-300 flex items-center justify-center space-x-2 ${
                      activeGame === game.id
                        ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 border border-emerald-400/50 text-white'
                        : 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 text-emerald-300 hover:border-emerald-400/50 hover:text-white'
                    }`}
                  >
                    {activeGame === game.id ? <Home className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>{activeGame === game.id ? 'CLOSE GAME' : 'LAUNCH GAME'}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Game Display */}
        {activeGame && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <div className="glass-dark p-8 rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-400/5 to-cyan-400/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                  {games.find(g => g.id === activeGame)?.title}
                </h2>
                <button
                  onClick={() => setActiveGame(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {renderGameContent()}
            </div>
          </motion.div>
        )}

        {/* Game Instructions Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
            HOW_TO_PLAY
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                game: "Brain Quiz Master",
                instructions: "Answer trivia questions correctly to earn points. Each correct answer gives you 10 points!",
                tips: "Read questions carefully and trust your first instinct.",
                icon: Brain
              },
              {
                game: "Card Draw Challenge", 
                instructions: "Draw cards from a shuffled deck. Build your hand and see what fate deals you!",
                tips: "Start a new deck anytime for a fresh shuffle.",
                icon: Diamond
              },
              {
                game: "Memory Matrix",
                instructions: "Flip cards to find matching pairs. Complete all matches in minimum moves!",
                tips: "Use spatial memory and try to remember card positions.",
                icon: Cpu
              },
              {
                game: "Decision Oracle",
                instructions: "Ask any yes/no question and receive a cosmic answer with a magical GIF!",
                tips: "Be specific with your questions for the best guidance.",
                icon: Eye
              },
              {
                game: "Rock Paper Scissors",
                instructions: "Classic game against the computer. First to win the most rounds takes victory!",
                tips: "Try to spot patterns in the computer's choices.",
                icon: Zap
              },
              {
                game: "Dice Fortune",
                instructions: "Roll two dice and track your luck. See patterns in your rolls over time!",
                tips: "Lucky streaks and patterns might emerge - keep rolling!",
                icon: Dice1
              }
            ].map((guide, index) => (
              <motion.div
                key={guide.game}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-dark p-6 rounded-lg border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <guide.icon className="w-8 h-8 text-purple-400 mr-3" />
                  <h3 className="text-lg font-bold text-purple-400 font-mono">{guide.game}</h3>
                </div>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{guide.instructions}</p>
                <div className="border-t border-purple-400/20 pt-3">
                  <p className="text-xs text-purple-300 italic">💡 Tip: {guide.tips}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievement System */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-mono">
            ACHIEVEMENTS
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "First Steps", desc: "Play your first game", icon: "🎮", unlocked: gameStats.gamesPlayed > 0 },
              { title: "Quiz Master", desc: "Score 50+ in trivia", icon: "🧠", unlocked: triviaScore >= 50 },
              { title: "Lucky Seven", desc: "Roll doubles 3 times", icon: "🎲", unlocked: false },
              { title: "Memory Champion", desc: "Complete memory game in <15 moves", icon: "🏆", unlocked: false },
              { title: "Decision Maker", desc: "Ask 10 questions to oracle", icon: "🔮", unlocked: false },
              { title: "Card Collector", desc: "Draw 20+ cards", icon: "🃏", unlocked: playerHand.length >= 20 },
              { title: "Wisdom Seeker", desc: "Get 5 pieces of advice", icon: "💡", unlocked: false },
              { title: "Activity Explorer", desc: "Get 10 activity suggestions", icon: "🎯", unlocked: false }
            ].map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`glass-dark p-6 rounded-lg border transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'border-yellow-400/50 bg-yellow-400/10' 
                    : 'border-gray-600/30 bg-gray-800/20'
                }`}
              >
                <div className="text-center">
                  <div className={`text-4xl mb-3 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <h3 className={`font-bold mb-2 font-mono ${
                    achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`}>
                    {achievement.desc}
                  </p>
                  {achievement.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <Award className="w-6 h-6 text-yellow-400 mx-auto" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fun Facts Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
            GAME_STATS
          </h2>

          <div className="glass-dark p-8 rounded-lg border border-cyan-400/30">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">{games.length}</div>
                <div className="text-gray-300 font-mono">Total Games</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">∞</div>
                <div className="text-gray-300 font-mono">Possibilities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">0%</div>
                <div className="text-gray-300 font-mono">Boredom Level</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-gray-300 font-mono">Fun Guaranteed</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="glass-dark p-8 rounded-lg border border-emerald-400/30">
            <Gamepad2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 font-mono">
              GAME_NEXUS_v2.0
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Built with passion using cutting-edge APIs and modern web technologies. 
              Every game is designed to challenge, entertain, and keep you coming back for more.
              The future of browser gaming starts here.
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <div className="text-emerald-400 font-mono text-sm">React</div>
              <div className="text-cyan-400 font-mono text-sm">Framer Motion</div>
              <div className="text-purple-400 font-mono text-sm">Tailwind CSS</div>
              <div className="text-yellow-400 font-mono text-sm">REST APIs</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .glass-dark {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        
        .cyber-button {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2));
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: rgb(110, 231, 183);
          font-family: 'Courier New', monospace;
          transition: all 0.3s ease;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
        }
        
        .cyber-button:hover {
          border-color: rgba(16, 185, 129, 0.5);
          color: white;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }
        
        .cyber-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .cyber-input {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: white;
          font-family: 'Courier New', monospace;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          outline: none;
          backdrop-filter: blur(16px);
        }
        
        .cyber-input:focus {
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  )
}