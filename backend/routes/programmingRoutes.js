const express = require('express');
const router = express.Router();

let programs = [];

router.post('/', (req, res) => {
  const program = { id: Date.now(), ...req.body };
  programs.push(program);
  res.status(201).json(program);
});

router.get('/', (req, res) => {
  res.json(programs);
});

router.get('/:id', (req, res) => {
  const program = programs.find(p => p.id == req.params.id);
  if (!program) return res.status(404).send('Program not found');
  res.json(program);
});

router.put('/:id', (req, res) => {
  const index = programs.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).send('Program not found');
  programs[index] = { ...programs[index], ...req.body };
  res.json(programs[index]);
});

router.delete('/:id', (req, res) => {
  programs = programs.filter(p => p.id != req.params.id);
  res.send('Program deleted');
});

module.exports = router;
