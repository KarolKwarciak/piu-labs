    const board = document.querySelector('#board')
const STORAGE_KEY = 'kanbanDataSet'

const uid = () => 'c' + Math.random().toString(36).slice(2, 9)
const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 65%, 75%)`

function makeCard(text, col, id, color) {
    const card = document.createElement('div')
    card.className = 'card'
    card.id = id || uid()
    card.dataset.col = col
    card.style.background = color || randomColor()

    const title = document.createElement('h4')
    title.textContent = text || 'Nowe zadanie'
    title.contentEditable = 'true'
    card.append(title)

    const panel = document.createElement('div')
    panel.className = 'card-buttons'

    const left = button('←', 'move')
    const right = button('→', 'move')
    const del = button('Usuń', 'remove')
    const recolor = button('Kolor', 'repaint')

    panel.append(left, right, del, recolor)
    card.append(panel)

    document.querySelector(`section[data-col="${col}"] .cards`).append(card)
    refresh()
}

function button(label, cls) {
    const b = document.createElement('button')
    b.className = cls
    b.textContent = label
    return b
}

function store() {
    const all = [...document.querySelectorAll('.card')].map(el => ({
        id: el.id,
        text: el.querySelector('h4').innerText,
        col: el.dataset.col,
        color: el.style.background
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

function restore() {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    list.forEach(it => makeCard(it.text, it.col, it.id, it.color))
}

function countCards() {
    document.querySelectorAll('section').forEach(sec => {
        const count = sec.querySelectorAll('.card').length
        sec.querySelector('.cardCount').textContent = `Karty: ${count}`
    })
}

function refresh() {
    countCards()
    store()
}

function sortColumn(sec) {
    const cards = [...sec.querySelectorAll('.card')]
    cards.sort((a, b) => a.querySelector('h4').innerText.localeCompare(b.querySelector('h4').innerText))
    const container = sec.querySelector('.cards')
    cards.forEach(c => container.append(c))
    refresh()
}

function paintColumn(sec) {
    const c = randomColor()
    sec.querySelectorAll('.card').forEach(card => card.style.background = c)
    refresh()
}

board.addEventListener('click', e => {
    const sec = e.target.closest('section')
    const t = e.target
    if (!sec) return

    if (t.classList.contains('add')) makeCard('Nowe zadanie', sec.dataset.col)
    if (t.classList.contains('sort')) sortColumn(sec)
    if (t.classList.contains('paint')) paintColumn(sec)
    if (t.classList.contains('remove')) { t.closest('.card').remove(); refresh() }
    if (t.classList.contains('repaint')) { t.closest('.card').style.background = randomColor(); refresh() }

    if (t.classList.contains('move')) {
        const card = t.closest('.card')
        const col = card.dataset.col
        const direction = t.textContent.includes('→') ? 1 : -1
        const order = ['todo', 'doing', 'done']
        const next = order[Math.max(0, Math.min(order.length - 1, order.indexOf(col) + direction))]
        card.dataset.col = next
        document.querySelector(`section[data-col="${next}"] .cards`).append(card)
        refresh()
    }
})

board.addEventListener('input', store)

restore()
refresh()
