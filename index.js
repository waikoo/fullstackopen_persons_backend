require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Entry = require('./models/phonebook.js')

const app = express()


app.use(express.static('dist'))

app.use(cors())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
  res.send('<h1>Hello Phonebook!</h1>')
})

app.get('/api/persons', (req, res) => {
  Entry.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Entry.find({}).then(persons => {

    res.send(`
    <main>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </main>
    `)
  })

})

app.get('/api/persons/:id', (req, res, next) => {
  Entry.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.sendStatus(404).end()
      }
    }).catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Entry.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end()
  }).catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
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
  }).catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Entry.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedEntry => {
      if (updatedEntry) {
        res.json(updatedEntry)
      } else {
        res.status(404).end()
      }
    }).catch(err => next(err))
})

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})
