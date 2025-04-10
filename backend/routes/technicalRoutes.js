const express = require('express');
const router = express.Router();

let technicalItems = [
  {
    id: 1,
    title: 'Database Management Systems',
    description: 'Covers fundamental concepts of relational databases, SQL, and normalization.',
    upload_date: '2025-04-06',
    due_date: '2025-04-13',
    questions: [
      {
        qno: 1,
        question: 'Explain the differences between primary key and foreign key in a relational database.',
        marks: 10
      },
      {
        qno: 2,
        question: 'What is normalization? Explain 1NF, 2NF, and 3NF with examples.',
        marks: 15
      },
      {
        qno: 3,
        question: 'Write an SQL query to retrieve all students with marks greater than 80.',
        marks: 10
      }
    ]
  },
  {
    id: 2,
    title: 'Computer Networks',
    description: 'Tests understanding of networking layers, protocols, and devices.',
    upload_date: '2025-04-07',
    due_date: '2025-04-14',
    questions: [
      {
        qno: 1,
        question: 'Explain the OSI model and its 7 layers.',
        marks: 15
      },
      {
        qno: 2,
        question: 'Differentiate between TCP and UDP protocols.',
        marks: 10
      },
      {
        qno: 3,
        question: 'What are IP addressing and subnetting?',
        marks: 10
      }
    ]
  },
  {
    id: 3,
    title: 'Operating Systems',
    description: 'Questions based on process management, memory management, and file systems.',
    upload_date: '2025-04-08',
    due_date: '2025-04-15',
    questions: [
      {
        qno: 1,
        question: 'What is a deadlock? How can it be prevented?',
        marks: 10
      },
      {
        qno: 2,
        question: 'Compare and contrast paging and segmentation.',
        marks: 10
      },
      {
        qno: 3,
        question: 'Explain the concept of process scheduling with FCFS and Round Robin algorithms.',
        marks: 15
      }
    ]
  }
];

let technicalResponses =[
  {
    id: "87364",
    userId: "ujbkefr34347",
    response: [
      {questionNo: 1, ans: ""}, //value for the ans key is link to the video
      {questionNo: 2, ans: ""},
      {questionNo: 3, ans: ""},
],
    createdOn: "20-02-2025"
  }
]


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

router.post('/submit', (req, res) => {
  const technicalResponse = { id: Date.now(), ...req.body };
  technicalResponses.push(technicalResponse);
  res.status(201).json({
    message: "Submitted successfully"
  });
});router.post('/submit', (req, res) => {
  const technicalResponse = { id: Date.now(), ...req.body };
  technicalResponses.push(technicalResponse);
  res.status(201).json({
    message: "Submitted successfully"
  });
});


module.exports = router;
