-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-1e05a87d-nmamit-84a5.b.aivencloud.com:20308
-- Generation Time: Nov 16, 2025 at 06:26 PM
-- Server version: 8.0.35
-- PHP Version: 8.2.12

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
-- Stand-in structure for view `expired_quizzes`
-- (See below for the actual view)
--
CREATE TABLE `expired_quizzes` (
`created_at` timestamp
,`description` text
,`display_result` tinyint
,`due_date` timestamp
,`id` smallint
,`publish_date` timestamp
,`title` varchar(255)
,`total_marks` smallint
,`updated_date` timestamp
,`user_id` smallint unsigned
);

-- --------------------------------------------------------

--
-- Table structure for table `hr_answers`
--

CREATE TABLE `hr_answers` (
  `id` mediumint UNSIGNED NOT NULL,
  `hr_question_id` smallint UNSIGNED NOT NULL,
  `user_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `marks_awarded` tinyint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_answers`
--

INSERT INTO `hr_answers` (`id`, `hr_question_id`, `user_id`, `qno`, `answer`, `marks_awarded`, `created_at`) VALUES
(1, 1, 1, 1, 'I am a student.', 5, '2025-10-21 04:18:00'),
(2, 1, 87, 1, 'video-1753435533050-241501844.mp4', NULL, '2025-10-21 04:18:00'),
(3, 1, 65535, 1, 'video-1762604924813-644391973.mp4', NULL, '2025-11-08 12:29:06'),
(4, 1, 65535, 0, 'NA', NULL, '2025-11-08 12:29:06'),
(5, 6, 65535, 0, 'video-1762620787246-66077289.mp4', 7, '2025-11-08 16:54:14'),
(6, 17, 87, 1, 'I am Vidyashree, passionate about web dev. I interned at a startup and built features using React.', 4, '2025-11-13 04:21:55'),
(7, 17, 88, 1, 'I am Anvith. I like coding and learning algorithms. I participated in college coding contests.', 5, '2025-11-13 04:21:55'),
(8, 17, 1, 2, 'Strength: teamwork. Weakness: I sometimes over-check my work, but I use checklists to manage it.', 4, '2025-11-13 04:21:55');

-- --------------------------------------------------------

--
-- Table structure for table `hr_questions`
--

CREATE TABLE `hr_questions` (
  `id` smallint UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `user_id` smallint UNSIGNED NOT NULL,
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` timestamp NOT NULL,
  `total_marks` smallint DEFAULT '0',
  `display_result` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `analysis_status` enum('not_analysed','undergoing','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'not_analysed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_questions`
--

INSERT INTO `hr_questions` (`id`, `title`, `description`, `user_id`, `publish_date`, `due_date`, `total_marks`, `display_result`, `created_at`, `updated_date`, `analysis_status`) VALUES
(1, 'HR Set 1', 'HR Questions Set 1', 1, '2025-10-21 04:18:01', '0000-00-00 00:00:00', 0, 1, '2025-10-21 04:18:01', '2025-10-21 04:18:01', 'not_analysed'),
(16, 'HR Set - Communication Skills', 'Basic HR questions to test communication and self-presentation skills.', 65535, '2025-11-13 04:21:24', '2025-11-20 04:21:24', 20, 0, '2025-11-13 04:21:24', '2025-11-13 04:21:24', 'not_analysed');

-- --------------------------------------------------------

--
-- Table structure for table `hr_question_items`
--

CREATE TABLE `hr_question_items` (
  `id` smallint UNSIGNED NOT NULL,
  `hr_question_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `marks` tinyint UNSIGNED DEFAULT '0',
  `answer_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'NA',
  `answer_transcript` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'NA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_question_items`
--

INSERT INTO `hr_question_items` (`id`, `hr_question_id`, `qno`, `question`, `marks`, `answer_url`, `answer_transcript`) VALUES
(1, 1, 1, 'Tell me about yourself.', 5, 'NA', 'NA'),
(2, 2, 1, 'how ARE YOU', 12, 'NA', 'NA'),
(3, 3, 1, 'how are u', 12, 'NA', 'NA'),
(4, 4, 1, 'retwertewrtewrtewrt', 44, 'NA', 'NA'),
(5, 5, 1, 'sdfsdf', 34, 'NA', 'NA'),
(6, 6, 1, 'Introduce your self..?', 8, 'NA', 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview'),
(7, 7, 1, 'sdfsadfsadfasdfasdfasf', 7, 'NA', 'NA'),
(8, 8, 1, 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview', 10, 'NA', 'NA'),
(9, 8, 2, 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview', 10, 'NA', 'NA'),
(10, 10, 2, 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview', 10, 'NA', 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview'),
(11, 10, 1, 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte ', 10, 'NA', 'NA'),
(12, 11, 2, 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview', 10, 'NA', 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview'),
(13, 11, 1, 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview', 10, 'NA', 'NA'),
(14, 12, 1, 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview', 6, 'NA', 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview'),
(15, 12, 2, 'hello my name is hello world,and i am currently pursuving mca at NMAMIT nitte and i am here for the interview', 10, 'NA', 'NA'),
(16, 13, 1, 'hello world', 12, 'NA', 'NA'),
(17, 14, 1, 'hello world', 10, 'video-1762930885093-268987165.webm', 'NA'),
(18, 15, 1, 'ADCSDFSDF', 10, 'video-1762932167736-461508223.webm', ' Hello world, how do you do? Fine.'),
(19, 16, 1, 'Tell me about yourself.', 5, 'NA', 'NA'),
(20, 16, 2, 'What are your strengths and weaknesses?', 5, 'NA', 'NA'),
(21, 16, 3, 'Describe a challenging situation and how you overcame it.', 10, 'NA', 'NA'),
(22, 17, 1, 'Tell me about yourself.', 5, 'NA', 'I am Anup Nayak, final-year MCA student. I specialise in full-stack development using React and Node, and I enjoy building practical apps.'),
(23, 17, 2, 'What are your strengths and weaknesses?', 5, 'NA', 'Strengths: problem solving, quick learning. Weakness: perfectionism, improving by time-boxing tasks.'),
(24, 17, 3, 'Describe a challenging situation and how you overcame it.', 10, 'NA', 'Handled API downtime by switching to mock data, notifying stakeholders, and adding retry logic and monitoring.');

-- --------------------------------------------------------

--
-- Table structure for table `program_answers`
--

CREATE TABLE `program_answers` (
  `id` mediumint UNSIGNED NOT NULL,
  `program_set_id` smallint UNSIGNED NOT NULL,
  `user_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint NOT NULL,
  `submitted_code` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `marks_awarded` tinyint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_answers`
--

INSERT INTO `program_answers` (`id`, `program_set_id`, `user_id`, `qno`, `submitted_code`, `marks_awarded`, `created_at`) VALUES
(0, 1, 87, 1, 'igigigufufjvhcgixzifzkfz', NULL, '2025-10-21 04:18:01'),
(1, 1, 1, 1, 'def add(a, b): return a + b', 10, '2025-10-21 04:18:01'),
(2, 7, 87, 1, '/* C factorial */\n#include <stdio.h>\nlong fact(int n){ if(n<=1) return 1; return n*fact(n-1);} int main(){ int n=5; printf(\"%ld\",fact(n)); return 0; }', 9, '2025-11-13 04:21:58'),
(3, 7, 88, 2, '/* palindrome */\n#include <stdio.h>\n#include <string.h>\nint main(){ char s[]=\"radar\"; int i, j=strlen(s)-1; int ok=1; for(i=0;i<j;i++,j--){ if(s[i]!=s[j]){ok=0;break;} } printf(ok?\"YES\":\"NO\"); return 0; }', 10, '2025-11-13 04:21:58'),
(4, 7, 1, 3, '/* reverse array */\n#include <stdio.h>\nint main(){ int a[]={1,2,3,4}; for(int i=3;i>=0;i--) printf(\"%d \",a[i]); return 0; }', 5, '2025-11-13 04:21:58');

-- --------------------------------------------------------

--
-- Table structure for table `program_questions`
--

CREATE TABLE `program_questions` (
  `id` smallint UNSIGNED NOT NULL,
  `program_set_id` smallint UNSIGNED DEFAULT NULL,
  `qno` tinyint NOT NULL,
  `question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `program_snippet` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `marks` tinyint UNSIGNED DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_questions`
--

INSERT INTO `program_questions` (`id`, `program_set_id`, `qno`, `question`, `program_snippet`, `marks`) VALUES
(1, 1, 1, 'Write a function to add two numbers.', 'def add(a, b): return a + b', 0),
(2, 2, 1, 'how to write pc', '', 12),
(3, 3, 1, 'gfdhfgdhfgdh', 'fghfdghfdhdgh', 255),
(4, 4, 1, 'qrtewyrdigfukjhbfvdcs uihlkjmgfdsa', 'retrty \nqwersdtfujnb \n63wesdfgyrfd \nwesdfgh', 9),
(5, 5, 1, 'What will be the output of the following code?\n#include <stdio.h>\n\nint main() {\n    int a = 10;\n    int *p = &a;\n    printf(\"%d\", *p);\n    return 0;\n}\n', '', 2),
(6, 6, 1, 'Write a program to find factorial of a number.', '', 10),
(7, 6, 2, 'Write a program to check if a string is palindrome.', '', 10),
(8, 6, 3, 'Write a program to reverse an array.', '', 5),
(9, 7, 1, 'Write a program to find factorial of a number.', '', 10),
(10, 7, 2, 'Write a program to check if a string is palindrome.', '', 10),
(11, 7, 3, 'Write a program to reverse an array.', '', 5);

-- --------------------------------------------------------

--
-- Table structure for table `program_sets`
--

CREATE TABLE `program_sets` (
  `id` smallint NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `total_marks` smallint DEFAULT '0',
  `user_id` smallint UNSIGNED NOT NULL,
  `display_result` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_sets`
--

INSERT INTO `program_sets` (`id`, `title`, `description`, `publish_date`, `due_date`, `total_marks`, `user_id`, `display_result`, `created_at`, `updated_date`) VALUES
(1, 'Programming Set 1', NULL, '2025-10-21 04:18:01', '0000-00-00 00:00:00', 0, 1, 1, '2025-10-21 04:18:01', '2025-10-21 04:18:01'),
(5, 'C', 'Snippet', '2025-10-21 04:18:01', '2025-07-31 00:00:00', 5, 87, 0, '2025-10-21 04:18:01', '2025-10-21 04:18:01'),
(6, 'Programming Set - C Basics', 'Introductory programming problems in C.', '2025-11-13 04:21:25', '2025-11-18 04:21:25', 25, 65535, 1, '2025-11-13 04:21:25', '2025-11-13 04:21:25'),
(7, 'Programming Set - C Basics', 'Introductory programming problems in C.', '2025-11-13 04:21:57', '2025-11-18 04:21:57', 25, 65535, 0, '2025-11-13 04:21:57', '2025-11-13 04:21:57');

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` smallint NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `due_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_marks` smallint DEFAULT '0',
  `user_id` smallint UNSIGNED NOT NULL,
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `display_result` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `title`, `description`, `due_date`, `total_marks`, `user_id`, `publish_date`, `display_result`, `created_at`, `updated_date`) VALUES
(1, 'Quiz 1', 'hello world', '2025-10-21 04:18:01', 0, 1, '2025-10-21 04:18:01', 1, '2025-10-21 04:18:01', '2025-10-21 04:18:01'),
(11, 'Web Development Fundamentals Quiz', 'This quiz covers basic concepts in HTML, CSS, and JavaScript. Complete all questions before the due date.', '2025-11-13 06:52:00', 20, 88, '2025-10-21 04:18:01', 1, '2025-10-21 04:18:01', '2025-10-21 04:18:01'),
(14, 'Java', 'OOP\'s', '2025-10-21 04:18:01', 1, 87, '2025-10-21 04:18:01', 0, '2025-10-21 04:18:01', '2025-10-21 04:18:01'),
(19, 'fgsdfgsdfg', 'fdgdsfgdsfg', '2025-11-23 17:17:34', 1, 65535, '2025-10-25 00:48:00', 0, '2025-10-23 17:17:34', '2025-10-23 17:17:34'),
(20, 'Quiz - Web Development Basics', 'MCQ quiz covering HTML, CSS, and JavaScript fundamentals.', '2025-11-13 04:36:54', 20, 65535, '2025-11-13 04:21:25', 0, '2025-11-13 04:21:25', '2025-11-13 04:21:25');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_answers`
--

CREATE TABLE `quiz_answers` (
  `id` mediumint UNSIGNED NOT NULL,
  `quiz_id` smallint UNSIGNED NOT NULL,
  `user_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `marks_awarded` tinyint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_answers`
--

INSERT INTO `quiz_answers` (`id`, `quiz_id`, `user_id`, `qno`, `answer`, `marks_awarded`, `created_at`) VALUES
(1, 1, 1, 1, '4', 1, '2025-10-21 04:18:02'),
(2, 1, 87, 1, '4', 10, '2025-10-21 04:18:02'),
(3, 10, 87, 1, '\"45\"]', 0, '2025-10-21 04:18:02'),
(4, 10, 87, 2, '\"32\"', 0, '2025-10-21 04:18:02'),
(5, 11, 87, 1, '\"Hyper Text Markup Language\"', 0, '2025-10-21 04:18:02'),
(6, 11, 87, 2, '\"<style>\"', 0, '2025-10-21 04:18:02'),
(7, 1, 65535, 0, '4', 0, '2025-11-08 10:50:21'),
(8, 19, 65535, 0, 'NA', 0, '2025-11-13 04:09:31'),
(9, 21, 87, 1, 'Hyper Text Markup Language', 5, '2025-11-13 04:21:59'),
(10, 21, 87, 2, '<link>', 5, '2025-11-13 04:21:59'),
(11, 21, 88, 3, 'let', 5, '2025-11-13 04:21:59'),
(12, 21, 1, 4, 'Cascading Style Sheets', 5, '2025-11-13 04:21:59');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` smallint UNSIGNED NOT NULL,
  `quiz_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `marks` tinyint UNSIGNED DEFAULT '0',
  `options` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `correct_answer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `quiz_id`, `qno`, `question`, `marks`, `options`, `correct_answer`) VALUES
(1, 1, 1, 'What is 2+2?', 1, '2,3,4,5', '4'),
(2, 10, 2, 'dsffdsdf', 10, '[\"12\",\"23\",\"34\",\"45\"]', '23'),
(3, 10, 1, 'dfgdfs', 10, '[\"34\",\"23\",\"32\",\"25\"]', '25'),
(4, 11, 1, 'What does HTML stand for?', 10, '[\"Hyper Trainer Marking Language\",\"Hyper Text Markup Language\",\"High Text Machine Language\",\"Hyper Text Markdown Language\"]', 'Hyper Text Markup Language'),
(5, 11, 2, 'Which tag is used to link a CSS file?	', 10, '[\"<script>\",\"<style>\",\"<link>\",\"<css>\"]', '<link>'),
(6, 12, 2, 'What is the output of System.out.println(10 + 20 + \"Java\")?', 13, '[\"30Java\",\"Java30\",\"1020Java\",\"Compilation Error\"]', '30Java'),
(7, 12, 1, 'Which keyword is used to define a class in Java?', 10, '[\"define\",\"class\",\"public\",\"new\"]', 'class'),
(8, 13, 1, 'In which year was JavaScript created?', 12, '[\"1995\",\"2005\",\"1989\",\"2000\"]', '1995'),
(9, 14, 1, 'Which of the following is not a pillar of Object-Oriented Programming?', 1, '[\"Inheritance\",\"Encapsulation\",\"Compilation\",\"Polymorphism\"]', 'Compilation'),
(10, 15, 1, 'retertewte', 35, '[\"rtt\",\"ertet\",\"ertewrt\",\"tert\"]', 'rtt'),
(11, 15, 2, 'fsdgsdfgs', 34, '[\"dfsg\",\"vcb\",\"df\",\"gh\"]', 'df'),
(12, 16, 1, 'gfhfdghfgh', 255, '[\"fgh\",\"fghrty\",\"gfh\",\"rty\"]', 'rty'),
(13, 17, 1, 'rtertwert', 34, '[\"ret\",\"456\",\"fdg\",\"gh\"]', 'ret'),
(14, 18, 1, 'dsfsdf', 34, '[\"dsf\",\"dsfe\",\"dsfr\",\"sdf\"]', 'dsf'),
(15, 19, 1, 'dfgsdfgsdfgdfsg', 1, '[\"sdfgfddfg\",\"dsfgdsfg\",\"fgdfbdf\",\"vbfgdfg\"]', 'sdfgfddfg'),
(16, 20, 1, 'What does HTML stand for?', 5, '[\"Hyper Text Markup Language\",\"High Text Machine Language\",\"Hyper Text Markdown Language\",\"None of the above\"]', 'Hyper Text Markup Language'),
(17, 20, 2, 'Which tag is used to link a CSS file?', 5, '[\"<link>\",\"<style>\",\"<css>\",\"<script>\"]', '<link>'),
(18, 20, 3, 'Which keyword is used to declare a variable in JavaScript?', 5, '[\"var\",\"int\",\"let\",\"define\"]', 'let'),
(19, 20, 4, 'What does CSS stand for?', 5, '[\"Cascading Style Sheets\",\"Colorful Style Syntax\",\"Computer Style Sheet\",\"Creative Style System\"]', 'Cascading Style Sheets'),
(20, 21, 1, 'What does HTML stand for?', 5, '[\"Hyper Text Markup Language\",\"High Text Machine Language\",\"Hyper Text Markdown Language\",\"None of the above\"]', 'Hyper Text Markup Language'),
(21, 21, 2, 'Which tag is used to link a CSS file?', 5, '[\"<link>\",\"<style>\",\"<css>\",\"<script>\"]', '<link>'),
(22, 21, 3, 'Which keyword is used to declare a variable in JavaScript?', 5, '[\"var\",\"int\",\"let\",\"define\"]', 'let'),
(23, 21, 4, 'What does CSS stand for?', 5, '[\"Cascading Style Sheets\",\"Colorful Style Syntax\",\"Computer Style Sheet\",\"Creative Style System\"]', 'Cascading Style Sheets');

-- --------------------------------------------------------

--
-- Table structure for table `technical_answers`
--

CREATE TABLE `technical_answers` (
  `id` mediumint UNSIGNED NOT NULL,
  `technical_id` smallint UNSIGNED NOT NULL,
  `user_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `marks_awarded` tinyint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_answers`
--

INSERT INTO `technical_answers` (`id`, `technical_id`, `user_id`, `qno`, `answer`, `marks_awarded`, `created_at`) VALUES
(1, 1, 1, 1, 'OOP stands for Object Oriented Programming.', 5, '2025-10-21 04:18:02'),
(2, 1, 1, 1, 'dfsdfsdf', NULL, '2025-10-21 04:18:02'),
(3, 1, 1, 1, 'dfsdfdf', NULL, '2025-10-21 04:18:02'),
(4, 1, 87, 1, 'video-1753364429133-108112822.mp4', NULL, '2025-10-21 04:18:02'),
(5, 1, 65535, 0, 'video-1762608496770-956473159.mp4', NULL, '2025-11-08 13:41:29'),
(6, 5, 65535, 0, 'video-1762609425655-61114142.mp4', NULL, '2025-11-08 13:45:14'),
(7, 7, 65535, 0, 'NA', NULL, '2025-11-13 01:57:50'),
(8, 7, 65535, 1, 'NA', NULL, '2025-11-13 01:57:50'),
(9, 9, 87, 1, 'OOPs are Encapsulation, Inheritance, Polymorphism, Abstraction. Encapsulation hides data and provides getters/setters.', 8, '2025-11-13 04:21:56'),
(10, 9, 88, 2, 'Interface has only abstract methods (mostly) and multiple inheritance of type, abstract class can have implemented methods.', 9, '2025-11-13 04:21:56'),
(11, 9, 1, 3, 'Collections are data structures: List (ArrayList), Set (HashSet), Map (HashMap).', 9, '2025-11-13 04:21:56');

-- --------------------------------------------------------

--
-- Table structure for table `technical_questions`
--

CREATE TABLE `technical_questions` (
  `id` smallint NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `due_date` timestamp NOT NULL,
  `total_marks` smallint DEFAULT '0',
  `user_id` smallint UNSIGNED NOT NULL,
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `display_result` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `analysis_status` enum('not_analysed','undergoing','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'not_analysed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_questions`
--

INSERT INTO `technical_questions` (`id`, `title`, `description`, `due_date`, `total_marks`, `user_id`, `publish_date`, `display_result`, `created_at`, `updated_date`, `analysis_status`) VALUES
(1, 'Technical Set 1', NULL, '2025-10-21 04:18:02', 0, 1, '2025-10-21 04:18:02', 1, '2025-10-21 04:18:02', '2025-10-21 04:18:02', 'not_analysed'),
(5, 'XYZ', 'asd', '2025-10-21 04:18:02', 6, 1, '2025-10-21 04:18:02', 0, '2025-10-21 04:18:02', '2025-10-21 04:18:02', 'not_analysed'),
(7, 'hello world', 'hello world', '2025-11-14 14:09:00', 20, 65535, '2025-11-11 22:09:00', 0, '2025-11-11 16:40:43', '2025-11-11 16:40:43', 'not_analysed'),
(9, 'Technical Set - Core Java', 'A set of technical questions to test fundamental Java programming knowledge.', '2025-11-23 04:21:55', 30, 65535, '2025-11-13 04:21:55', 0, '2025-11-13 04:21:55', '2025-11-13 04:21:55', 'not_analysed');

-- --------------------------------------------------------

--
-- Table structure for table `technical_question_items`
--

CREATE TABLE `technical_question_items` (
  `id` smallint UNSIGNED NOT NULL,
  `technical_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `marks` tinyint UNSIGNED DEFAULT '0',
  `answer_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `answer_transcript` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_question_items`
--

INSERT INTO `technical_question_items` (`id`, `technical_id`, `qno`, `question`, `marks`, `answer_url`, `answer_transcript`) VALUES
(1, 1, 1, 'Explain OOP concepts.', 5, '', ''),
(5, 5, 1, 'What is ACID properties?', 6, '', ''),
(7, 7, 1, 'if any variable is taking 1 bite it ocpuys the indices which are multiple of 1.\nsame applies to all variables.\nFinal ans will always be the multiple of largest variable ', 10, 'NA', 'NA'),
(8, 7, 2, 'if any variable is taking 1 bite it ocpuys the indices which are multiple of 1.\nsame applies to all variables.\nFinal ans will always be the multiple of largest variable ', 10, 'NA', 'NA'),
(12, 9, 1, 'Explain the concept of OOPs in Java.', 10, 'NA', 'OOP: Encapsulation, Abstraction, Inheritance, Polymorphism. Example: class Person { private String name; public String getName() { return name; } }'),
(13, 9, 2, 'What is the difference between an interface and an abstract class?', 10, 'NA', 'Abstract class can have state and implemented methods; interface declares contracts (Java 8+ has default methods). Use abstract where shared implementation exists.'),
(14, 9, 3, 'What are Java Collections? Give examples.', 10, 'NA', 'Collections framework: List (ArrayList), Set (HashSet), Map (HashMap). Use ArrayList for ordered lists, HashMap for key-value maps.');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` smallint UNSIGNED NOT NULL,
  `email_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'student',
  `year` tinyint NOT NULL DEFAULT '0',
  `section` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email_id`, `name`, `password`, `type`, `year`, `section`, `created_at`) VALUES
(87, 'nnm24mc170@nmamit.in', 'vidyashree', '$2b$10$eCTJiQKBsQta7OxFjHdzhuiT5r5dxDvMOA/cjpWMwSktDg2pyLNde', 'student', 0, 0, '2025-10-21 04:18:02'),
(88, 'nnm24mc015@nmamit.in', 'Anvith', '$2b$10$CKgLXUDRQOk9KNxSd26iCOmertenZNT0.gwHQYU59SE.MYI0XAf66', 'student', 0, 0, '2025-10-21 04:18:02'),
(105, 'nnm24mc109@nmamit.in', 'prathvi', '$2b$10$d62wbB.ZpbBDeVbtY1APwue0kKd3kler2BrKl8S33AmPQBVrtNfmm', 'student', 0, 0, '2025-10-21 04:18:02'),
(106, 'nnm24mc017@nmamit.in', 'Apoorva', '$2b$10$.E2PSo2YpSQZdpA0Vkn0auEYtNrNCdWhtD8bqeU9FDZbhdn64cIrO', 'student', 0, 0, '2025-10-21 04:18:02'),
(107, 'nnm24mc052@nmamit.in', 'Harshith P', '$2b$10$G.1tqXGHBfWeiBRwDL36JujQ.g6/YOe6Gkz3EzKP/bec9h4paILjm', 'student', 0, 0, '2025-10-21 04:18:02'),
(109, 'nnm24mc044@nmamit.in', 'dhruva', '$2b$10$itos5cXtMume8jyrh4f.se3MopZxtgDLVFQTRFI1Yc0Mi1N3UBt42', 'student', 0, 0, '2025-10-21 04:18:02'),
(65535, 'nnm24mc014@nmamit.in', 'Anup Nayak', '$2b$10$OJM.VLM5jt8bRpwMyhrXTOg4VoO1WA5Aoqu2iaFxxzCFzZpnKkz.e', 'student', 0, 0, '2025-10-23 17:07:04');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` smallint UNSIGNED NOT NULL,
  `user_id` smallint UNSIGNED NOT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `user_id`, `category`, `title`, `description`, `url`, `publish_date`, `created_at`, `updated_at`) VALUES
(29, 65535, 'Event', 'hello world', 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\n\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\n\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\n\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\n\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.', 'video-1762616511289-664160664.mp4', '2025-11-08 15:41:52', '2025-11-08 15:41:52', '2025-11-08 15:41:52'),
(30, 65535, 'Placement', 'Ace Your Interview: Tips & Tricks', 'A complete guide on how to prepare for campus placement interviews with real-world examples.', 'video-1762957676919-86211749.mp4', '2025-11-12 14:27:57', '2025-11-12 14:27:57', '2025-11-12 14:27:57'),
(31, 65535, 'Placement', 'Resume Building Workshop', 'Learn how to craft an impressive resume that stands out to recruiters.', 'video-1762957721571-979192194.mp4', '2025-11-12 14:28:42', '2025-11-12 14:28:42', '2025-11-12 14:28:42'),
(32, 65535, 'Placement', 'Mock Interview Session', 'Watch a live mock interview conducted by HR professionals.', 'video-1762957771681-712413353.mp4', '2025-11-12 14:29:32', '2025-11-12 14:29:32', '2025-11-12 14:29:32'),
(33, 65535, 'Placement', 'Technical Round Preparation', 'Key technical concepts and frequently asked coding interview questions.\', \'video-1750000000004-placement.mp4', 'video-1762957813871-649375667.mp4', '2025-11-12 14:30:13', '2025-11-12 14:30:13', '2025-11-12 14:30:13'),
(34, 65535, 'Event', 'TechFest 2025 Highlights', 'A recap of the biggest annual college tech event featuring innovative projects and competitions.', 'video-1762958034395-584074917.mp4', '2025-11-12 14:33:54', '2025-11-12 14:33:54', '2025-11-12 14:33:54'),
(35, 65535, 'Event', 'Coding Marathon', 'Behind the scenes of the 24-hour inter-college coding competition.', 'video-1762958073356-402621189.mp4', '2025-11-12 14:34:33', '2025-11-12 14:34:33', '2025-11-12 14:34:33'),
(36, 65535, 'Event', 'Placement Drive Orientation', 'Event introducing the upcoming placement drives for final-year students.', 'video-1762958115104-556927142.mp4', '2025-11-12 14:35:15', '2025-11-12 14:35:15', '2025-11-12 14:35:15'),
(37, 65535, 'Event', 'Career Talk by Alumni', 'NMAMIT alumni share their career journey and advice to students.', 'video-1762960393259-291438417.mp4', '2025-11-12 15:13:15', '2025-11-12 15:13:15', '2025-11-12 15:13:15');

-- --------------------------------------------------------

--
-- Structure for view `expired_quizzes`
--
DROP TABLE IF EXISTS `expired_quizzes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`avnadmin`@`%` SQL SECURITY DEFINER VIEW `expired_quizzes`  AS SELECT `quizzes`.`id` AS `id`, `quizzes`.`title` AS `title`, `quizzes`.`description` AS `description`, `quizzes`.`due_date` AS `due_date`, `quizzes`.`total_marks` AS `total_marks`, `quizzes`.`user_id` AS `user_id`, `quizzes`.`publish_date` AS `publish_date`, `quizzes`.`display_result` AS `display_result`, `quizzes`.`created_at` AS `created_at`, `quizzes`.`updated_date` AS `updated_date` FROM `quizzes` WHERE ((`quizzes`.`due_date` < now()) AND (`quizzes`.`display_result` = 1)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hr_answers`
--
ALTER TABLE `hr_answers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hr_questions`
--
ALTER TABLE `hr_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hr_question_items`
--
ALTER TABLE `hr_question_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `program_answers`
--
ALTER TABLE `program_answers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `program_questions`
--
ALTER TABLE `program_questions`
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `technical_answers`
--
ALTER TABLE `technical_answers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `technical_questions`
--
ALTER TABLE `technical_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `technical_question_items`
--
ALTER TABLE `technical_question_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `hr_questions`
--
ALTER TABLE `hr_questions`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `hr_question_items`
--
ALTER TABLE `hr_question_items`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `program_answers`
--
ALTER TABLE `program_answers`
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `program_questions`
--
ALTER TABLE `program_questions`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `program_sets`
--
ALTER TABLE `program_sets`
  MODIFY `id` smallint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` smallint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `technical_answers`
--
ALTER TABLE `technical_answers`
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `technical_questions`
--
ALTER TABLE `technical_questions`
  MODIFY `id` smallint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `technical_question_items`
--
ALTER TABLE `technical_question_items`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65535;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
