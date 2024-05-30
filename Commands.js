const readline = require('readline');
const Snake    = require('./snake')
const base     = require('./base')
Object.getOwnPropertyNames(base).map(p => global[p] = base[p])

let State = Snake.initialState()

const Matrix = {
  make:      table => rep(rep('.')(table.cols))(table.rows),
  set:       val   => pos => adjust(pos.y)(adjust(pos.x)(k(val))),
  addSnake:  state => pipe(...map(Matrix.set('X'))(state.snake)),

  addApple:  state => Matrix.set('o')(state.apple),

  addPoisonApple:  state => Matrix.set('O')(state.poisonapple),
  
  addCrash:  state => state.snake.length == 0 ? map(map(k('#'))) : id,

  toString:  xsxs  => xsxs.map(xs => xs.join(' ')).join('\r\n'),

  fromState: state => pipe(
    Matrix.make,
    Matrix.addSnake(state),
    Matrix.addApple(state),
    Matrix.addCrash(state),
    Matrix.addPoisonApple(state),
  )(state)
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') process.exit()

  switch (key.name.toUpperCase()) {
    case 'W': case 'K': case 'UP':    State = Snake.enqueue(State, Snake.NORTH); break
    case 'A': case 'H': case 'LEFT':  State = Snake.enqueue(State, Snake.WEST);  break
    case 'S': case 'J': case 'DOWN':  State = Snake.enqueue(State, Snake.SOUTH); break
    case 'D': case 'L': case 'RIGHT': State = Snake.enqueue(State, Snake.EAST);  break
  }
});

const show = () => console.log('\x1Bc' + Matrix.toString(Matrix.fromState(State)) + '\n Sua pontuação: '+Snake.next(State).score)

const step = () => State = Snake.next(State)

const vel = (v=3) => {
    switch (v) {
        case 0: return 300; break;
        case 1: return 250; break;
        case 2: return 200; break;
        case 3: return 150; break;
        case 4: return 100; break;
        case 5: return 50; break;
        default: return 25; break;
    }
}

setInterval(() => { step(); show(); },  0 + vel(0))


setInterval(() => { step(); show(); },  0 + vel(Snake.next(State).increase))

/*A Função next foi usada mesmo sem estar definida aqui, isso mostra que ela possui o princípio de closure,
pois foi executada mesmo estando fora do seu escopo léxico*/
