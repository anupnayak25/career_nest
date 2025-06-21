-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 21, 2025 at 06:49 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carrer_nest`
--

-- --------------------------------------------------------

--
-- Table structure for table `hr_answers`
--

CREATE TABLE `hr_answers` (
  `id` int(11) NOT NULL,
  `hr_question_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `qno` int(11) DEFAULT NULL,
  `answer` text DEFAULT NULL,
  `marks_awarded` int(11) DEFAULT 0,
  `submitted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_answers`
--

INSERT INTO `hr_answers` (`id`, `hr_question_id`, `user_id`, `qno`, `answer`, `marks_awarded`, `submitted_at`) VALUES
(1, 1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'I am Harshith P, a computer science student with a passion for software development. I have experience in web development and app development using various technologies.', 8, '2025-04-20 14:30:00'),
(2, 1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 2, 'I am motivated to apply for this role because it aligns with my career goals in software engineering. I am particularly interested in working on innovative projects that can make a real impact.', 4, '2025-04-20 14:35:00'),
(3, 1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 3, 'My key strengths include problem-solving abilities, attention to detail, and strong communication skills. These help me collaborate effectively in teams and deliver high-quality solutions.', 5, '2025-04-20 14:40:00'),
(4, 2, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'During my final year project, I worked with a team of four to develop a student management system. I was responsible for the database design and backend development. We successfully delivered the project ahead of schedule with all requirements met.', 8, '2025-04-21 10:15:00'),
(5, 2, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 2, 'Yes, I led a team of developers for our college technical festival. I coordinated the development of the event website and managed tasks among team members. The website successfully handled over 500 registrations without issues.', 9, '2025-04-21 10:25:00');

-- --------------------------------------------------------

--
-- Table structure for table `hr_questions`
--

CREATE TABLE `hr_questions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `upload_date` date DEFAULT current_timestamp(),
  `due_date` date DEFAULT NULL,
  `totalMarks` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `display_result` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_questions`
--

INSERT INTO `hr_questions` (`id`, `title`, `description`, `upload_date`, `due_date`, `totalMarks`, `user_id`, `display_result`) VALUES
(1, 'Tell me about yourself', 'A classic HR question to evaluate communication skills and confidence.', '2025-04-01', '2025-04-10', 20, 'user123', 0),
(2, 'Teamwork and Leadership', 'Understanding your ability to work in teams and lead initiatives.', '2025-04-03', '2025-04-12', 25, 'user123', 0),
(3, 'Handling Pressure and Challenges', 'Assessing how you deal with stressful situations and solve problems.', '2025-04-04', '2025-04-13', 20, 'user123', 0),
(4, 'Company Knowledge & Career Goals', 'To evaluate how much you know about the company and your long-term goals.', '2025-04-05', '2025-04-15', 25, 'user123', 0);

-- --------------------------------------------------------

--
-- Table structure for table `hr_question_items`
--

CREATE TABLE `hr_question_items` (
  `id` int(11) NOT NULL,
  `hr_question_id` int(11) DEFAULT NULL,
  `qno` int(11) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `marks` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_question_items`
--

INSERT INTO `hr_question_items` (`id`, `hr_question_id`, `qno`, `question`, `marks`) VALUES
(1, 1, 1, 'Give a brief introduction about yourself.', 10),
(2, 1, 2, 'What motivates you to apply for this role?', 5),
(3, 1, 3, 'Highlight your strengths and how they help you.', 5),
(4, 2, 1, 'Describe a time when you worked in a team to accomplish a goal.', 10),
(5, 2, 2, 'Have you ever taken a leadership role? What was the outcome?', 10),
(6, 2, 3, 'How do you handle conflicts in a team setting?', 5),
(7, 3, 1, 'Tell me about a time you faced a tough challenge. How did you overcome it?', 10),
(8, 3, 2, 'How do you handle tight deadlines?', 5),
(9, 3, 3, 'What do you do when you don’t know how to complete a task?', 5),
(10, 4, 1, 'What do you know about our company?', 5),
(11, 4, 2, 'Where do you see yourself in five years?', 10),
(12, 4, 3, 'Why should we hire you?', 10);

-- --------------------------------------------------------

--
-- Table structure for table `program_answers`
--

CREATE TABLE `program_answers` (
  `id` int(11) NOT NULL,
  `program_set_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `qno` int(11) DEFAULT NULL,
  `submitted_code` text DEFAULT NULL,
  `marks_awarded` int(11) DEFAULT 0,
  `submitted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_answers`
--

INSERT INTO `program_answers` (`id`, `program_set_id`, `user_id`, `qno`, `submitted_code`, `marks_awarded`, `submitted_at`) VALUES
(1, 1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'public class EvenOdd {\n    public static void main(String[] args) {\n        int num = 15;\n        if(num % 2 == 0) {\n            System.out.println(num + \" is even\");\n        } else {\n            System.out.println(num + \" is odd\");\n        }\n    }\n}', 8, '2025-04-20 16:00:00'),
(2, 1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 2, 'public class Factorial {\n    public static void main(String[] args) {\n        int n = 5;\n        int factorial = 1;\n        for(int i = 1; i <= n; i++) {\n            factorial = factorial * i;\n        }\n        System.out.println(\"Factorial of \" + n + \" is \" + factorial);\n    }\n}', 9, '2025-04-20 16:15:00'),
(3, 2, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'class Animal {\n    void sound() {\n        System.out.println(\"Animal makes a sound\");\n    }\n}\n\nclass Dog extends Animal {\n    void sound() {\n        System.out.println(\"Dog barks\");\n    }\n}\n\npublic class SingleInheritance {\n    public static void main(String[] args) {\n        Animal animal = new Animal();\n        animal.sound();\n        \n        Dog dog = new Dog();\n        dog.sound();\n    }\n}', 14, '2025-04-21 17:30:00'),
(4, 3, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'public class StackImplementation {\n    private int maxSize;\n    private int[] stackArray;\n    private int top;\n    \n    public StackImplementation(int size) {\n        maxSize = size;\n        stackArray = new int[maxSize];\n        top = -1;\n    }\n    \n    public void push(int value) {\n        if (top < maxSize - 1) {\n            stackArray[++top] = value;\n        } else {\n            System.out.println(\"Stack is full\");\n        }\n    }\n    \n    public int pop() {\n        if (top >= 0) {\n            return stackArray[top--];\n        } else {\n            System.out.println(\"Stack is empty\");\n            return -1;\n        }\n    }\n    \n    public int peek() {\n        if (top >= 0) {\n            return stackArray[top];\n        } else {\n            System.out.println(\"Stack is empty\");\n            return -1;\n        }\n    }\n    \n    public boolean isEmpty() {\n        return (top == -1);\n    }\n    \n    public static void main(String[] args) {\n        StackImplementation stack = new StackImplementation(5);\n        stack.push(10);\n        stack.push(20);\n        stack.push(30);\n        \n        System.out.println(\"Top element: \" + stack.peek());\n        System.out.println(\"Popped element: \" + stack.pop());\n        System.out.println(\"Top element after pop: \" + stack.peek());\n    }\n}', 18, '2025-04-22 13:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `program_questions`
--

CREATE TABLE `program_questions` (
  `id` int(11) NOT NULL,
  `program_set_id` int(11) DEFAULT NULL,
  `qno` int(11) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `program_snippet` text DEFAULT NULL,
  `marks` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_questions`
--

INSERT INTO `program_questions` (`id`, `program_set_id`, `qno`, `question`, `program_snippet`, `marks`) VALUES
(1, 1, 1, 'Write a Java program to check if a number is even or odd.', '// Hint: Use modulo operator (%) and conditional statements to check if a number is even or odd.', 10),
(2, 1, 2, 'Write a program to find the factorial of a number using a loop.', '// Hint: Initialize a variable to 1 and use a for loop to multiply numbers from 1 to n.', 10),
(3, 2, 1, 'Write a Java program demonstrating single inheritance.', '// Hint: Create a base class and a derived class using extends. Call methods from both in main.', 15),
(4, 2, 2, 'Write a program showing method overriding.', '// Hint: Define a method in a superclass and override it in the subclass. Call it using the superclass reference.', 10),
(5, 3, 1, 'Write a Java program to implement a stack using an array.', '// Hint: Use an array and a variable to track top index. Implement push and pop with boundary checks.', 20);

-- --------------------------------------------------------

--
-- Table structure for table `program_sets`
--

CREATE TABLE `program_sets` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `upload_date` date DEFAULT current_timestamp(),
  `due_date` date DEFAULT NULL,
  `totalMarks` int(11) DEFAULT NULL,
  `user_id` text NOT NULL,
  `display_result` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_sets`
--

INSERT INTO `program_sets` (`id`, `title`, `description`, `upload_date`, `due_date`, `totalMarks`, `user_id`, `display_result`) VALUES
(1, 'Basic Java Programs', 'Covers basic Java concepts like classes, loops, and conditions.', '2025-04-05', '2025-04-12', 20, 'user123', 0),
(2, 'OOP Concepts in Java', 'Covers object-oriented programming concepts like inheritance and polymorphism.', '2025-04-06', '2025-04-14', 25, 'user123', 0),
(3, 'Data Structures in Java', 'Focuses on basic data structure implementations like arrays and stacks.', '2025-04-07', '2025-04-15', 20, 'user123', 0);

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `upload_date` datetime DEFAULT current_timestamp(),
  `due_date` datetime DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `display_result` tinyint(1) NOT NULL DEFAULT 0,
  `totalMarks` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `title`, `description`, `upload_date`, `due_date`, `user_id`, `display_result`, `totalMarks`) VALUES
(1, 'Java Basics Quiz', 'This quiz tests fundamental Java knowledge including syntax, datatypes, and control flow.', '2025-04-06 00:00:00', '2025-04-13 00:00:00', 'user123', 0, 0),
(2, 'OOP Principles Quiz', 'Quiz on object-oriented principles such as inheritance, encapsulation, and polymorphism.', '2025-04-07 00:00:00', '2025-04-14 00:00:00', 'user123', 0, 0),
(3, 'Data Structures Quiz', 'Covers basics of arrays, stacks, and queues.', '2025-04-08 00:00:00', '2025-04-15 00:00:00', 'user123', 0, 0),
(10, 'Java', 'This is a test java quiz', '2025-06-21 22:07:06', '2025-06-25 00:00:00', 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 0, 10101010);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_answers`
--

CREATE TABLE `quiz_answers` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `qno` int(11) DEFAULT NULL,
  `selected_ans` varchar(255) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT 0,
  `marks_awarded` int(11) DEFAULT NULL,
  `submitted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_answers`
--

INSERT INTO `quiz_answers` (`id`, `quiz_id`, `user_id`, `qno`, `selected_ans`, `is_correct`, `marks_awarded`, `submitted_at`) VALUES
(1, 1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'interface', 1, 5, '2025-04-22 09:00:00'),
(2, 1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 2, '0', 1, 5, '2025-04-22 09:02:00'),
(3, 1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 3, 'for', 0, 0, '2025-04-22 09:05:00'),
(4, 2, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'Encapsulation', 1, 5, '2025-04-23 14:20:00'),
(5, 2, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 2, 'extends', 1, 5, '2025-04-23 14:22:00'),
(6, 3, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 3, 'Both A and B', 1, 5, '2025-04-23 14:25:00'),
(7, 3, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'Stack', 1, 5, '2025-04-24 11:30:00'),
(8, 3, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 2, 'Graph', 1, 5, '2025-04-24 11:35:00'),
(9, 3, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 3, 'Array', 0, 0, '2025-04-24 11:40:00');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `qno` int(11) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `marks` int(11) DEFAULT NULL,
  `correct_ans` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `quiz_id`, `qno`, `question`, `options`, `marks`, `correct_ans`) VALUES
(1, 1, 1, 'Which of the following is a valid keyword in Java?', '[\"interface\", \"unsigned\", \"friend\", \"sizeof\"]', 5, 'interface'),
(2, 1, 2, 'What is the default value of an int variable in Java?', '[\"0\", \"null\", \"undefined\", \"1\"]', 5, '0'),
(3, 1, 3, 'Which loop is guaranteed to execute at least once?', '[\"for\", \"while\", \"do-while\", \"none of the above\"]', 5, 'do-while'),
(4, 2, 1, 'Which concept of OOP means hiding internal details?', '[\"Encapsulation\", \"Inheritance\", \"Polymorphism\", \"Abstraction\"]', 5, 'Encapsulation'),
(5, 2, 2, 'Which keyword is used for inheritance in Java?', '[\"this\", \"extends\", \"implements\", \"import\"]', 5, 'extends'),
(6, 2, 3, 'Polymorphism is achieved in Java through:', '[\"Method Overloading\", \"Method Overriding\", \"Both A and B\", \"None of the above\"]', 5, 'Both A and B'),
(7, 3, 1, 'Which data structure uses LIFO order?', '[\"Queue\", \"Array\", \"Stack\", \"Linked List\"]', 5, 'Stack'),
(8, 3, 2, 'Which of the following is not a linear data structure?', '[\"Stack\", \"Queue\", \"Graph\", \"Array\"]', 5, 'Graph'),
(9, 3, 3, 'Which of the following has dynamic memory allocation?', '[\"Array\", \"Stack\", \"Queue\", \"Linked List\"]', 5, 'Linked List'),
(22, 10, 1, 'Java is a Object oriented language', '[\"True\",\"False\"]', 10, 'True'),
(23, 10, 2, 'How to accept input from the user?', '[\"Scanner class\",\"print function\",\"outputstream\",\"switch cases\"]', 10, 'Scanner class'),
(24, 10, 3, 'Java allows multi threading', '[\"True\",\"False\"]', 10, 'True'),
(25, 10, 4, 'Java supports', '[\"Inheritence\",\"Abstraction\",\"Encapsulation\",\"Polymorphism\",\"All of the above\"]', 10, 'All of the above');

-- --------------------------------------------------------

--
-- Table structure for table `technical_answers`
--

CREATE TABLE `technical_answers` (
  `id` int(11) NOT NULL,
  `technical_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `qno` int(11) DEFAULT NULL,
  `answer` text DEFAULT NULL,
  `marks_awarded` int(11) DEFAULT 0,
  `submitted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_answers`
--

INSERT INTO `technical_answers` (`id`, `technical_id`, `user_id`, `qno`, `answer`, `marks_awarded`, `submitted_at`) VALUES
(1, 1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'A primary key uniquely identifies each record in a table and cannot be null or duplicate. It is used to establish relationships between tables.\nA foreign key is a field in one table that refers to the primary key in another table. It creates a relationship between tables, enforcing referential integrity. Foreign keys can be null and can have duplicate values.\n\nExample: In a Students and Courses database, the student_id would be the primary key in the Students table, while it would be a foreign key in the Enrollment table to relate students to their courses.', 9, '2025-04-23 10:00:00'),
(2, 1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 2, 'Normalization is the process of organizing data in a database to reduce data redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them.\n\n1NF (First Normal Form): A table is in 1NF if it contains no repeating groups or arrays. All entries in a column must be of the same domain.\nExample: A table Students(ID, Name, Courses) with Courses being a comma-separated list is not in 1NF. To convert to 1NF, create Students(ID, Name) and StudentCourses(ID, Course).\n\n2NF (Second Normal Form): A table is in 2NF if it is in 1NF and all non-key attributes are fully dependent on the primary key.\nExample: Consider OrderItems(OrderID, ProductID, UnitPrice, Quantity, ProductName). If the composite key is (OrderID, ProductID) but ProductName depends only on ProductID, it violates 2NF. Split into OrderItems(OrderID, ProductID, UnitPrice, Quantity) and Products(ProductID, ProductName).\n\n3NF (Third Normal Form): A table is in 3NF if it is in 2NF and all attributes are directly dependent on the primary key, not on other non-key attributes.\nExample: Employee(EmpID, DeptID, DeptName). Here, DeptName depends on DeptID, not directly on EmpID. Split into Employee(EmpID, DeptID) and Department(DeptID, DeptName).', 13, '2025-04-23 10:20:00'),
(3, 2, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'The OSI (Open Systems Interconnection) model is a conceptual framework for understanding network interactions in seven layers:\n\n1. Physical Layer: Deals with physical connection between devices. It defines specifications for hardware like cables, switches, and network interface cards. Example: Ethernet cables, hubs.\n\n2. Data Link Layer: Provides node-to-node data transfer and error detection/correction. It formats messages into data frames and manages access to physical media. Example: MAC addressing, switches.\n\n3. Network Layer: Manages addressing, routing and traffic control. It forwards packets across multiple networks. Example: IP, routers.\n\n4. Transport Layer: Provides end-to-end communication and quality of service. It ensures complete data transfer and handles flow control. Example: TCP, UDP.\n\n5. Session Layer: Establishes, maintains and terminates connections (sessions) between applications. Example: NetBIOS, RPC.\n\n6. Presentation Layer: Translates data between the application layer and lower layers. It handles data formatting, encryption/decryption, and compression. Example: SSL/TLS, JPEG, ASCII/Unicode.\n\n7. Application Layer: Interfaces directly with software applications and provides network services to applications. Example: HTTP, FTP, SMTP, DNS.', 14, '2025-04-24 09:15:00'),
(4, 3, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 1, 'A deadlock is a situation where two or more processes are unable to proceed because each is waiting for resources held by another process. This creates a circular waiting condition where none of the processes can continue execution.\n\nDeadlock Prevention Methods:\n\n1. Mutual Exclusion: If resources can be shared among processes, then deadlock can be avoided. However, some resources are inherently non-sharable (like printers).\n\n2. Hold and Wait: Process must request all resources at the beginning of execution and cannot request more while holding others. This can be implemented by requiring processes to release all resources before requesting a new set.\n\n3. No Preemption: When a process holding resources requests another resource that cannot be immediately allocated, all resources currently held by the process are preemptively released.\n\n4. Circular Wait: Establish a global ordering of resource types and require that each process requests resources in increasing order of enumeration.', 9, '2025-04-25 14:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `technical_questions`
--

CREATE TABLE `technical_questions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `upload_date` date DEFAULT current_timestamp(),
  `due_date` date DEFAULT NULL,
  `user_id` text NOT NULL,
  `display_result` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_questions`
--

INSERT INTO `technical_questions` (`id`, `title`, `description`, `upload_date`, `due_date`, `user_id`, `display_result`) VALUES
(1, 'Database Management Systems', 'Covers fundamental concepts of relational databases, SQL, and normalization.', '2025-04-06', '2025-04-13', '', 0),
(2, 'Computer Networks', 'Tests understanding of networking layers, protocols, and devices.', '2025-04-07', '2025-04-14', '', 0),
(3, 'Operating Systems', 'Questions based on process management, memory management, and file systems.', '2025-04-08', '2025-04-15', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `technical_question_items`
--

CREATE TABLE `technical_question_items` (
  `id` int(11) NOT NULL,
  `technical_id` int(11) DEFAULT NULL,
  `qno` int(11) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `marks` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_question_items`
--

INSERT INTO `technical_question_items` (`id`, `technical_id`, `qno`, `question`, `marks`) VALUES
(1, 1, 1, 'Explain the differences between primary key and foreign key in a relational database.', 10),
(2, 1, 2, 'What is normalization? Explain 1NF, 2NF, and 3NF with examples.', 15),
(3, 1, 3, 'Write an SQL query to retrieve all students with marks greater than 80.', 10),
(4, 2, 1, 'Explain the OSI model and its 7 layers.', 15),
(5, 2, 2, 'Differentiate between TCP and UDP protocols.', 10),
(6, 2, 3, 'What are IP addressing and subnetting?', 10),
(7, 3, 1, 'What is a deadlock? How can it be prevented?', 10),
(8, 3, 2, 'Compare and contrast paging and segmentation.', 10),
(9, 3, 3, 'Explain the concept of process scheduling with FCFS and Round Robin algorithms.', 15);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` char(36) NOT NULL,
  `email_id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` enum('admin','user','guest') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email_id`, `name`, `password`, `type`, `created_at`) VALUES
('dd60ebe0-bca8-48c4-a63c-34b596d58338', 'NNM24MC052@nmamit.in', 'Harshith P', '$2b$10$lSiE.wbZ2hb4yO8BiLyDJO0UXyr7ZMzkzmtnXzobzX/IYzZwkCzIC', 'user', '2025-04-24 09:45:31');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `url` text DEFAULT NULL,
  `upload_datetime` datetime DEFAULT current_timestamp(),
  `category` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `user_id`, `url`, `upload_datetime`, `category`, `title`, `description`) VALUES
(1, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '2025-04-10 09:30:00', 'Technical', 'Java Programming Fundamentals', 'A comprehensive tutorial covering Java basics including variables, loops, and object-oriented concepts.'),
(2, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 'https://www.youtube.com/watch?v=6avJHaC3C2U', '2025-04-12 14:15:00', 'Soft Skills', 'Effective Communication in Interviews', 'Learn how to communicate your ideas clearly and confidently during job interviews.'),
(3, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 'https://www.youtube.com/watch?v=XR6J8LXxCzU', '2025-04-15 16:45:00', 'Technical', 'Database Design and SQL Basics', 'Understanding relational database design and writing efficient SQL queries.'),
(4, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 'https://www.youtube.com/watch?v=tIhtpD6p6xY', '2025-04-18 11:20:00', 'Career Development', 'Resume Building Tips for IT Professionals', 'How to structure your resume to highlight technical skills and stand out to recruiters.'),
(5, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 'https://www.youtube.com/watch?v=6l3kMz3VWkk', '2025-04-20 10:00:00', 'Technical', 'Web Development Essentials', 'Learn the core technologies of modern web development: HTML, CSS, and JavaScript.'),
(6, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 'https://www.youtube.com/watch?v=9GdcB0LiWyM', '2025-04-22 13:30:00', 'Interview Prep', 'Mock Technical Interview', 'Watch a simulated technical interview with analysis of answers and common mistakes to avoid.'),
(7, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 'https://www.youtube.com/watch?v=7Utwo8TrMsQ', '2025-04-24 15:15:00', 'Soft Skills', 'Teamwork and Collaboration', 'Strategies for effective team collaboration in software development projects.'),
(8, 'dd60ebe0-bca8-48c4-a63c-34b596d58338', 'https://www.youtube.com/watch?v=i5OVx4XfVfI', '2025-04-25 09:45:00', 'Technical', 'Data Structures and Algorithms', 'An in-depth tutorial on common data structures and algorithms with Java implementations.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hr_answers`
--
ALTER TABLE `hr_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hr_question_id` (`hr_question_id`);

--
-- Indexes for table `hr_questions`
--
ALTER TABLE `hr_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hr_question_items`
--
ALTER TABLE `hr_question_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hr_question_id` (`hr_question_id`);

--
-- Indexes for table `program_answers`
--
ALTER TABLE `program_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `program_set_id` (`program_set_id`);

--
-- Indexes for table `program_questions`
--
ALTER TABLE `program_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `program_set_id` (`program_set_id`);

--
-- Indexes for table `program_sets`
--
ALTER TABLE `program_sets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_quiz_answers_quiz_id` (`quiz_id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_quiz_questions_quiz_id` (`quiz_id`);

--
-- Indexes for table `technical_answers`
--
ALTER TABLE `technical_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `technical_id` (`technical_id`);

--
-- Indexes for table `technical_questions`
--
ALTER TABLE `technical_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `technical_question_items`
--
ALTER TABLE `technical_question_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `technical_id` (`technical_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_id` (`email_id`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hr_answers`
--
ALTER TABLE `hr_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `hr_question_items`
--
ALTER TABLE `hr_question_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `program_answers`
--
ALTER TABLE `program_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `program_questions`
--
ALTER TABLE `program_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `technical_answers`
--
ALTER TABLE `technical_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `technical_question_items`
--
ALTER TABLE `technical_question_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hr_answers`
--
ALTER TABLE `hr_answers`
  ADD CONSTRAINT `hr_answers_ibfk_1` FOREIGN KEY (`hr_question_id`) REFERENCES `hr_questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hr_question_items`
--
ALTER TABLE `hr_question_items`
  ADD CONSTRAINT `hr_question_items_ibfk_1` FOREIGN KEY (`hr_question_id`) REFERENCES `hr_questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `program_answers`
--
ALTER TABLE `program_answers`
  ADD CONSTRAINT `program_answers_ibfk_1` FOREIGN KEY (`program_set_id`) REFERENCES `program_sets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `program_questions`
--
ALTER TABLE `program_questions`
  ADD CONSTRAINT `program_questions_ibfk_1` FOREIGN KEY (`program_set_id`) REFERENCES `program_sets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  ADD CONSTRAINT `fk_quiz_answers_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_answers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `fk_quiz_questions_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `technical_answers`
--
ALTER TABLE `technical_answers`
  ADD CONSTRAINT `technical_answers_ibfk_1` FOREIGN KEY (`technical_id`) REFERENCES `technical_questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `technical_question_items`
--
ALTER TABLE `technical_question_items`
  ADD CONSTRAINT `technical_question_items_ibfk_1` FOREIGN KEY (`technical_id`) REFERENCES `technical_questions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
