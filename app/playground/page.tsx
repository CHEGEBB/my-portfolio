"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import {
  Gamepad2,
  Brain,
  Play,
  Trophy,
  Zap,
  RefreshCw,
  Crown,
  Cpu,
  Code,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Timer,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
} from "lucide-react"
import Image from "next/image"

// Optimized Matrix Rain Effect Component
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Optimize canvas size
    const updateCanvasSize = () => {
      canvas.width = Math.min(window.innerWidth, 1920)
      canvas.height = Math.min(window.innerHeight, 1080)
    }

    updateCanvasSize()

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*".split("")
    const font_size = 12
    const columns = Math.floor(canvas.width / font_size)
    const drops: number[] = Array(columns).fill(1)

    let animationId: number

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0F0"
      ctx.font = font_size + "px monospace"

      // Reduce iterations for better performance
      for (let i = 0; i < Math.min(drops.length, 50); i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)]
        ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.4 + 0.1})`
        ctx.fillText(text, i * font_size, drops[i] * font_size)

        if (drops[i] * font_size > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationId = requestAnimationFrame(draw)
    }

    // Start with a delay to improve initial load
    const startDelay = setTimeout(() => {
      animationId = requestAnimationFrame(draw)
    }, 1000)

    const handleResize = () => {
      updateCanvasSize()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearTimeout(startDelay)
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-15 pointer-events-none"
      style={{ background: "transparent" }}
    />
  )
}

// Optimized Floating Particles Component
const FloatingParticles = ({ count = 4 }: { count?: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 4 + Math.random() * 2,
      })),
    [count],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-emerald-400/60 rounded-full will-change-transform"
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
            y: [0, -15, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Optimized Chess Game Component with better contrast
const ChessGame = () => {
  const [dailyPuzzle, setDailyPuzzle] = useState<any>(null)
  const [puzzleLoading, setPuzzleLoading] = useState(false)
  const [chessBoard, setChessBoard] = useState<string[][]>([])
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [gameStatus, setGameStatus] = useState<string>("ready")
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")

  const initialBoard = useMemo(
    () => [
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ],
    [],
  )

  const fetchDailyPuzzle = useCallback(async () => {
    setPuzzleLoading(true)
    try {
      const response = await fetch("https://lichess.org/api/puzzle/daily")
      const data = await response.json()
      setDailyPuzzle(data)

      if (data.game?.fen) {
        const board = fenToBoard(data.game.fen)
        setChessBoard(board)
      } else {
        setChessBoard(initialBoard)
      }
      setGameStatus("playing")
    } catch (error) {
      console.error("Error fetching chess puzzle:", error)
      setChessBoard(initialBoard)
      setGameStatus("offline")
    }
    setPuzzleLoading(false)
  }, [initialBoard])

  const fenToBoard = useCallback((fen: string): string[][] => {
    const board: string[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(""))
    const rows = fen.split(" ")[0].split("/")

    rows.forEach((row, rowIndex) => {
      let colIndex = 0
      for (const char of row) {
        if (isNaN(Number.parseInt(char))) {
          board[rowIndex][colIndex] = char
          colIndex++
        } else {
          colIndex += Number.parseInt(char)
        }
      }
    })

    return board
  }, [])

  const getPieceSymbol = useCallback((piece: string) => {
    const pieces: { [key: string]: string } = {
      K: "♔",
      Q: "♕",
      R: "♖",
      B: "♗",
      N: "♘",
      P: "♙",
      k: "♚",
      q: "♛",
      r: "♜",
      b: "♝",
      n: "♞",
      p: "♟",
    }
    return pieces[piece] || ""
  }, [])

  const isValidMove = useCallback(
    (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
      const piece = chessBoard[fromRow][fromCol]
      if (!piece) return false

      const isWhite = piece === piece.toUpperCase()
      const targetPiece = chessBoard[toRow][toCol]

      if (targetPiece && (targetPiece === targetPiece.toUpperCase()) === isWhite) return false

      const rowDiff = Math.abs(toRow - fromRow)
      const colDiff = Math.abs(toCol - fromCol)

      switch (piece.toLowerCase()) {
        case "p":
          const direction = isWhite ? -1 : 1
          const startRow = isWhite ? 6 : 1

          if (colDiff === 0) {
            if (targetPiece) return false
            if (toRow === fromRow + direction) return true
            if (fromRow === startRow && toRow === fromRow + 2 * direction && !chessBoard[toRow][toCol]) return true
          } else if (colDiff === 1 && toRow === fromRow + direction) {
            return !!targetPiece
          }
          return false

        case "r":
          return (rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol)

        case "n":
          return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)

        case "b":
          return rowDiff === colDiff && isPathClear(fromRow, fromCol, toRow, toCol)

        case "q":
          return (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol)

        case "k":
          return rowDiff <= 1 && colDiff <= 1

        default:
          return false
      }
    },
    [chessBoard],
  )

  const isPathClear = useCallback(
    (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
      const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0
      const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0

      let currentRow = fromRow + rowStep
      let currentCol = fromCol + colStep

      while (currentRow !== toRow || currentCol !== toCol) {
        if (chessBoard[currentRow][currentCol]) return false
        currentRow += rowStep
        currentCol += colStep
      }
      return true
    },
    [chessBoard],
  )

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (selectedSquare) {
        const [fromRow, fromCol] = selectedSquare

        if (fromRow === row && fromCol === col) {
          setSelectedSquare(null)
          return
        }

        if (isValidMove(fromRow, fromCol, row, col)) {
          const newBoard = chessBoard.map((r) => [...r])
          const piece = newBoard[fromRow][fromCol]
          newBoard[row][col] = piece
          newBoard[fromRow][fromCol] = ""

          setChessBoard(newBoard)
          setMoveHistory((prev) => [
            ...prev,
            `${piece} ${String.fromCharCode(97 + fromCol)}${8 - fromRow} → ${String.fromCharCode(97 + col)}${8 - row}`,
          ])
          setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
        }

        setSelectedSquare(null)
      } else if (chessBoard[row][col]) {
        const piece = chessBoard[row][col]
        const isWhite = piece === piece.toUpperCase()

        if ((currentPlayer === "white" && isWhite) || (currentPlayer === "black" && !isWhite)) {
          setSelectedSquare([row, col])
        }
      }
    },
    [selectedSquare, isValidMove, chessBoard, currentPlayer],
  )

  const resetGame = useCallback(() => {
    setChessBoard(initialBoard)
    setSelectedSquare(null)
    setMoveHistory([])
    setCurrentPlayer("white")
    setGameStatus("playing")
  }, [initialBoard])

  useEffect(() => {
    fetchDailyPuzzle()
  }, [fetchDailyPuzzle])

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4 mb-6">
        <motion.button
          onClick={fetchDailyPuzzle}
          disabled={puzzleLoading}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-mono text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className={`w-5 h-5 inline mr-2 ${puzzleLoading ? "animate-spin" : ""}`} />
          {puzzleLoading ? "Loading..." : "Daily Puzzle"}
        </motion.button>
        <motion.button
          onClick={resetGame}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-mono text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Crown className="w-5 h-5 inline mr-2" />
          New Game
        </motion.button>
      </div>

      <div className="glass-dark p-6 rounded-lg border border-emerald-400/30">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="mb-4 text-center">
              <h3 className="text-xl font-bold text-emerald-400 font-mono mb-2">
                {dailyPuzzle ? `Daily Puzzle #${dailyPuzzle.puzzle?.id}` : "Chess Game"}
              </h3>
              <div className="text-sm text-gray-300 font-mono">
                Current Player:{" "}
                <span className={currentPlayer === "white" ? "text-white" : "text-gray-400"}>
                  {currentPlayer.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Optimized Chess Board with better contrast */}
            <div className="grid grid-cols-8 gap-0 border-4 border-emerald-400/50 rounded-lg overflow-hidden shadow-2xl bg-slate-800">
              {chessBoard.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isLightSquare = (rowIndex + colIndex) % 2 === 0
                  const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex

                  return (
                    <motion.div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      className={`w-14 h-14 flex items-center justify-center text-3xl cursor-pointer transition-all duration-200 relative ${
                        isLightSquare ? "bg-stone-200" : "bg-stone-700"
                      } ${isSelected ? "ring-4 ring-emerald-400 ring-inset z-10" : ""}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span
                        className={`select-none ${
                          piece && piece === piece.toUpperCase()
                            ? "text-slate-900 drop-shadow-sm" // White pieces - dark color for contrast
                            : "text-slate-100 drop-shadow-sm" // Black pieces - light color for contrast
                        }`}
                        style={{
                          textShadow: piece
                            ? piece === piece.toUpperCase()
                              ? "1px 1px 2px rgba(0,0,0,0.8)" // White pieces get dark shadow
                              : "1px 1px 2px rgba(255,255,255,0.8)" // Black pieces get light shadow
                            : "none",
                        }}
                      >
                        {getPieceSymbol(piece)}
                      </span>
                    </motion.div>
                  )
                }),
              )}
            </div>
          </div>

          <div className="space-y-4">
            {dailyPuzzle && (
              <div className="glass-emerald p-4 rounded-lg border border-emerald-400/30">
                <h4 className="text-lg font-bold text-emerald-400 mb-2 font-mono">Puzzle Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rating:</span>
                    <span className="text-emerald-400 font-mono">{dailyPuzzle.puzzle?.rating || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Themes:</span>
                    <span className="text-emerald-400 font-mono text-xs">
                      {dailyPuzzle.puzzle?.themes?.slice(0, 2).join(", ") || "Mixed"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="glass-dark p-4 rounded-lg border border-cyan-400/30">
              <h4 className="text-lg font-bold text-cyan-400 mb-2 font-mono">Move History</h4>
              <div className="max-h-32 overflow-y-auto text-xs text-gray-300 space-y-1">
                {moveHistory.length > 0 ? (
                  moveHistory.slice(-5).map((move, index) => (
                    <div key={index} className="font-mono">
                      {moveHistory.length - 4 + index}. {move}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">No moves yet</div>
                )}
              </div>
            </div>

            <div className="glass-dark p-4 rounded-lg border border-purple-400/30">
              <h4 className="text-lg font-bold text-purple-400 mb-2 font-mono">How to Play</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Click piece to select</li>
                <li>• Click destination to move</li>
                <li>• White moves first</li>
                <li>• Capture opponent pieces</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Optimized Memory Game Component
const MemoryGame = () => {
  const [cards, setCards] = useState<Array<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")

  const symbols = useMemo(
    () => ({
      easy: ["🎮", "🎯", "🎲", "🎭"],
      medium: ["🎮", "🎯", "🎲", "🎭", "🎨", "🎪", "🎸", "🎤"],
      hard: ["🎮", "🎯", "🎲", "🎭", "🎨", "🎪", "🎸", "🎤", "🎺", "🎻", "🎹", "🎧"],
    }),
    [],
  )

  const initializeGame = useCallback(() => {
    const gameSymbols = symbols[difficulty]
    const gameCards = [...gameSymbols, ...gameSymbols]
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5)

    setCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setGameWon(false)
  }, [difficulty, symbols])

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (flippedCards.length === 2) return
      if (flippedCards.includes(cardId)) return
      if (cards.find((c) => c.id === cardId)?.isMatched) return

      const newFlipped = [...flippedCards, cardId]
      setFlippedCards(newFlipped)

      if (newFlipped.length === 2) {
        setMoves((prev) => prev + 1)
        const [first, second] = newFlipped
        const firstCard = cards.find((c) => c.id === first)
        const secondCard = cards.find((c) => c.id === second)

        if (firstCard?.symbol === secondCard?.symbol) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) => (card.id === first || card.id === second ? { ...card, isMatched: true } : card)),
            )
            setFlippedCards([])

            const updatedCards = cards.map((card) =>
              card.id === first || card.id === second ? { ...card, isMatched: true } : card,
            )
            if (updatedCards.every((card) => card.isMatched)) {
              setGameWon(true)
            }
          }, 800)
        } else {
          setTimeout(() => {
            setFlippedCards([])
          }, 800)
        }
      }
    },
    [flippedCards, cards],
  )

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const gridCols = difficulty === "easy" ? "grid-cols-4" : difficulty === "medium" ? "grid-cols-4" : "grid-cols-6"

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center space-x-4 mb-6">
          {(["easy", "medium", "hard"] as const).map((level) => (
            <motion.button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-4 py-2 rounded-lg font-mono transition-all duration-300 ${
                difficulty === level
                  ? "bg-emerald-500/30 border border-emerald-400/50 text-emerald-300"
                  : "bg-gray-700/30 border border-gray-600/50 text-gray-300 hover:text-emerald-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {level.toUpperCase()}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-6 mb-6">
          <div className="glass-dark px-4 py-2 rounded-lg border border-emerald-400/30">
            <div className="text-emerald-400 text-sm font-mono">MOVES</div>
            <div className="text-2xl font-bold text-white">{moves}</div>
          </div>
          <div className="glass-dark px-4 py-2 rounded-lg border border-purple-400/30">
            <div className="text-purple-400 text-sm font-mono">MATCHED</div>
            <div className="text-2xl font-bold text-white">
              {cards.filter((c) => c.isMatched).length / 2} / {cards.length / 2}
            </div>
          </div>
        </div>

        <motion.button
          onClick={initializeGame}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-mono text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className="w-5 h-5 inline mr-2" />
          New Game
        </motion.button>
      </div>

      {cards.length > 0 && (
        <div className={`grid ${gridCols} gap-4 max-w-2xl mx-auto`}>
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-lg text-3xl font-bold transition-all duration-300 ${
                flippedCards.includes(card.id) || card.isMatched
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-gray-700 hover:bg-gray-600 text-transparent"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={flippedCards.length === 2 && !flippedCards.includes(card.id)}
            >
              {flippedCards.includes(card.id) || card.isMatched ? card.symbol : "?"}
            </motion.button>
          ))}
        </div>
      )}

      {gameWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-dark p-8 rounded-lg border border-yellow-400/50"
        >
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-yellow-400 mb-2 font-mono">VICTORY!</h3>
          <p className="text-white text-lg mb-4">Completed in {moves} moves!</p>
          <motion.button
            onClick={initializeGame}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-mono text-white hover:from-yellow-700 hover:to-orange-700 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Play Again
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

// Optimized Reaction Time Game
const ReactionGame = () => {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "go" | "clicked" | "too-early">("waiting")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  const startGame = useCallback(() => {
    setGameState("ready")
    const delay = Math.random() * 4000 + 1000

    setTimeout(() => {
      setGameState("go")
      setStartTime(Date.now())
    }, delay)
  }, [])

  const handleClick = useCallback(() => {
    if (gameState === "ready") {
      setGameState("too-early")
      setTimeout(() => setGameState("waiting"), 2000)
      return
    }

    if (gameState === "go" && startTime) {
      const time = Date.now() - startTime
      setReactionTime(time)
      setGameState("clicked")
      setAttempts((prev) => prev + 1)

      setBestTime((prev) => (!prev || time < prev ? time : prev))
    }
  }, [gameState, startTime])

  const reset = useCallback(() => {
    setGameState("waiting")
    setReactionTime(null)
    setStartTime(null)
  }, [])

  const getBackgroundColor = () => {
    switch (gameState) {
      case "ready":
        return "bg-red-500"
      case "go":
        return "bg-green-500"
      case "too-early":
        return "bg-yellow-500"
      default:
        return "bg-gray-700"
    }
  }

  const getMessage = () => {
    switch (gameState) {
      case "waiting":
        return 'Click "Start" to begin'
      case "ready":
        return "Wait for GREEN..."
      case "go":
        return "CLICK NOW!"
      case "clicked":
        return `${reactionTime}ms`
      case "too-early":
        return "Too early! Wait for green."
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center space-x-6 mb-6">
          <div className="glass-dark px-4 py-2 rounded-lg border border-emerald-400/30">
            <div className="text-emerald-400 text-sm font-mono">ATTEMPTS</div>
            <div className="text-2xl font-bold text-white">{attempts}</div>
          </div>
          <div className="glass-dark px-4 py-2 rounded-lg border border-yellow-400/30">
            <div className="text-yellow-400 text-sm font-mono">BEST TIME</div>
            <div className="text-2xl font-bold text-white">{bestTime ? `${bestTime}ms` : "-"}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <motion.div
          onClick={handleClick}
          className={`w-80 h-80 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${getBackgroundColor()}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-center text-white">
            <div className="text-2xl font-bold mb-2">{getMessage()}</div>
            {gameState === "clicked" && reactionTime && (
              <div className="text-sm">
                {reactionTime < 200
                  ? "Lightning fast!"
                  : reactionTime < 300
                    ? "Excellent!"
                    : reactionTime < 400
                      ? "Good!"
                      : "Keep practicing!"}
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex space-x-4">
          {gameState === "waiting" && (
            <motion.button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-mono text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-5 h-5 inline mr-2" />
              Start Test
            </motion.button>
          )}

          {(gameState === "clicked" || gameState === "too-early") && (
            <motion.button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-mono text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Try Again
            </motion.button>
          )}
        </div>
      </div>

      <div className="glass-dark p-4 rounded-lg border border-cyan-400/30">
        <h4 className="text-lg font-bold text-cyan-400 mb-2 font-mono">Instructions</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Click "Start Test" to begin</li>
          <li>• Wait for the circle to turn GREEN</li>
          <li>• Click as fast as possible when it turns green</li>
          <li>• Don't click too early or you'll have to restart</li>
        </ul>
      </div>
    </div>
  )
}

// Optimized Dice Game
const DiceGame = () => {
  const [dice, setDice] = useState([1, 1])
  const [isRolling, setIsRolling] = useState(false)
  const [history, setHistory] = useState<Array<{ dice: number[]; sum: number; timestamp: number }>>([])
  const [stats, setStats] = useState({
    totalRolls: 0,
    doubles: 0,
    highestSum: 0,
    lowestSum: 12,
  })

  const DiceIcon = ({ value }: { value: number }) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    const Icon = icons[value - 1]
    return <Icon className="w-16 h-16 text-emerald-400" />
  }

  const rollDice = useCallback(async () => {
    setIsRolling(true)

    // Optimized rolling animation
    for (let i = 0; i < 8; i++) {
      setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1])
      await new Promise((resolve) => setTimeout(resolve, 80))
    }

    const finalRoll = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
    const sum = finalRoll[0] + finalRoll[1]

    setDice(finalRoll)
    setIsRolling(false)

    const newRoll = {
      dice: finalRoll,
      sum,
      timestamp: Date.now(),
    }

    setHistory((prev) => [newRoll, ...prev.slice(0, 9)])

    setStats((prev) => ({
      totalRolls: prev.totalRolls + 1,
      doubles: prev.doubles + (finalRoll[0] === finalRoll[1] ? 1 : 0),
      highestSum: Math.max(prev.highestSum, sum),
      lowestSum: Math.min(prev.lowestSum, sum),
    }))
  }, [])

  const resetStats = useCallback(() => {
    setHistory([])
    setStats({
      totalRolls: 0,
      doubles: 0,
      highestSum: 0,
      lowestSum: 12,
    })
    setDice([1, 1])
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center space-x-8 mb-8">
          <motion.div
            animate={isRolling ? { rotate: 360 } : {}}
            transition={{ duration: 0.1, repeat: isRolling ? Number.POSITIVE_INFINITY : 0 }}
          >
            <DiceIcon value={dice[0]} />
          </motion.div>
          <div className="text-4xl text-white font-bold">+</div>
          <motion.div
            animate={isRolling ? { rotate: -360 } : {}}
            transition={{ duration: 0.1, repeat: isRolling ? Number.POSITIVE_INFINITY : 0 }}
          >
            <DiceIcon value={dice[1]} />
          </motion.div>
          <div className="text-4xl text-white font-bold">=</div>
          <div className="text-6xl font-bold text-emerald-400 font-mono">{dice[0] + dice[1]}</div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <motion.button
            onClick={rollDice}
            disabled={isRolling}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-mono text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Dice1 className="w-5 h-5 inline mr-2" />
            {isRolling ? "Rolling..." : "Roll Dice"}
          </motion.button>

          <motion.button
            onClick={resetStats}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg font-mono text-white hover:from-red-700 hover:to-pink-700 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Reset
          </motion.button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-dark p-6 rounded-lg border border-emerald-400/30">
          <h4 className="text-lg font-bold text-emerald-400 mb-4 font-mono">Statistics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalRolls}</div>
              <div className="text-gray-300">Total Rolls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.doubles}</div>
              <div className="text-gray-300">Doubles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.highestSum}</div>
              <div className="text-gray-300">Highest</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.lowestSum === 12 ? "-" : stats.lowestSum}</div>
              <div className="text-gray-300">Lowest</div>
            </div>
          </div>
        </div>

        <div className="glass-dark p-6 rounded-lg border border-purple-400/30">
          <h4 className="text-lg font-bold text-purple-400 mb-4 font-mono">Recent Rolls</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.length > 0 ? (
              history.map((roll, index) => (
                <div key={roll.timestamp} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">
                    {roll.dice[0]} + {roll.dice[1]}
                  </span>
                  <span className={`font-bold ${roll.dice[0] === roll.dice[1] ? "text-yellow-400" : "text-white"}`}>
                    = {roll.sum} {roll.dice[0] === roll.dice[1] ? "🎯" : ""}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic text-center">No rolls yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Optimized Game Hook
const useGameState = () => {
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    achievements: [],
    streak: 0,
    bestScore: 0,
  })

  const updateStats = useCallback((gameType: string, score: number, won: boolean) => {
    setGameStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + score,
      streak: won ? prev.streak + 1 : 0,
      bestScore: Math.max(prev.bestScore, score),
    }))
  }, [])

  return { gameStats, updateStats }
}

// Optimized Trivia Game Hook
const useTrivia = () => {
  const [question, setQuestion] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [streak, setStreak] = useState(0)

  const fetchQuestion = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple")
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        const q = data.results[0]
        const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
        setQuestion({ ...q, all_answers: answers })
        setSelectedAnswer(null)
        setShowResult(false)
      }
    } catch (error) {
      console.error("Error fetching trivia:", error)
    }
    setLoading(false)
  }, [])

  const answerQuestion = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer)
      setShowResult(true)
      if (answer === question.correct_answer) {
        const points = 10 + streak * 2
        setScore((prev) => prev + points)
        setStreak((prev) => prev + 1)
      } else {
        setStreak(0)
      }
    },
    [question, streak],
  )

  return { question, loading, score, selectedAnswer, showResult, streak, fetchQuestion, answerQuestion }
}

export default function PlaygroundPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const heroParallaxY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const { gameStats, updateStats } = useGameState()
  const trivia = useTrivia()

  // Optimized Games Data
  const games = useMemo(
    () => [
      {
        id: "chess",
        title: "Chess Master",
        description: "Play with the mind of a grandmaster or solve daily puzzles",
        icon: Crown,
        difficulty: "Expert",
        color: "from-yellow-500 to-orange-600",
        status: "FEATURED",
        category: "Strategy",
        players: "1-2",
        time: "5-30 min",
      },
      {
        id: "trivia",
        title: "Brain Quiz Arena",
        description: "Test your knowledge across multiple categories with streak bonuses",
        icon: Brain,
        difficulty: "Medium",
        color: "from-blue-500 to-cyan-600",
        status: "ACTIVE",
        category: "Knowledge",
        players: "1",
        time: "2-5 min",
      },
      {
        id: "memory",
        title: "Memory Matrix Pro",
        description: "Advanced memory challenges with multiple difficulty levels",
        icon: Cpu,
        difficulty: "Hard",
        color: "from-purple-500 to-pink-600",
        status: "ACTIVE",
        category: "Memory",
        players: "1",
        time: "3-10 min",
      },
      {
        id: "reaction",
        title: "Reaction Speed Test",
        description: "Test your reflexes and reaction time with precision timing",
        icon: Zap,
        difficulty: "Easy",
        color: "from-green-500 to-teal-600",
        status: "NEW",
        category: "Reflex",
        players: "1",
        time: "1-2 min",
      },
      {
        id: "dice",
        title: "Dice Fortune",
        description: "Roll dice and track your luck with detailed statistics",
        icon: Dice1,
        difficulty: "Easy",
        color: "from-indigo-500 to-purple-600",
        status: "ACTIVE",
        category: "Luck",
        players: "1",
        time: "1-3 min",
      },
      {
        id: "typing",
        title: "Code Typing Challenge",
        description: "Improve your coding speed with programming challenges",
        icon: Code,
        difficulty: "Medium",
        color: "from-emerald-500 to-green-600",
        status: "COMING SOON",
        category: "Skill",
        players: "1",
        time: "2-5 min",
      },
    ],
    [],
  )

  const renderGameContent = useCallback(() => {
    switch (activeGame) {
      case "chess":
        return <ChessGame />

      case "trivia":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center items-center space-x-6 mb-6">
                <div className="glass-dark px-4 py-2 rounded-lg border border-emerald-400/30">
                  <div className="text-emerald-400 text-sm font-mono">SCORE</div>
                  <div className="text-2xl font-bold text-white">{trivia.score}</div>
                </div>
                <div className="glass-dark px-4 py-2 rounded-lg border border-yellow-400/30">
                  <div className="text-yellow-400 text-sm font-mono">STREAK</div>
                  <div className="text-2xl font-bold text-white">{trivia.streak}</div>
                </div>
              </div>

              <motion.button
                onClick={trivia.fetchQuestion}
                disabled={trivia.loading}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-mono text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {trivia.loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 inline mr-2 animate-spin" />
                    Loading Question...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 inline mr-2" />
                    {trivia.question ? "Next Question" : "Start Quiz"}
                  </>
                )}
              </motion.button>
            </div>

            {trivia.question && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-dark p-8 rounded-lg border border-blue-400/30"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-400/50 rounded-full text-sm font-mono">
                      {trivia.question.category}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-400/50 rounded-full text-sm font-mono">
                      {trivia.question.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <h4
                    className="text-xl mb-6 text-white leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: trivia.question.question }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trivia.question.all_answers.map((answer: string, index: number) => (
                    <motion.button
                      key={index}
                      onClick={() => trivia.answerQuestion(answer)}
                      disabled={trivia.showResult}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                        trivia.showResult
                          ? answer === trivia.question.correct_answer
                            ? "border-green-400 bg-green-400/20 text-green-400"
                            : answer === trivia.selectedAnswer
                              ? "border-red-400 bg-red-400/20 text-red-400"
                              : "border-gray-600 text-gray-500"
                          : "border-blue-400/30 hover:border-blue-400 text-white hover:bg-blue-400/10"
                      }`}
                      whileHover={!trivia.showResult ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!trivia.showResult ? { scale: 0.98 } : {}}
                      dangerouslySetInnerHTML={{ __html: answer }}
                    />
                  ))}
                </div>

                {trivia.showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center"
                  >
                    <div
                      className={`text-2xl font-bold mb-4 ${
                        trivia.selectedAnswer === trivia.question.correct_answer ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {trivia.selectedAnswer === trivia.question.correct_answer ? (
                        <>
                          <Trophy className="w-8 h-8 inline mr-2" />
                          Correct! +{10 + trivia.streak * 2} points
                        </>
                      ) : (
                        <>
                          <X className="w-8 h-8 inline mr-2" />
                          Wrong! Streak reset
                        </>
                      )}
                    </div>
                    <motion.button
                      onClick={trivia.fetchQuestion}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-mono text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue Quiz
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        )

      case "memory":
        return <MemoryGame />

      case "reaction":
        return <ReactionGame />

      case "dice":
        return <DiceGame />

      default:
        return (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 font-mono">Game Coming Soon</h3>
            <p className="text-gray-300">This game is under development. Check back soon!</p>
          </div>
        )
    }
  }, [activeGame, trivia])

  return (
    <div ref={containerRef} className="min-h-screen pt-20 px-4 relative overflow-hidden bg-slate-900">
      {/* Optimized Matrix Rain Background */}
      <MatrixRain />

      {/* Optimized Hero Parallax Background */}
      <motion.div
        style={{ y: heroParallaxY }}
        className="fixed inset-0 z-0 opacity-15"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 15, ease: "linear" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1920&h=1080&fit=crop&q=80"
          alt="Gaming Controller Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
      </motion.div>

      {/* Reduced Floating Particles */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-15">
        <FloatingParticles count={12} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Optimized Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6 font-mono text-gradient-emerald gentle-glow"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, type: "spring" }}
          >
            GAME_NEXUS
          </motion.h1>
          <motion.p
            className="text-lg text-emerald-300 max-w-3xl mx-auto font-mono mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {">"} Play with the mind of a grandmaster or solve the daily puzzle! This playground uses the Lichess API to
            bring chess directly into your browser — no login, no key required!
          </motion.p>

          {/* Optimized Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: "Games Played", value: gameStats.gamesPlayed, suffix: "", color: "emerald" },
              { label: "Total Score", value: gameStats.totalScore, suffix: "", color: "cyan" },
              { label: "Best Streak", value: gameStats.streak, suffix: "", color: "purple" },
              { label: "Achievements", value: gameStats.achievements.length, suffix: "", color: "yellow" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                className="glass-dark p-4 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300"
              >
                <div className="text-emerald-400 text-2xl font-bold font-mono">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-sm text-gray-400 font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Game Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center items-center space-x-4 mt-8"
          >
            <motion.button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 glass-dark rounded-lg border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </motion.button>
            <motion.button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-3 glass-dark rounded-lg border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {fullscreen ? (
                <Minimize className="w-5 h-5 text-emerald-400" />
              ) : (
                <Maximize className="w-5 h-5 text-emerald-400" />
              )}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Featured Game Spotlight */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-emerald-400 font-mono mb-4">FEATURED_GAME</h2>
            <p className="text-gray-400 font-mono">Today's spotlight • Master the game of kings</p>
          </div>

          <motion.div
            whileHover={{ y: -8, scale: 1.01 }}
            className="glass-dark p-8 rounded-2xl border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 relative overflow-hidden"
          >
            <FloatingParticles count={8} />

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Crown className="w-8 h-8 text-yellow-400" />
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-400/50 rounded-full text-sm font-mono font-bold">
                    FEATURED
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-yellow-400 mb-4 font-mono">Chess Master</h3>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Play with the mind of a grandmaster or solve the daily puzzle! This playground uses the Lichess API to
                  bring chess directly into your browser — no login, no key required!
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="text-center">
                    <div className="text-emerald-400 font-mono">Difficulty</div>
                    <div className="text-white font-bold">Expert</div>
                  </div>
                  <div className="text-center">
                    <div className="text-emerald-400 font-mono">Players</div>
                    <div className="text-white font-bold">1-2</div>
                  </div>
                  <div className="text-center">
                    <div className="text-emerald-400 font-mono">Time</div>
                    <div className="text-white font-bold">5-30 min</div>
                  </div>
                </div>

                <motion.button
                  onClick={() => setActiveGame("chess")}
                  className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-mono text-white hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-6 h-6" />
                  <span className="text-lg font-bold">PLAY CHESS NOW</span>
                </motion.button>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-gradient-to-br from-stone-200 to-stone-700 rounded-lg grid grid-cols-8 gap-0 border-4 border-yellow-400/50 shadow-2xl">
                    {Array.from({ length: 64 }, (_, i) => {
                      const row = Math.floor(i / 8)
                      const col = i % 8
                      const isLight = (row + col) % 2 === 0
                      return (
                        <div
                          key={i}
                          className={`w-8 h-8 flex items-center justify-center text-lg ${
                            isLight ? "bg-stone-200" : "bg-stone-700"
                          }`}
                        >
                          {/* Sample chess pieces with proper contrast */}
                          {i === 0 && <span className="text-slate-100 drop-shadow-sm">♜</span>}
                          {i === 7 && <span className="text-slate-100 drop-shadow-sm">♜</span>}
                          {i === 56 && <span className="text-slate-900 drop-shadow-sm">♖</span>}
                          {i === 63 && <span className="text-slate-900 drop-shadow-sm">♖</span>}
                          {i === 28 && <span className="text-slate-100 drop-shadow-sm">♛</span>}
                          {i === 35 && <span className="text-slate-900 drop-shadow-sm">♕</span>}
                        </div>
                      )
                    })}
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    <Crown className="w-5 h-5 text-slate-900" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Games Grid */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-emerald-400 font-mono mb-4">GAME_SELECTION</h2>
            <p className="text-gray-400 font-mono">Choose your challenge • Master your skills</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => setActiveGame(activeGame === game.id ? null : game.id)}
              >
                <div
                  className={`glass-dark p-6 rounded-lg border transition-all duration-500 relative overflow-hidden ${
                    activeGame === game.id
                      ? "border-emerald-400/60 bg-emerald-400/5"
                      : "border-emerald-400/20 hover:border-emerald-400/40"
                  }`}
                >
                  <FloatingParticles count={4} />

                  <div className="relative z-10">
                    {/* Status Badges */}
                    <div className="flex justify-between items-start mb-6">
                      <span
                        className={`px-3 py-1 text-xs font-mono rounded-full border ${
                          game.status === "FEATURED"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/50"
                            : game.status === "NEW"
                              ? "bg-green-500/20 text-green-400 border-green-400/50"
                              : game.status === "COMING SOON"
                                ? "bg-gray-500/20 text-gray-400 border-gray-400/50"
                                : "bg-emerald-500/20 text-emerald-400 border-emerald-400/50"
                        }`}
                      >
                        {game.status}
                      </span>
                      <span className="px-3 py-1 text-xs font-mono bg-blue-500/20 text-blue-400 border border-blue-400/50 rounded-full">
                        {game.difficulty}
                      </span>
                    </div>

                    {/* Game Icon */}
                    <div
                      className={`w-16 h-16 rounded-lg bg-gradient-to-br ${game.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <game.icon className="w-full h-full text-white" />
                    </div>

                    {/* Game Info */}
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                      {game.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">{game.description}</p>

                    {/* Game Details */}
                    <div className="grid grid-cols-3 gap-2 mb-6 text-xs">
                      <div className="text-center">
                        <div className="text-emerald-400 font-mono">Category</div>
                        <div className="text-white">{game.category}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-emerald-400 font-mono">Players</div>
                        <div className="text-white">{game.players}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-emerald-400 font-mono">Time</div>
                        <div className="text-white">{game.time}</div>
                      </div>
                    </div>

                    {/* Play Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 rounded-lg font-mono text-center transition-all duration-300 flex items-center justify-center space-x-2 ${
                        game.status === "COMING SOON"
                          ? "bg-gray-500/20 border border-gray-400/30 text-gray-400 cursor-not-allowed"
                          : activeGame === game.id
                            ? "bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 border border-emerald-400/50 text-white"
                            : "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 text-emerald-300 hover:border-emerald-400/50 hover:text-white"
                      }`}
                    >
                      {game.status === "COMING SOON" ? (
                        <>
                          <Timer className="w-5 h-5" />
                          <span>SOON</span>
                        </>
                      ) : activeGame === game.id ? (
                        <>
                          <X className="w-5 h-5" />
                          <span>CLOSE</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          <span>LAUNCH</span>
                        </>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Active Game Display */}
        <AnimatePresence>
          {activeGame && (
            <motion.section
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="mb-24"
            >
              <div className="glass-dark p-8 rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-400/5 to-cyan-400/5 relative overflow-hidden">
                <FloatingParticles count={8} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                      {games.find((g) => g.id === activeGame)?.title}
                    </h2>
                    <motion.button
                      onClick={() => setActiveGame(null)}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  {renderGameContent()}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Success Message Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="glass-dark p-12 rounded-2xl border border-emerald-400/20 relative overflow-hidden text-center">
            <FloatingParticles count={10} />

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-4xl font-black text-emerald-400 mb-6 font-mono">MISSION_ACCOMPLISHED</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Welcome to the ultimate gaming nexus where every click counts, every move matters, and every victory is
                celebrated in style. Your journey to gaming mastery starts here.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => setActiveGame("chess")}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-mono text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Crown className="w-5 h-5" />
                  <span>PLAY_CHESS</span>
                </motion.button>
                <motion.button
                  onClick={() => setActiveGame("trivia")}
                  className="px-8 py-4 glass-dark border border-emerald-400/30 rounded-lg font-mono text-emerald-300 hover:border-emerald-400/60 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Brain className="w-5 h-5" />
                  <span>TEST_KNOWLEDGE</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .glass-dark {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        
        .glass-emerald {
          background: rgba(16, 185, 129, 0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        
        .text-gradient-emerald {
          background: linear-gradient(135deg, #10b981, #059669, #047857);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gentle-glow {
          text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }

        /* Performance optimizations */
        * {
          box-sizing: border-box;
        }

        .will-change-transform {
          will-change: transform;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Optimize animations */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
