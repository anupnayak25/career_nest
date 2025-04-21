const express = require('express');
const router = express.Router();

let hrPosts = [
  {
    id: 1,
    title: 'Tell me about yourself',
    description: 'A classic HR question to evaluate communication skills and confidence.',
    upload_date: '2025-04-01',
    due_date: '2025-04-10',
    questions: [
      { qno: 1, question: 'Give a brief introduction about yourself.', marks: 10 },
      { qno: 2, question: 'What motivates you to apply for this role?', marks: 5 },
      { qno: 3, question: 'Highlight your strengths and how they help you.', marks: 5 }
    ],
    totalMarks: 20,
  },
  {
    id: 2,
    title: 'Teamwork and Leadership',
    description: 'Understanding your ability to work in teams and lead initiatives.',
    upload_date: '2025-04-03',
    due_date: '2025-04-12',
    questions: [
      { qno: 1, question: 'Describe a time when you worked in a team to accomplish a goal.', marks: 10 },
      { qno: 2, question: 'Have you ever taken a leadership role? What was the outcome?', marks: 10 },
      { qno: 3, question: 'How do you handle conflicts in a team setting?', marks: 5 }
    ],
    totalMarks: 25,
  },
  {
    id: 3,
    title: 'Handling Pressure and Challenges',
    description: 'Assessing how you deal with stressful situations and solve problems.',
    upload_date: '2025-04-04',
    due_date: '2025-04-13',
    questions: [
      { qno: 1, question: 'Tell me about a time you faced a tough challenge. How did you overcome it?', marks: 10 },
      { qno: 2, question: 'How do you handle tight deadlines?', marks: 5 },
      { qno: 3, question: 'What do you do when you don’t know how to complete a task?', marks: 5 }
    ],
    totalMarks: 20,
  },
  {
    id: 4,
    title: 'Company Knowledge & Career Goals',
    description: 'To evaluate how much you know about the company and your long-term goals.',
    upload_date: '2025-04-05',
    due_date: '2025-04-15',
    questions: [
      { qno: 1, question: 'What do you know about our company?', marks: 5 },
      { qno: 2, question: 'Where do you see yourself in five years?', marks: 10 },
      { qno: 3, question: 'Why should we hire you?', marks: 10 }
    ],
    totalMarks: 25,
  }
];



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
