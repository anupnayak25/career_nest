const express = require('express');
const router = express.Router();

let programs = [
  {
    id: 1,
    title: 'Basic Java Programs',
    description: 'Covers basic Java concepts like classes, loops, and conditions.',
    upload_date: '2025-04-05',
    due_date: '2025-04-12',
    questions: [
      {
        qno: 1,
        question: 'Write a Java program to check if a number is even or odd.',
        programm_snippet: `public class EvenOdd {
  public static void main(String[] args) {
    int num = 10;
    if(num % 2 == 0)
      System.out.println("Even");
    else
      System.out.println("Odd");
  }
}`,
        marks: 10
      },
      {
        qno: 2,
        question: 'Write a program to find the factorial of a number using a loop.',
        programm_snippet: `public class Factorial {
  public static void main(String[] args) {
    int n = 5, fact = 1;
    for(int i = 1; i <= n; i++) {
      fact *= i;
    }
    System.out.println("Factorial: " + fact);
  }
}`,
        marks: 10
      }
    ],
    totalMarks: 20,
  },
  {
    id: 2,
    title: 'OOP Concepts in Java',
    description: 'Covers object-oriented programming concepts like inheritance and polymorphism.',
    upload_date: '2025-04-06',
    due_date: '2025-04-14',
    questions: [
      {
        qno: 1,
        question: 'Write a Java program demonstrating single inheritance.',
        programm_snippet: `class Animal {
  void sound() {
    System.out.println("Animal makes sound");
  }
}
class Dog extends Animal {
  void bark() {
    System.out.println("Dog barks");
  }
}
public class Test {
  public static void main(String[] args) {
    Dog d = new Dog();
    d.sound();
    d.bark();
  }
}`,
        marks: 15
      },
      {
        qno: 2,
        question: 'Write a program showing method overriding.',
        programm_snippet: `class Vehicle {
  void run() {
    System.out.println("Vehicle is running");
  }
}
class Bike extends Vehicle {
  void run() {
    System.out.println("Bike is running safely");
  }
}
public class TestOverride {
  public static void main(String[] args) {
    Vehicle v = new Bike();
    v.run();
  }
}`,
        marks: 10
      }
    ],
    totalMarks: 25,
  },
  {
    id: 3,
    title: 'Data Structures in Java',
    description: 'Focuses on basic data structure implementations like arrays and stacks.',
    upload_date: '2025-04-07',
    due_date: '2025-04-15',
    questions: [
      {
        qno: 1,
        question: 'Write a Java program to implement a stack using an array.',
        programm_snippet: `class Stack {
  int top = -1;
  int[] stack = new int[5];

  void push(int data) {
    if(top == stack.length - 1)
      System.out.println("Stack Overflow");
    else
      stack[++top] = data;
  }

  int pop() {
    if(top == -1) {
      System.out.println("Stack Underflow");
      return -1;
    }
    return stack[top--];
  }
}`,
        marks: 20
      }
    ]
    ,
    totalMarks: 20,
  }
];


router.get('/', (req, res) => {
  connection.query("SELECT * FROM program_sets", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.get('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM program_questions WHERE hr_question_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).send('Post not found');
    res.json(results);
  });
});


router.post('/', (req, res) => {
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `INSERT INTO program_sets (title, description, upload_date, due_date, totalMarks, user_id)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});


router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, upload_date, due_date, totalMarks, user_id } = req.body;
  const query = `UPDATE program_sets SET title=?, description=?, upload_date=?, due_date=?, totalMarks=?, user_id=? WHERE id=?`;
  connection.query(query, [title, description, upload_date, due_date, totalMarks, user_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM program_sets WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send("Post deleted");
  });
});


module.exports = router;
