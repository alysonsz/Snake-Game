/*Membros da Equipe A (Turma 01): 
ALYSON SOUZA CARREGOSA
JOSE ADELSON LIMA SANTOS JUNIOR
MARCOS BARBOSA MIRANDA
PAULO HENRIQUE DOS SANTOS REIS */

const base = require('./base')

Object.getOwnPropertyNames(base).map(p => global[p] = base[p])

const NORTH = { x: 0, y:-1 }
const SOUTH = { x: 0, y: 1 }
const EAST  = { x: 1, y: 0 }
const WEST  = { x:-1, y: 0 }

const pointEq = p1 => p2 => p1.x == p2.x && p1.y == p2.y

const willEat   = (state) => pointEq(nextHead(state))(state.apple)

const willPoisonEat = (state) => pointEq(nextHead(state))(state.poisonapple) 

const willCrash = state => state.snake.find(pointEq(nextHead(state))) 

const validMove = move => state =>
  state.moves[0].x + move.x != 0 || state.moves[0].y + move.y != 0 

const nextMoves = state => state.moves.length > 1 ? dropFirst(state.moves) : state.moves

const nextApple = state => willEat(state) ? rndPos(state) : state.apple

const nextPoisonApple = state => willEat(state) ? rndPos(state) : state.poisonapple

const nextHead  = state => state.snake.length == 0
  ? { x: 2, y: 2 }
  : {
    x: mod(state.cols)(state.snake[0].x + state.moves[0].x),
    y: mod(state.rows)(state.snake[0].y + state.moves[0].y)
  }

const nextSnake = state => {
  if (willCrash(state))
   return []
  else if (willEat(state))
   return [nextHead(state)].concat(state.snake)
  else if (willPoisonEat(state))
   return []
  else
   return [nextHead(state)].concat(dropLast(state.snake))
}

const rndPos = table => ({
  x: rnd(0)(table.cols - 1),
  y: rnd(0)(table.rows - 1)
})

const score = state => willEat(state) ? state['pont'] = state['pont'] + 1 : willPoisonEat(state) ? state['pont'] = 0 : state['pont']

const resetScore = state => willCrash(state) ? state['pont'] = 0 : state['pont']

const increase = state => willEat(state) ? state['velo'] = state['velo'] + 0.5 : state['velo']

const initialState = () => ({
  cols:  20,
  rows:  14,
  pont: 0,
  velo: 0,
  moves: [EAST],
  snake: [],
  apple: { x: 16, y: 2 },
  poisonapple: { x: 14, y: 5 },
})

const next = spec({
  rows:  prop('rows'),
  cols:  prop('cols'),
  pont:  prop('pont'),
  velo:  prop('velo'),
  moves: nextMoves,
  snake: nextSnake,
  apple: nextApple,
  score: score,
  resetScore: resetScore,
  increase: increase,
  poisonapple: nextPoisonApple,
})

const enqueue = (state, move) => validMove(move)(state)
  ? 
  merge(state)({ moves: state.moves.concat([move]) })
  : state

module.exports = { EAST, NORTH, SOUTH, WEST, initialState, enqueue, next, }
