require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')
const app = express()


morgan.token('postInfo', function postId (request) {
  return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postInfo'))


app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Contact.fincById(request.params.id).then(contact => {
    response.json(contact)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  // let id = Number(request.params.id)
  // localContacts = localContacts.filter(contact => contact.id !== id)
  // Contact.deleteOne()

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  let newContact = request.body
  
  if (newContact.name == null || newContact.number == null) {
    return response.status(404).json({ 
      error: "You must add a contact with a name or number"})
  }

  let contact = new Contact({
    name: newContact.name,
    number: newContact.number
  })
  
  contact.save().then(savedContact => {
    response.json(savedContact)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})