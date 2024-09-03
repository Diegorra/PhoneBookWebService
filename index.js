const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


morgan.token('postInfo', function postId (request) {
  return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postInfo'))

  
let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${Date()}</p>`)
})


app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id)
  let contact = contacts.find(contact => contact.id === id)
  
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  let newContact = request.body
  
  if (newContact.name == null || newContact.number == null) {
    return response.status(404).json({ 
      error: "You must add a contact with a name or number"})
  }

  if (contacts.some(contact => contact.name === newContact.name)) {
    return response.status(404).json({ 
      error: `${newContact.name} is already added to the phonebook`})
  }

  let contact = {
    id: Math.floor(Math.random() * 99),
    name: newContact.name,
    number: newContact.number
  }
  contacts = contacts.concat(contact)
  response.json(contact)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})