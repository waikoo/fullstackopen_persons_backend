const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url =
  `mongodb+srv://beroer:${password}@phonebook-cluster.p2uj8.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebook-cluster`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', phonebookSchema)

if (process.argv.length === 3) {
  Entry.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(entry => {
      console.log(entry.name, entry.number)
    })
    mongoose.connection.close()
    return
  })
} else if (newName && newNumber) {
  const entry = new Entry({
    name: newName,
    number: newNumber,
  })

  entry.save().then(() => {
    console.log(`added ${newName}'s number ${newNumber} to phonebook`)
    mongoose.connection.close()
  })
}

