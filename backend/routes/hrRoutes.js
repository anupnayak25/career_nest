const express = require('express');
const router = express.Router();

let hrPosts = [];

router.post('/', (req, res) => {
  const post = { id: Date.now(), ...req.body };
  hrPosts.push(post);
  res.status(201).json(post);
});

router.get('/', (req, res) => {
  res.json(hrPosts);
});

router.get('/:id', (req, res) => {
  const post = hrPosts.find(h => h.id == req.params.id);
  if (!post) return res.status(404).send('HR Post not found');
  res.json(post);
});

router.put('/:id', (req, res) => {
  const index = hrPosts.findIndex(h => h.id == req.params.id);
  if (index === -1) return res.status(404).send('HR Post not found');
  hrPosts[index] = { ...hrPosts[index], ...req.body };
  res.json(hrPosts[index]);
});

router.delete('/:id', (req, res) => {
  hrPosts = hrPosts.filter(h => h.id != req.params.id);
  res.send('HR Post deleted');
});

module.exports = router;
