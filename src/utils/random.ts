// fully ai generated

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

let deck = shuffle([...Array(11).keys()])
let index = 0

export function nextIndex() {
  if (index >= deck.length) {
    const last = deck[deck.length - 1]
    do {
      deck = shuffle(deck)
    } while (deck[0] === last)
    index = 0
  }
  return deck[index++]
}
