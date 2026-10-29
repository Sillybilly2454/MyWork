-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2024 at 03:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `status` enum('in','out') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attendance_id`, `student_id`, `date`, `time`, `reason`, `status`) VALUES
(152, 31, '2024-11-05', '09:51:00', 'Late', 'in');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `class_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `semester` enum('1','2') DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`class_id`, `name`, `semester`, `year`, `is_active`) VALUES
(6, 'PC Class - 12F1 1', '2', '2024', 1),
(7, 'Computer Science T (V) 1', '2', '2024', 1),
(8, 'Mathematical Methods 1', '2', '2024', 1),
(9, 'Engineering T 1', '2', '2024', 1),
(10, 'Information Technology T (V) 1', '2', '2024', 1),
(11, 'English 2', '2', '2024', 1),
(12, 'Study 5 1', '2', '2024', 1),
(13, 'Study 7 1', '2', '2024', 1),
(14, 'Assembly - 12F1 9', '2', '2024', 1),
(15, '12W2 1', '2', '2024', 1),
(16, 'Study 2 1', '2', '2024', 1),
(17, '11 Mathematical Applications 04', '2', '2024', 1),
(18, 'Mathematical Applications 1', '2', '2024', 1),
(19, 'Business Services A (V) 1', '2', '2024', 1),
(20, 'PC Class - 12E2 1', '2', '2024', 1),
(21, 'English 4', '2', '2024', 1),
(22, 'Design Technologies T 1', '2', '2024', 1),
(23, 'Geography T 1', '2', '2024', 1),
(24, 'Assembly - I12E2 6', '2', '2024', 1),
(25, 'Furniture Making (V) 2', '2', '2024', 1),
(28, 'Photography A 1', '2', '2024', 1),
(29, 'Study 3 1', '2', '2024', 1),
(32, 'PC Class - 12W3 1', '2', '2024', 1),
(33, 'Assembly - I12W3 2', '2', '2024', 1),
(34, 'Essential English 2', '2', '2024', 1),
(35, 'Media A 1', '2', '2024', 1),
(36, 'Social and Community Work A 1', '2', '2024', 1),
(37, 'PC Class - 12A2', '2', '2024', 1),
(38, 'Religious Studies T 10', '2', '2024', 1),
(39, 'Japanese - Continuing 1', '2', '2024', 1),
(40, 'Literature 1', '2', '2024', 1),
(41, 'Mathematical Methods 2', '2', '2024', 1),
(42, 'Assembly - I12A2 2', '2', '2024', 1),
(43, 'Chemistry 1', '2', '2024', 1),
(44, 'AST and Mentoring R 1', '2', '2024', 1),
(45, 'PC Class - 12W1 1', '2', '2024', 1),
(46, 'Physics 1', '2', '2024', 1),
(47, 'Specialist Methods 2', '2', '2024', 1),
(48, 'Assembly - I12W1 10', '2', '2024', 1),
(49, 'Assembly - I12W2 11', '2', '2024', 1),
(50, 'Pc Class - 12E3 1', '2', '2024', 1),
(51, 'Assembly - I12E3 7', '2', '2024', 1),
(52, 'Study 4 1', '2', '2024', 1),
(53, 'Study 1 1', '2', '2024', 1),
(54, 'Essential Mathematics 3', '2', '2024', 1);

-- --------------------------------------------------------

--
-- Table structure for table `class_periods`
--

CREATE TABLE `class_periods` (
  `id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  `day_of_week` tinyint(4) DEFAULT NULL,
  `period` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_periods`
--

INSERT INTO `class_periods` (`id`, `class_id`, `room`, `day_of_week`, `period`) VALUES
(44, 6, 'J5', 1, 0),
(45, 6, 'J5', 2, 0),
(46, 6, 'J5', 3, 0),
(47, 6, 'J5', 4, 0),
(48, 6, 'J5', 5, 0),
(49, 6, 'J5', 6, 0),
(50, 6, 'J5', 7, 0),
(51, 6, 'J5', 8, 0),
(52, 6, 'J5', 9, 0),
(53, 6, 'J5', 10, 0),
(54, 7, 'FAB', 1, 2),
(55, 7, 'FAB', 2, 2),
(57, 7, 'FAB', 5, 2),
(58, 7, 'FAB', 4, 1),
(59, 7, 'FAB', 7, 5),
(60, 7, 'FAB', 9, 4),
(61, 7, 'FAB', 9, 3),
(62, 8, 'B1', 1, 3),
(63, 8, 'B1', 2, 1),
(64, 8, 'B1', 4, 5),
(65, 8, 'B1', 6, 2),
(66, 8, 'B1', 8, 3),
(67, 8, 'B1', 8, 4),
(68, 8, 'B1', 10, 4),
(69, 9, 'Stem1', 1, 4),
(70, 9, 'Stem1', 3, 5),
(71, 9, 'Stem1', 4, 2),
(72, 9, 'Stem1', 6, 3),
(73, 9, 'Stem1', 6, 4),
(74, 9, 'Stem1', 10, 1),
(75, 9, 'Stem1', 9, 1),
(76, 10, 'Q2', 1, 5),
(77, 10, 'Q1', 3, 1),
(78, 10, 'Q1', 5, 1),
(79, 10, 'Q2', 7, 3),
(80, 10, 'Q2', 7, 4),
(81, 10, 'Q2', 8, 5),
(82, 10, 'Q2', 10, 2),
(83, 11, 'B5', 2, 4),
(84, 11, 'B5', 2, 3),
(85, 11, 'B5', 3, 2),
(86, 11, 'B5', 5, 4),
(87, 11, 'B5', 7, 1),
(88, 11, 'B5', 10, 5),
(89, 11, 'B5', 9, 2),
(90, 12, 'Study', 1, 1),
(92, 12, 'Study', 3, 4),
(93, 12, 'Study', 3, 3),
(94, 12, 'Study', 5, 5),
(95, 12, 'Study', 6, 1),
(96, 12, 'Study', 8, 2),
(97, 12, 'Study', 9, 5),
(98, 13, 'Study', 2, 5),
(99, 13, 'Study', 4, 3),
(100, 13, 'Study', 4, 4),
(101, 13, 'Study', 5, 3),
(102, 13, 'Study', 6, 5),
(103, 13, 'Study', 7, 2),
(104, 13, 'Study', 10, 3),
(105, 14, 'GYM', 8, 1),
(106, 15, 'K5', 1, 0),
(119, 15, 'K5', 2, 0),
(120, 15, 'K5', 3, 0),
(121, 15, 'K5', 4, 0),
(122, 15, 'K5', 5, 0),
(123, 15, 'K5', 6, 0),
(124, 15, 'K5', 7, 0),
(125, 15, 'K5', 8, 0),
(126, 15, 'K5', 9, 0),
(127, 15, 'K5', 10, 0),
(128, 16, 'Study', 1, 2),
(129, 16, 'Study', 2, 2),
(130, 16, 'Study', 4, 1),
(131, 16, 'Study', 5, 2),
(132, 16, 'Study', 7, 5),
(135, 17, 'B4', 1, 4),
(138, 17, 'B4', 6, 4),
(139, 17, 'B4', 6, 3),
(142, 18, 'B4', 2, 5),
(144, 18, 'B4', 5, 3),
(145, 18, 'B4', 6, 5),
(148, 18, 'B4', 10, 3),
(149, 18, 'B4', 4, 4),
(150, 18, 'B4', 4, 3),
(151, 19, 'F7', 1, 5),
(153, 19, 'F7', 3, 1),
(154, 19, 'F7', 5, 1),
(155, 19, 'F7', 7, 3),
(156, 19, 'F7', 7, 4),
(157, 19, 'F7', 8, 5),
(158, 19, 'F7', 10, 2),
(159, 17, 'B4', 4, 2),
(160, 17, 'B4', 3, 5),
(161, 18, 'B4', 7, 2),
(162, 17, 'B4', 9, 1),
(163, 17, 'B4', 10, 1),
(164, 16, 'Study', 9, 3),
(165, 16, 'Study', 9, 4),
(166, 24, 'GYM', 8, 1),
(167, 23, 'K4', 2, 5),
(168, 23, 'K4', 4, 4),
(169, 23, 'K4', 4, 3),
(170, 23, 'K4', 5, 3),
(171, 23, 'K4', 6, 5),
(173, 23, 'K4', 7, 2),
(174, 23, 'K4', 10, 3),
(175, 22, 'Stem2', 2, 4),
(176, 22, 'Stem2', 2, 3),
(177, 22, 'Stem2', 3, 2),
(178, 22, 'Stem2', 5, 4),
(179, 22, 'Stem2', 7, 1),
(180, 22, 'Stem2', 9, 2),
(181, 22, 'Stem2', 10, 5),
(182, 21, 'C5', 1, 5),
(183, 21, 'C5', 3, 1),
(184, 21, 'C5', 5, 1),
(185, 21, 'C5', 7, 4),
(186, 21, 'C5', 7, 3),
(187, 21, 'C5', 8, 5),
(188, 21, 'C5', 10, 2),
(189, 20, 'K2', 1, 0),
(190, 20, 'K2', 2, 0),
(191, 20, 'K2', 3, 0),
(192, 20, 'K2', 4, 0),
(193, 20, 'K2', 5, 0),
(194, 20, 'K2', 6, 0),
(195, 20, 'K2', 7, 0),
(196, 20, 'K2', 8, 0),
(197, 20, 'K2', 9, 0),
(198, 20, 'K2', 10, 0),
(199, 25, 'Tech1', 1, 2),
(200, 25, 'Tech1', 2, 2),
(201, 25, 'Tech1', 4, 1),
(202, 25, 'Tech1', 5, 2),
(203, 25, 'Tech1', 7, 5),
(204, 25, 'Tech1', 9, 4),
(205, 25, 'Tech1', 9, 3),
(206, 28, 'VAStudio1', 1, 3),
(207, 28, 'VAStudio1', 2, 1),
(208, 28, 'VAStudio1', 4, 5),
(209, 28, 'VAStudio1', 6, 2),
(210, 28, 'VAStudio1', 8, 3),
(211, 28, 'VAStudio1', 8, 4),
(212, 28, 'VAStudio1', 10, 4),
(213, 29, 'Study', 1, 5),
(214, 29, 'Study', 3, 1),
(215, 29, 'Study', 5, 1),
(216, 29, 'Study', 7, 3),
(217, 29, 'Study', 7, 4),
(218, 29, 'Study', 8, 5),
(219, 29, 'Study', 10, 2),
(220, 33, 'GYM', 8, 1),
(221, 32, 'K5', 1, 0),
(222, 32, 'K5', 2, 0),
(223, 32, 'K5', 3, 0),
(224, 32, 'K5', 4, 0),
(225, 32, 'K5', 5, 0),
(226, 32, 'K5', 6, 0),
(227, 32, 'K5', 7, 0),
(228, 32, 'K5', 8, 0),
(229, 32, 'K5', 9, 0),
(230, 32, 'K5', 10, 0),
(231, 34, 'K1', 2, 4),
(232, 34, 'K1', 2, 3),
(233, 34, 'K1', 3, 2),
(234, 34, 'K1', 5, 4),
(235, 34, 'K1', 7, 1),
(236, 34, 'K1', 10, 5),
(237, 34, 'K1', 9, 2),
(238, 35, 'FAB', 2, 5),
(239, 35, 'FAB', 4, 3),
(240, 35, 'FAB', 4, 4),
(241, 35, 'FAB', 5, 3),
(242, 35, 'FAB', 6, 5),
(243, 35, 'FAB', 7, 2),
(244, 35, 'FAB', 10, 3),
(245, 36, 'VAStudio1', 1, 4),
(246, 36, 'VAStudio1', 3, 5),
(247, 36, 'VAStudio1', 4, 2),
(248, 36, 'VAStudio1', 6, 3),
(249, 36, 'VAStudio1', 6, 4),
(250, 36, 'VAStudio1', 9, 1),
(251, 36, 'VAStudio1', 10, 1),
(252, 37, 'J2', 1, 0),
(253, 37, 'J2', 2, 0),
(254, 37, 'J2', 3, 0),
(255, 37, 'J2', 4, 0),
(256, 37, 'J2', 5, 0),
(257, 37, 'J2', 6, 0),
(258, 37, 'J2', 7, 0),
(259, 37, 'J2', 8, 0),
(260, 37, 'J2', 9, 0),
(261, 37, 'J2', 10, 0),
(262, 38, 'C6', 1, 1),
(263, 38, 'C6', 3, 4),
(264, 38, 'C6', 3, 3),
(265, 38, 'C6', 5, 5),
(266, 38, 'C6', 6, 1),
(267, 38, 'C6', 8, 2),
(268, 38, 'C6', 9, 5),
(269, 39, 'Q2', 1, 3),
(270, 39, 'Q2', 2, 1),
(271, 39, 'Q2', 4, 5),
(272, 39, 'Q2', 6, 2),
(273, 39, 'Q2', 8, 3),
(274, 39, 'Q2', 8, 4),
(275, 39, 'Q2', 10, 4),
(276, 40, 'K2', 1, 4),
(277, 40, 'K2', 3, 5),
(278, 40, 'K2', 4, 2),
(279, 40, 'K2', 6, 3),
(280, 40, 'K2', 6, 4),
(282, 40, 'K2', 10, 1),
(283, 40, 'K2', 9, 1),
(284, 41, 'B6', 2, 4),
(285, 41, 'B6', 2, 3),
(286, 41, 'B6', 3, 2),
(287, 41, 'B6', 5, 4),
(288, 41, 'B6', 7, 1),
(289, 41, 'B6', 9, 2),
(290, 41, 'B6', 10, 5),
(291, 42, 'GYM', 8, 1),
(292, 43, 'J5', 1, 4),
(293, 43, 'J5', 3, 5),
(294, 43, 'J5', 4, 2),
(295, 43, 'J5', 6, 4),
(296, 43, 'J5', 6, 3),
(297, 43, 'J5', 9, 1),
(298, 43, 'J5', 10, 1),
(299, 44, 'Q2', 1, 1),
(300, 44, 'Q2', 3, 3),
(301, 44, 'Q2', 3, 4),
(302, 44, 'Q2', 5, 5),
(303, 44, 'Q2', 6, 1),
(304, 44, 'Q2', 9, 5),
(305, 44, 'Q2', 8, 2),
(306, 45, 'K4', 1, 0),
(307, 45, 'K4', 2, 0),
(308, 45, 'K4', 3, 0),
(309, 45, 'K4', 4, 0),
(310, 45, 'K4', 5, 0),
(311, 45, 'K4', 6, 0),
(312, 45, 'K4', 7, 0),
(313, 45, 'K4', 8, 0),
(314, 45, 'K4', 9, 0),
(315, 45, 'K4', 10, 0),
(317, 46, 'J4', 2, 5),
(318, 46, 'J4', 4, 3),
(319, 46, 'J4', 4, 4),
(320, 46, 'J4', 5, 3),
(321, 46, 'J4', 6, 5),
(322, 46, 'J4', 7, 2),
(323, 46, 'J4', 10, 3),
(324, 47, 'B6', 1, 3),
(325, 47, 'B6', 2, 1),
(326, 47, 'B6', 4, 5),
(327, 47, 'B6', 6, 2),
(328, 47, 'B6', 8, 4),
(329, 47, 'B6', 8, 3),
(330, 47, 'B6', 10, 4),
(331, 48, 'GYM', 8, 1),
(332, 49, 'GYM', 8, 1),
(333, 50, 'K3', 1, 0),
(334, 50, 'K3', 2, 0),
(335, 50, 'K3', 3, 0),
(336, 50, 'K3', 4, 0),
(337, 50, 'K3', 5, 0),
(338, 50, 'K3', 6, 0),
(339, 50, 'K3', 7, 0),
(340, 50, 'K3', 8, 0),
(341, 50, 'K3', 9, 0),
(342, 50, 'K3', 10, 0),
(343, 51, 'GYM', 8, 1),
(344, 52, 'Study', 1, 4),
(346, 52, 'Study', 3, 5),
(347, 52, 'Study', 4, 2),
(348, 52, 'Study', 6, 3),
(349, 52, 'Study', 6, 4),
(350, 52, 'Study', 9, 1),
(351, 52, 'Study', 10, 1),
(352, 53, 'Study', 1, 3),
(353, 53, 'Study', 2, 1),
(354, 53, 'Study', 4, 5),
(355, 53, 'Study', 6, 2),
(356, 53, 'Study', 8, 4),
(357, 53, 'Study', 8, 3),
(358, 53, 'Study', 10, 4),
(359, 54, 'B7', 1, 1),
(360, 54, 'B7', 3, 4),
(361, 54, 'B7', 3, 3),
(362, 54, 'B7', 5, 5),
(363, 54, 'B7', 6, 1),
(364, 54, 'B7', 8, 2),
(365, 54, 'B7', 9, 5);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key_name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key_name`, `value`) VALUES
(1, 'system_password', '$2y$10$IQEXlxn6xZ9pAkTmOHvVI.V.BqOFiChJXjcmSBcGaomkJxnbh2Zze');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `class_ids` varchar(255) DEFAULT NULL,
  `can_sign_out` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `name`, `is_active`, `class_ids`, `can_sign_out`) VALUES
(1, 'Student 001', 1, '6,7,9,10,11,12,13,14,8', 1),
(2, 'Student 002', 1, '8,9,10', 1),
(3, 'Student 003', 1, '10,7', 1),
(7, 'Student 004', 1, '13', 1),
(31, 'Student 005', 1, '11,44,43,16,29,48,47,46,45', 1),
(33, 'Student 006', 1, '7', 1),
(38, 'Student 007', 1, '19,18,17,16,15,12,11,8,49', 1),
(40, 'Student 008', 1, '16,12,8,24,23,22,21,20,9', 1),
(42, 'Student 009', 1, NULL, 1),
(45, 'Student 010', 0, NULL, 1),
(46, 'Student 011', 1, '12,33,32,29,28,25,35,34,36', 1),
(49, 'Student 012', 1, '41,40,39,38,37,29,13,7,42', 1),
(50, 'Student 013', 1, '7,10,11,13,54,53,52,51,50', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `rfid` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `student_id`, `rfid`, `is_admin`) VALUES
(1, 'student1', '$2y$10$/l.HPJYLkY6B9rtTB7VFTOLUYPM9/3l0wPBTLNpYfSxCVBfeBnhby', 1, '4568e5f396180', 0),
(2, 'student2', '$2y$10$5VAjzELpzNVrPv8dNNBfSOP.ozUqWScVfe65TyEH7gEbcjdP5pDKW', 2, '45a9c5f396180', 0),
(3, 'admin', '$2y$10$ojvNW5BuAAwfkfS2qbyEEe4mbah7t/ujyMO.xv4Bc5M/Fwtm8OUXm', NULL, '53235e1b', 1),
(4, 'student3', '$2y$10$sSKOClhr9Mz8gwmIBZyOxeqkq7EMHZh07EBiNswAK65WA0qGXp1yC', 3, '4461c60396180', 0),
(7, 'student4', '$2y$10$WDYEObQIOgfqphBy9eJckeLhmYPuTn/0ZDPCRzeagv/97VK5ojA6W', 7, '43a5a5f396180', 0),
(44, 'student5', '$2y$10$HVU5wOYvJRHdPAHuS3.zA.98b80hW7T7xuZpfj5t.MLeOiTJcc4Ha', 31, '47df65e396180', 0),
(50, 'student6', '$2y$10$GCrKYEZLtV4pWp0YOT8fG.DtaIG4wm3XWYrvORbJqFLfMdhDu7yUS', 33, '4c6635f396180', 0),
(52, 'student7', '$2y$10$Ymh7UYYX8O7RBtkgs6iAxeqt3TzPu6m17OWpjP81OQtbytwqyqOs6', 38, '4932160396181', 0),
(53, 'student8', '$2y$10$nbr3bxkws94NUJIKyuj1Cer2gfHV4VBnfqWt3HrXcppB9qiG6tkni', 40, '4d21c60396180', 0),
(54, 'student9', '$2y$10$zbUvS1YqwBRIp92EUo9veeQlSg4GH5AbjkzepBuR6PB7lXKuUQN.2', 42, '447545e396180', 0),
(61, 'student12', '$2y$10$hCY7QdELRtW0/2/FnZLzRuuhVt4F3Xdj4wuKzFRYmXDaYFOpAcJWa', 49, NULL, 0),
(62, 'student11', '$2y$10$K4TNAR8PQpIjyu9yYo9ieuhetK.03nSTEm6bmxs3Y/mOuaK93T0VW', 46, '4a4945f396180', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`class_id`),
  ADD UNIQUE KEY `unique_class` (`name`,`year`,`semester`);

--
-- Indexes for table `class_periods`
--
ALTER TABLE `class_periods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_name` (`key_name`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `rfid` (`rfid`),
  ADD KEY `student_id` (`student_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `class_periods`
--
ALTER TABLE `class_periods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=366;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`);

--
-- Constraints for table `class_periods`
--
ALTER TABLE `class_periods`
  ADD CONSTRAINT `class_periods_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
