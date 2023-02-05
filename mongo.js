const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@mflix.9awtvsw.mongodb.net/noteApp?retryWrites=true&w=majority`

console.log(url);

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'Lol',
  important: true,
})

Note.find({content: 'HTML is Easy'}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
})