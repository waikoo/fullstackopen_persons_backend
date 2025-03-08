require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Entry = require('./models/phonebook.js')

const app = express()

// let persons = [
//   {
//     "id": "1",
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": "2",
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": "3",
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": "4",
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]

app.use(express.static('dist'))

app.use(cors())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})


app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
  res.send('<h1>Hello Persons!</h1>')
})

app.get('/api/persons', (req, res) => {
  Entry.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  res.send(`
    <main>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </main>
    `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const personMatch = persons.find(person => person.id === id)

  if (personMatch) {
    res.json(personMatch)
  } else {
    res.sendStatus(204).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id

  persons = persons.filter(person => person.id !== id)

  res.sendStatus(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'missing name or number', })
  }

  const newPerson = new Entry({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(savedEntry => {
    res.json(savedEntry)
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})
