const express = require('express');
const router = express.Router();

let technicalItems = [];

router.post('/', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  technicalItems.push(item);
  res.status(201).json(item);
});

router.get('/', (req, res) => {
  res.json(technicalItems);
});

router.get('/:id', (req, res) => {
  const item = technicalItems.find(i => i.id == req.params.id);
  if (!item) return res.status(404).send('Item not found');
  res.json(item);
});

router.put('/:id', (req, res) => {
  const index = technicalItems.findIndex(i => i.id == req.params.id);
  if (index === -1) return res.status(404).send('Item not found');
  technicalItems[index] = { ...technicalItems[index], ...req.body };
  res.json(technicalItems[index]);
});

router.delete('/:id', (req, res) => {
  technicalItems = technicalItems.filter(i => i.id != req.params.id);
  res.send('Item deleted');
});

module.exports = router;
