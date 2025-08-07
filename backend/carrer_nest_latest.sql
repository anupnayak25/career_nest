-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: database-1.cje2a088gid7.ap-south-1.rds.amazonaws.com
-- Generation Time: Aug 05, 2025 at 04:50 PM
-- Server version: 8.0.41
-- PHP Version: 7.0.33-0ubuntu0.16.04.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
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
  `id` mediumint UNSIGNED NOT NULL,
  `hr_question_id` smallint UNSIGNED NOT NULL,
  `user_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `answer` text COLLATE utf8mb4_general_ci NOT NULL,
  `marks_awarded` tinyint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_answers`
--

INSERT INTO `hr_answers` (`id`, `hr_question_id`, `user_id`, `qno`, `answer`, `marks_awarded`) VALUES
(1, 1, 1, 1, 'I am a student.', 5),
(2, 1, 87, 1, 'video-1753435533050-241501844.mp4', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hr_questions`
--

CREATE TABLE `hr_questions` (
  `id` smallint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `user_id` smallint UNSIGNED NOT NULL,
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `total_marks` smallint DEFAULT '0',
  `display_result` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_questions`
--

INSERT INTO `hr_questions` (`id`, `title`, `description`, `user_id`, `due_date`, `total_marks`, `display_result`) VALUES
(1, 'HR Set 1', 'HR Questions Set 1', 1, '0000-00-00 00:00:00', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `hr_question_items`
--

CREATE TABLE `hr_question_items` (
  `id` smallint UNSIGNED NOT NULL,
  `hr_question_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `question` text COLLATE utf8mb4_general_ci NOT NULL,
  `marks` tinyint UNSIGNED DEFAULT '0',
  `answere_url` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'NA',
  `answere_transcript` varchar(500) COLLATE utf8mb4_general_ci DEFAULT 'NA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_question_items`
--

INSERT INTO `hr_question_items` (`id`, `hr_question_id`, `qno`, `question`, `marks`, `answere_url`, `answere_transcript`) VALUES
(1, 1, 1, 'Tell me about yourself.', 5, 'NA', 'NA'),
(2, 2, 1, 'how ARE YOU', 12, 'NA', 'NA'),
(3, 3, 1, 'how are u', 12, 'NA', 'NA'),
(4, 4, 1, 'retwertewrtewrtewrt', 44, 'NA', 'NA'),
(5, 5, 1, 'sdfsdf', 34, 'NA', 'NA');

-- --------------------------------------------------------

--
-- Table structure for table `program_answers`
--

CREATE TABLE `program_answers` (
  `id` mediumint UNSIGNED NOT NULL,
  `program_set_id` smallint UNSIGNED NOT NULL,
  `user_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint NOT NULL,
  `submitted_code` text COLLATE utf8mb4_general_ci NOT NULL,
  `marks_awarded` tinyint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_answers`
--

INSERT INTO `program_answers` (`id`, `program_set_id`, `user_id`, `qno`, `submitted_code`, `marks_awarded`) VALUES
(0, 1, 87, 1, 'igigigufufjvhcgixzifzkfz', NULL),
(1, 1, 1, 1, 'def add(a, b): return a + b', 10);

-- --------------------------------------------------------

--
-- Table structure for table `program_questions`
--

CREATE TABLE `program_questions` (
  `id` smallint UNSIGNED NOT NULL,
  `program_set_id` smallint UNSIGNED DEFAULT NULL,
  `qno` tinyint NOT NULL,
  `question` text COLLATE utf8mb4_general_ci NOT NULL,
  `program_snippet` text COLLATE utf8mb4_general_ci,
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
(5, 5, 1, 'What will be the output of the following code?\n#include <stdio.h>\n\nint main() {\n    int a = 10;\n    int *p = &a;\n    printf(\"%d\", *p);\n    return 0;\n}\n', '', 2);

-- --------------------------------------------------------

--
-- Table structure for table `program_sets`
--

CREATE TABLE `program_sets` (
  `id` smallint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
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

INSERT INTO `program_sets` (`id`, `title`, `description`, `due_date`, `total_marks`, `user_id`, `display_result`) VALUES
(1, 'Programming Set 1', NULL, '0000-00-00 00:00:00', 0, 1, 1),
(5, 'C', 'Snippet', '2025-07-31 00:00:00', 5, 87, 0);

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` smallint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
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

INSERT INTO `quizzes` (`id`, `title`, `description`, `total_marks`, `user_id`, `display_result`) VALUES
(1, 'Quiz 1', 'hello world', 0, 1, 1),
(11, 'Web Development Fundamentals Quiz', 'This quiz covers basic concepts in HTML, CSS, and JavaScript. Complete all questions before the due date.', 20, 88, 1),
(14, 'Java', 'OOP\'s', 1, 87, 0);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_answers`
--

CREATE TABLE `quiz_answers` (
  `id` mediumint UNSIGNED NOT NULL,
  `quiz_id` smallint UNSIGNED NOT NULL,
  `user_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `answer` text COLLATE utf8mb4_general_ci NOT NULL,
  `marks_awarded` tinyint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_answers`
--

INSERT INTO `quiz_answers` (`id`, `quiz_id`, `user_id`, `qno`, `answer`, `marks_awarded`) VALUES
(1, 1, 1, 1, '4', 1),
(2, 1, 87, 1, '4', 10),
(3, 10, 87, 1, '\"45\"]', 0),
(4, 10, 87, 2, '\"32\"', 0),
(5, 11, 87, 1, '\"Hyper Text Markup Language\"', 0),
(6, 11, 87, 2, '\"<style>\"', 0);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` smallint UNSIGNED NOT NULL,
  `quiz_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `question` text COLLATE utf8mb4_general_ci NOT NULL,
  `marks` tinyint UNSIGNED DEFAULT '0',
  `options` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `correct_answer` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
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
(14, 18, 1, 'dsfsdf', 34, '[\"dsf\",\"dsfe\",\"dsfr\",\"sdf\"]', 'dsf');

-- --------------------------------------------------------

--
-- Table structure for table `technical_answers`
--

CREATE TABLE `technical_answers` (
  `id` mediumint UNSIGNED NOT NULL,
  `technical_id` smallint UNSIGNED NOT NULL,
  `user_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `answer` text COLLATE utf8mb4_general_ci NOT NULL,
  `marks_awarded` tinyint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_answers`
--

INSERT INTO `technical_answers` (`id`, `technical_id`, `user_id`, `qno`, `answer`, `marks_awarded`) VALUES
(1, 1, 1, 1, 'OOP stands for Object Oriented Programming.', 5),
(2, 1, 1, 1, 'dfsdfsdf', NULL),
(3, 1, 1, 1, 'dfsdfdf', NULL),
(4, 1, 87, 1, 'video-1753364429133-108112822.mp4', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `technical_questions`
--

CREATE TABLE `technical_questions` (
  `id` smallint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `due_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_marks` smallint DEFAULT '0',
  `user_id` smallint UNSIGNED NOT NULL,
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `display_result` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_questions`
--

INSERT INTO `technical_questions` (`id`, `title`, `description`, `total_marks`, `user_id`, `display_result`) VALUES
(1, 'Technical Set 1', NULL, 0, 1, 1),
(5, 'XYZ', 'asd', 6, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `technical_question_items`
--

CREATE TABLE `technical_question_items` (
  `id` smallint UNSIGNED NOT NULL,
  `technical_id` smallint UNSIGNED NOT NULL,
  `qno` tinyint UNSIGNED NOT NULL,
  `question` text COLLATE utf8mb4_general_ci NOT NULL,
  `marks` tinyint UNSIGNED DEFAULT '0',
  `answere_url` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `answere_transcript` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_question_items`
--

INSERT INTO `technical_question_items` (`id`, `technical_id`, `qno`, `question`, `marks`, `answere_url`, `answere_transcript`) VALUES
(1, 1, 1, 'Explain OOP concepts.', 5, '', ''),
(5, 5, 1, 'What is ACID properties?', 6, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` smallint UNSIGNED NOT NULL,
  `email_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'student',
  `year` tinyint NOT NULL,
  `section` tinyint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email_id`, `name`, `password`, `type`, `year`, `section`) VALUES
(1, 'nnm24mc014@nmamit.in', 'Anup Nayak', '$2b$10$HN6urhwbEEAMS6WPlc9GW.c9cZiFAK241IXOtBvMWX8Sj38A4tdw2', 'student', 0, 0),
(87, 'nnm24mc170@nmamit.in', 'vidyashree', '$2b$10$eCTJiQKBsQta7OxFjHdzhuiT5r5dxDvMOA/cjpWMwSktDg2pyLNde', 'student', 0, 0),
(88, 'nnm24mc015@nmamit.in', 'Anvith', '$2b$10$CKgLXUDRQOk9KNxSd26iCOmertenZNT0.gwHQYU59SE.MYI0XAf66', 'student', 0, 0),
(105, 'nnm24mc109@nmamit.in', 'prathvi', '$2b$10$d62wbB.ZpbBDeVbtY1APwue0kKd3kler2BrKl8S33AmPQBVrtNfmm', 'student', 0, 0),
(106, 'nnm24mc017@nmamit.in', 'Apoorva', '$2b$10$.E2PSo2YpSQZdpA0Vkn0auEYtNrNCdWhtD8bqeU9FDZbhdn64cIrO', 'student', 0, 0),
(107, 'nnm24mc052@nmamit.in', 'Harshith P', '$2b$10$G.1tqXGHBfWeiBRwDL36JujQ.g6/YOe6Gkz3EzKP/bec9h4paILjm', 'student', 0, 0),
(109, 'nnm24mc044@nmamit.in', 'dhruva', '$2b$10$itos5cXtMume8jyrh4f.se3MopZxtgDLVFQTRFI1Yc0Mi1N3UBt42', 'student', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` smallint UNSIGNED NOT NULL,
  `user_id` smallint UNSIGNED NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `user_id`, `category`, `title`, `description`, `url`) VALUES
(1, 1, 'Placement', 'Intro Video', NULL, 'http://example.com/video.mp4'),
(19, 87, 'Placement', 'placement', 'this is a video', 'video-1753201173131-63805792.mp4'),
(23, 87, 'Event', 'bb (4)', 'cc', 'video-1753201518849-44179795.mp4'),
(24, 87, 'Event', 'bb (5)', 'cc', 'video-1753201521729-506374918.mp4'),
(25, 88, 'Placement', 'sdx', 'sfadvbsfndgfhkut e5ts6rydtufkjgmn 6tu 3tewyriy6tukh erdgtfc hy264warysdh etsryjhfg5eytjfg rwhdfxgaetrdhgjbue sr fd srexdtgjhb8e 5eytuw45erydhtgf 5tesfhbew7s azeyrdfuhi46', 'video-1753502499426-586105607.mp4'),
(26, 87, 'Placement', 'NMAMIT', 'Nitte', 'video-1753791612697-493200386.mp4'),
(28, 88, 'Placement', 'Dscsc', 'Whav', 'video-1754299818271-21210455.mp4');

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
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `hr_questions`
--
ALTER TABLE `hr_questions`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `hr_question_items`
--
ALTER TABLE `hr_question_items`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `program_questions`
--
ALTER TABLE `program_questions`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `program_sets`
--
ALTER TABLE `program_sets`
  MODIFY `id` smallint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` smallint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `technical_answers`
--
ALTER TABLE `technical_answers`
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `technical_questions`
--
ALTER TABLE `technical_questions`
  MODIFY `id` smallint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `technical_question_items`
--
ALTER TABLE `technical_question_items`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65535;
--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
