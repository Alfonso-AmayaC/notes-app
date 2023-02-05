require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Note = require('./models/note')
const PORT = process.env.PORT;


const app = express();
// const url =
//   `mongodb+srv://fullstack:coERpE6djZD9Pt0O@mflix.9awtvsw.mongodb.net/noteApp?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());
app.use(morgan('Method::method Url::url Status::status Content Length::res[content-length] - :response-time ms\n'));
app.use(express.static('build'));

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if(note)
                response.json(note);
            else
                response.status(404).end();
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save()
    .then(savedNote => {
        response.json(savedNote)
    })
    .catch(err => {
        next(err)
    })
});

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end();
    })
    .catch(err => {next(err)})
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
        response.json(updatedNote);
    })
    .catch(error => {
        next(error);
    })
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  // this has to be the last loaded middleware.
  app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})