CREATE DATABASE  IF NOT EXISTS `projectary` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;
USE `projectary`;
-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: projectary
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `createdin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedin` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletedin` timestamp NULL DEFAULT NULL,
  `createdby` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `submitedby` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `submitedin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `studentgroup` varchar(255) CHARACTER SET utf8 NOT NULL,
  `applicationproject` varchar(255) CHARACTER SET utf8 NOT NULL,
  `course` varchar(255) COLLATE utf8_bin NOT NULL,
  `place` varchar(255) COLLATE utf8_bin NOT NULL,
  `lecyear` varchar(255) COLLATE utf8_bin NOT NULL,
  `state` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applicationproject`
--

DROP TABLE IF EXISTS `applicationproject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `applicationproject` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `project` varchar(255) COLLATE utf8_bin NOT NULL,
  `preference` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applicationproject`
--

LOCK TABLES `applicationproject` WRITE;
/*!40000 ALTER TABLE `applicationproject` DISABLE KEYS */;
/*!40000 ALTER TABLE `applicationproject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `desc` varchar(255) COLLATE utf8_bin NOT NULL,
  `school` varchar(255) COLLATE utf8_bin NOT NULL,
  `numcurso` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_numcurso_uindex` (`numcurso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES ('1','EI','1','22');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departament`
--

DROP TABLE IF EXISTS `departament`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departament` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `desc` varchar(255) COLLATE utf8_bin NOT NULL,
  `school` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departament`
--

LOCK TABLES `departament` WRITE;
/*!40000 ALTER TABLE `departament` DISABLE KEYS */;
INSERT INTO `departament` VALUES ('1','DEI','1');
/*!40000 ALTER TABLE `departament` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docs`
--

DROP TABLE IF EXISTS `docs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `docs` (
  `iddocument` varchar(255) CHARACTER SET utf8 NOT NULL,
  `description` varchar(255) COLLATE utf8_bin NOT NULL,
  `attachment` blob,
  PRIMARY KEY (`iddocument`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docs`
--

LOCK TABLES `docs` WRITE;
/*!40000 ALTER TABLE `docs` DISABLE KEYS */;
/*!40000 ALTER TABLE `docs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meetingdocs`
--

DROP TABLE IF EXISTS `meetingdocs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meetingdocs` (
  `meeting` varchar(255) CHARACTER SET utf8 NOT NULL,
  `document` varchar(225) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`meeting`,`document`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meetingdocs`
--

LOCK TABLES `meetingdocs` WRITE;
/*!40000 ALTER TABLE `meetingdocs` DISABLE KEYS */;
/*!40000 ALTER TABLE `meetingdocs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meetings`
--

DROP TABLE IF EXISTS `meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meetings` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `user` varchar(255) COLLATE utf8_bin NOT NULL,
  `projectmeeting` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meetings`
--

LOCK TABLES `meetings` WRITE;
/*!40000 ALTER TABLE `meetings` DISABLE KEYS */;
/*!40000 ALTER TABLE `meetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `approvedby` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `approvedin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `lecyear` varchar(255) COLLATE utf8_bin NOT NULL,
  `course` varchar(255) COLLATE utf8_bin NOT NULL,
  `title` varchar(255) COLLATE utf8_bin NOT NULL,
  `summary` varchar(255) COLLATE utf8_bin NOT NULL,
  `nofstudents` int(11) NOT NULL,
  `objectives` varchar(255) COLLATE utf8_bin NOT NULL,
  `prereqs` varchar(255) COLLATE utf8_bin NOT NULL,
  `state` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectmeetings`
--

DROP TABLE IF EXISTS `projectmeetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projectmeetings` (
  `idprojectmeetings` varchar(255) COLLATE utf8_bin NOT NULL,
  `project` varchar(255) COLLATE utf8_bin NOT NULL,
  `course` varchar(255) COLLATE utf8_bin NOT NULL,
  `date` datetime NOT NULL,
  `workorder` varchar(255) COLLATE utf8_bin NOT NULL,
  `description` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`idprojectmeetings`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectmeetings`
--

LOCK TABLES `projectmeetings` WRITE;
/*!40000 ALTER TABLE `projectmeetings` DISABLE KEYS */;
/*!40000 ALTER TABLE `projectmeetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectmentors`
--

DROP TABLE IF EXISTS `projectmentors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projectmentors` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `user` varchar(255) CHARACTER SET utf8 NOT NULL,
  `project` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`,`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectmentors`
--

LOCK TABLES `projectmentors` WRITE;
/*!40000 ALTER TABLE `projectmentors` DISABLE KEYS */;
/*!40000 ALTER TABLE `projectmentors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectproponents`
--

DROP TABLE IF EXISTS `projectproponents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projectproponents` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `user` varchar(255) COLLATE utf8_bin NOT NULL,
  `project` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectproponents`
--

LOCK TABLES `projectproponents` WRITE;
/*!40000 ALTER TABLE `projectproponents` DISABLE KEYS */;
/*!40000 ALTER TABLE `projectproponents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school`
--

DROP TABLE IF EXISTS `school`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `school` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `desc` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school`
--

LOCK TABLES `school` WRITE;
/*!40000 ALTER TABLE `school` DISABLE KEYS */;
INSERT INTO `school` VALUES ('1','ESTT');
/*!40000 ALTER TABLE `school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `studentid` varchar(255) COLLATE utf8_bin NOT NULL,
  `interests` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_studentid_uindex` (`studentid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentcourse`
--

DROP TABLE IF EXISTS `studentcourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `studentcourse` (
  `course` varchar(255) COLLATE utf8_bin NOT NULL,
  `student` varchar(255) CHARACTER SET utf8 NOT NULL,
  `enryear` year(4) NOT NULL,
  `createdin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course`,`student`,`enryear`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentcourse`
--

LOCK TABLES `studentcourse` WRITE;
/*!40000 ALTER TABLE `studentcourse` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentcourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentsgroup`
--

DROP TABLE IF EXISTS `studentsgroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `studentsgroup` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `student` varchar(255) CHARACTER SET utf8 NOT NULL,
  `ects` varchar(255) CHARACTER SET utf8 NOT NULL,
  `average` decimal(10,0) NOT NULL DEFAULT '0',
  `createdin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`student`),
  KEY `groupentity_entity_fk` (`student`),
  KEY `groupentity_function_fk` (`ects`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table Used to Create Groups of Entities';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentsgroup`
--

LOCK TABLES `studentsgroup` WRITE;
/*!40000 ALTER TABLE `studentsgroup` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentsgroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teacher` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `depunit` int(11) NOT NULL,
  `link` varchar(255) COLLATE utf8_bin NOT NULL,
  `areasfun` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` varchar(255) COLLATE utf8_bin NOT NULL,
  `username` varchar(255) COLLATE utf8_bin NOT NULL,
  `password` varchar(255) COLLATE utf8_bin NOT NULL,
  `email` varchar(255) COLLATE utf8_bin NOT NULL,
  `createdin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `locked` tinyint(1) DEFAULT '0',
  `active` tinyint(1) DEFAULT '0',
  `visibility` tinyint(1) NOT NULL,
  `photo` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `fullname` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`,`fullname`),
  UNIQUE KEY `users_username_uindex` (`username`),
  UNIQUE KEY `users_email_uindex` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercontact`
--

DROP TABLE IF EXISTS `usercontact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usercontact` (
  `user` varchar(255) CHARACTER SET utf8 NOT NULL,
  `contact` varchar(255) COLLATE utf8_bin NOT NULL,
  `type` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`user`,`contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercontact`
--

LOCK TABLES `usercontact` WRITE;
/*!40000 ALTER TABLE `usercontact` DISABLE KEYS */;
/*!40000 ALTER TABLE `usercontact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'projectary'
--

--
-- Dumping routines for database 'projectary'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-04-07 11:34:32
