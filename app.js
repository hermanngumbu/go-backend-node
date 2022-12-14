const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Thing = require('./models/Thing');

// Connect mongoose
mongoose.connect("mongodb+srv://admin:0999191235@clusterfree.vrzqole.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  // new way to make bodyParser
app.use(express.json());

// Make CORS policy
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  // save our thing model
app.post('/api/stuff', (req, res, next) =>{
   delete req.body._id;
   const thing = new Thing({
    ...req.body
   });
   thing.save()
   .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
   .catch(error => res.status(400).json({ error }));
});

// Put root for modify thing
app.put('/api/stuff/:id', (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
});

// Delete thing 
app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet supprimer !' }))
  .catch(error => res.status(400).json({ error }));
});

// get one thing
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

// get all things
app.use('/api/stuff', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;