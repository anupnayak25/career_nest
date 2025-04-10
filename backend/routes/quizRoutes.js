const express = require('express');
const router = express.Router();

let quizzes = [
  {
    id: 1,
    title: 'Java Basics Quiz',
    description: 'This quiz tests fundamental Java knowledge including syntax, datatypes, and control flow.',
    upload_date: '2025-04-06',
    due_date: '2025-04-13',
    questions: [
      {
        qno: 1,
        question: 'Which of the following is a valid keyword in Java?',
        options: ['interface', 'unsigned', 'friend', 'sizeof'],
        marks: 5
      },
      {
        qno: 2,
        question: 'What is the default value of an int variable in Java?',
        options: ['0', 'null', 'undefined', '1'],
        marks: 5
      },
      {
        qno: 3,
        question: 'Which loop is guaranteed to execute at least once?',
        options: ['for', 'while', 'do-while', 'none of the above'],
        marks: 5
      }
    ]
  },
  {
    id: 2,
    title: 'OOP Principles Quiz',
    description: 'Quiz on object-oriented principles such as inheritance, encapsulation, and polymorphism.',
    upload_date: '2025-04-07',
    due_date: '2025-04-14',
    questions: [
      {
        qno: 1,
        question: 'Which concept of OOP means hiding internal details?',
        options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
        marks: 5
      },
      {
        qno: 2,
        question: 'Which keyword is used for inheritance in Java?',
        options: ['this', 'extends', 'implements', 'import'],
        marks: 5
      },
      {
        qno: 3,
        question: 'Polymorphism is achieved in Java through:',
        options: ['Method Overloading', 'Method Overriding', 'Both A and B', 'None of the above'],
        marks: 5
      }
    ]
  },
  {
    id: 3,
    title: 'Data Structures Quiz',
    description: 'Covers basics of arrays, stacks, and queues.',
    upload_date: '2025-04-08',
    due_date: '2025-04-15',
    questions: [
      {
        qno: 1,
        question: 'Which data structure uses LIFO order?',
        options: ['Queue', 'Array', 'Stack', 'Linked List'],
        marks: 5
      },
      {
        qno: 2,
        question: 'Which of the following is not a linear data structure?',
        options: ['Stack', 'Queue', 'Graph', 'Array'],
        marks: 5
      },
      {
        qno: 3,
        question: 'Which of the following has dynamic memory allocation?',
        options: ['Array', 'Stack', 'Queue', 'Linked List'],
        marks: 5
      }
    ]
  }
];


let quizResponses = [
  {
    id: "87364",
    userId: "ujbkefr34347",
    respons: [
      {questionNo: 1, ans: 1},
      {questionNo: 2, ans: 1},
      {questionNo: 3, ans: 4},
      {questionNo: 4, ans: 2},
      {questionNo: 5, ans: 3},
      {questionNo: 6, ans: 1},
      {questionNo: 7, ans: 1},
      {questionNo: 8, ans: 4},
      {questionNo: 9, ans: 2},
      {questionNo: 10, ans: 3},
      {questionNo: 11, ans: 1},
      {questionNo: 12, ans: 1},
      {questionNo: 13, ans: 4},
      {questionNo: 14, ans: 2},
      {questionNo: 15, ans: 3}
    ],
    createdOn: "20-02-2025"
  }
]


router.post('/', (req, res) => {
  const quiz = { id: Date.now(), ...req.body };
  quizzes.push(quiz);
  res.status(201).json(quiz);
});

router.get('/', (req, res) => {
  res.json(quizzes);
});

router.get('/:id', (req, res) => {
  const quiz = quizzes.find(q => q.id == req.params.id);
  if (!quiz) return res.status(404).send('Quiz not found');
  res.json(quiz);
});

router.put('/:id', (req, res) => {
  const index = quizzes.findIndex(q => q.id == req.params.id);
  if (index === -1) return res.status(404).send('Quiz not found');
  quizzes[index] = { ...quizzes[index], ...req.body };
  res.json(quizzes[index]);
});

router.delete('/:id', (req, res) => {
  quizzes = quizzes.filter(q => q.id != req.params.id);
  res.send('Quiz deleted');
});

router.post('/submit', (req, res) => {
  const quizResponse = { id: Date.now(), ...req.body };
  quizResponses.push(quizResponse);
  console.log(quizResponses);
  res.status(201).json({
    message: "Submitted successfully"
  });
});

module.exports = router;
