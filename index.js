const { response } = require('express')
const express= require('express')
const morgan = require('morgan')
const app=express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('frontend'))
morgan.token('content', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :content')
  )
let persons=[
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
app.get('/',morgan("tiny"),(request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
app.get('/api/persons',morgan("tiny"),(request,response)=>{
response.json(persons)
})
app.get('/api/persons/:id',morgan("tiny"),(request,response)=>{
    const id=Number(request.params.id)
    const person=persons.find(value=>value.id==id)
    if (person) return response.send(person)
    else response.status('404').end()

})
app.get('/info',morgan("tiny"),(request,response)=>{
response.write("<p>Phonebook has info for "+persons.length+" people.<p/>")
response.write("<p>"+new Date(new Date().toUTCString().slice(0, -3))+"</p>")
})
app.delete('/api/persons/:id',(request,response)=>{
const id=Number(request.params.id)
console.log(id)
persons = persons.filter(person => person.id !== id)
console.log(persons)
response.status(204).end()
})
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
app.post('/api/persons',(request,response)=>{
    const body=request.body
    morgan
    const person={
        id: generateId(),
        "name":body.name,
        "number":body.number
    }
    if (!body.name) {
        return response.status(400).json({ 
          error: 'name is missing' 
        })
      }
    if (!body.number){
        return response.status(404).json({
            error:'number is missing'
        })
    }
      if (persons.some(value=>value.name===body.name)) {
        return response.status(400).json({ 
          error: 'Name is already in the list' 
        })
      }  
     else { 
    persons=persons.concat(person)
    response.json(person) }
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT)