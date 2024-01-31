const express = require('express');
const fs = require('fs/promises');
const path = require('path')

const PORT = 3001;
const noteData = require('./db/db.json');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
  
});

app.get('/api/notes', async (req, res) => await res.json(noteData));

app.post('/api/notes', async (req,res)=>{
  console.info(`${req.method} request reveived to add note`);
  try{
    const filePath = path.join(__dirname, './db/db.json');
    const existingData = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(existingData);
    const newData = req.body;
    jsonData.push(newData);
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2),'utf8');
    
    noteData.push(newData);
    console.info(jsonData)
    res.status(201).json(jsonData)
  }catch(error){
    console.error('Error adding Data', error);
    res.status(500).json({error: 'Interal Server Error'})
  }

});

app.delete('/api/notes/:id', async (req,res)=>{
  console.log(noteData)
  noteData.splice( req.params.id,1)
  console.log(noteData)
  const filePath = path.join(__dirname, './db/db.json');
  await fs.writeFile(filePath, JSON.stringify(noteData, null, 2),'utf8');
  res.end()
})
// const noteToDelete = noteData[req.params.id]
// console.log(req.params.title)
// console.log(noteData)
// console.log(noteToDelete)
// try{
//   const filePath = path.join(__dirname, './db/db.json');
//   const existingData = await fs.readFile(filePath, 'utf8');
//   const jsonData = JSON.parse(existingData);
//   jsonData.splice( req.params.id,1)
//   console.log(jsonData)
//   res.end()
// }catch(error){
//   console.error('Error adding Data', error);
//   res.status(500).json({error: 'Interal Server Error'})
// }

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});


