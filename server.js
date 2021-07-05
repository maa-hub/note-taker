const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;

const express = require('express');
const app = express();

const notes = require('./db/db.json');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

function createNote(body, notesArray) {
    const addNote = body;
    if (!Array.isArray(notesArray))
    notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(addNote);
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(notesArray, null, 2)
    );
    return addNote;
  };

  function removeNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.get('/api/notes', (req, res) => {
    res.json(notes.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

  app.post('/api/notes', (req, res) => {
      const addNote = createNote (req.body, notes);
      res.json(addNote);
  });


app.delete('/api/notes/:id', (req, res) => {
    removeNote(req.params.id, notes);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});