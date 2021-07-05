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
        return false;
    
    if (notesArray.length === 0)
        notesArray.push(0);

    notesArray.push(addNote);
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(notesArray, null, 2)
    );
    return addNote;
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


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});