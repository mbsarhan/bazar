-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: bazar_db
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ad_views`
--

DROP TABLE IF EXISTS `ad_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ad_views` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `advertisement_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `views` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ad_views_advertisement_id_date_unique` (`advertisement_id`,`date`),
  CONSTRAINT `ad_views_advertisement_id_foreign` FOREIGN KEY (`advertisement_id`) REFERENCES `advertisements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ad_views`
--

LOCK TABLES `ad_views` WRITE;
/*!40000 ALTER TABLE `ad_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `ad_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advertisements`
--

DROP TABLE IF EXISTS `advertisements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advertisements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `owner_id` bigint unsigned NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `transaction_type` enum('بيع','أجار','استثمار') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ad_status` enum('فعال','قيد المراجعة','مباع','مؤجر') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'قيد المراجعة',
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `governorate` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `geo_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `views_count` bigint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `advertisements_owner_id_foreign` (`owner_id`),
  KEY `advertisements_geo_location_index` (`geo_location`),
  CONSTRAINT `advertisements_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advertisements`
--

LOCK TABLES `advertisements` WRITE;
/*!40000 ALTER TABLE `advertisements` DISABLE KEYS */;
INSERT INTO `advertisements` VALUES (39,'kia cerato 2022','2025-10-19 05:44:51','2025-10-19 05:44:51',1,0.00,NULL,'بيع','فعال','hama',NULL,'Syria',0),(40,'kia hundai 2022','2025-10-19 05:49:07','2025-10-19 05:49:07',1,0.00,NULL,'بيع','فعال','asa',NULL,'Syria',0),(58,'vsadv','2025-10-20 08:31:29','2025-10-20 08:31:29',1,214.00,'sdv','بيع','قيد المراجعة','vsdva','دمشق','Syria',0),(59,'sv','2025-10-20 10:34:19','2025-10-20 10:34:19',1,NULL,NULL,'بيع','قيد المراجعة','vsadv','دمشق','Syria',0),(60,'sdkjf','2025-10-20 11:46:35','2025-10-20 11:46:35',1,235.00,NULL,'بيع','قيد المراجعة','vsdv','دمشق','Syria',0),(61,'savs','2025-10-20 12:52:30','2025-10-20 12:52:30',1,2342.00,'sadva','بيع','قيد المراجعة','vsadv','دمشق','Syria',0),(62,'ASTON MARTINLagonda1992','2025-10-21 17:37:57','2025-11-03 09:01:28',1,15.00,NULL,'بيع','فعال','vssa','جازان','Syria',0),(63,'vsvds','2025-10-21 17:38:39','2025-10-21 17:38:39',1,23523.00,NULL,'بيع','قيد المراجعة','vsddv','الرياض','Syria',0),(75,'شقة فخمة في حي بستان السعادة','2025-11-03 07:07:00','2025-11-03 07:18:49',1,60000.00,'اطلالة مميزة على الزقاق جانب القلعة','أجار','فعال','حماة','حماة','Syria',0),(76,'فيلا في البرناوي','2025-11-03 07:09:42','2025-11-03 07:18:49',1,30000000.00,NULL,'استثمار','فعال','حماة','حماة','Syria',0),(77,'شقة في حي البياضة','2025-11-03 07:13:50','2025-11-03 07:18:49',1,325000.00,'كرمال عاطف نزلنا 25 الف دولار','بيع','فعال','حمص','حمص','Syria',0),(78,'مزرعة للاستثمار','2025-11-03 07:16:43','2025-11-03 07:18:46',1,3000000.00,NULL,'استثمار','فعال','دمشق','دمشق','Syria',0),(79,'محل ممتاز للبيع','2025-11-03 07:18:20','2025-11-03 07:18:41',1,50000.00,'المحل جانب مركز خدمة المواطن','بيع','فعال','دمشق','دمشق','Syria',0);
/*!40000 ALTER TABLE `advertisements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_ad_images`
--

DROP TABLE IF EXISTS `car_ad_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_ad_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `car_ad_id` bigint unsigned NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `car_ad_images_car_ad_id_foreign` (`car_ad_id`),
  CONSTRAINT `car_ad_images_car_ad_id_foreign` FOREIGN KEY (`car_ad_id`) REFERENCES `car_ads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_ad_images`
--

LOCK TABLES `car_ad_images` WRITE;
/*!40000 ALTER TABLE `car_ad_images` DISABLE KEYS */;
INSERT INTO `car_ad_images` VALUES (5,'2025-10-19 05:44:51','2025-10-19 05:44:51',8,'images/cars/1wgN1H6piDtFUDaRlqptp1HuyRm82WIU0E72FwAN.png'),(6,'2025-10-19 05:44:51','2025-10-19 05:44:51',8,'images/cars/sxMa1tLPC1UTMYGX76D738UuC38hFVOtSx5He3lM.png'),(7,'2025-10-19 05:44:51','2025-10-19 05:44:51',8,'images/cars/tYp0LyGkHg2HfTVq75bbBeyjFgYVZRrlQUsbmwF9.png'),(8,'2025-10-19 05:44:51','2025-10-19 05:44:51',8,'images/cars/ipVcFCYE1iLrZY4nHzdjUbqbs4kKXGREXxFsRS0R.png'),(9,'2025-10-19 05:49:07','2025-10-19 05:49:07',9,'images/cars/QNFfRFr6495PnnNqff1242Y4f0aQM6kxaHA2KJDD.png'),(10,'2025-10-19 05:49:07','2025-10-19 05:49:07',9,'images/cars/OFcXjk9gbWUggjiKcVbZC6U7hnNXvLKj43GXqAZi.png'),(11,'2025-10-19 05:49:07','2025-10-19 05:49:07',9,'images/cars/eazmiUOlI8OAer8NmE1WHCw6M8ftjEENdXi8drAg.png'),(12,'2025-10-19 05:49:07','2025-10-19 05:49:07',9,'images/cars/evnNw6HNimhN9OME2F31V30dOwfQgFDnYcuZYGP2.png'),(13,'2025-10-21 17:37:57','2025-10-21 17:37:57',10,'images/cars/h88u7IuuE36p5ef37HECGB7Km4H4V5pum8b6h8IN.png'),(14,'2025-10-21 17:37:57','2025-10-21 17:37:57',10,'images/cars/HLGIsbOdldmCjwMdz5jAM5CbgEAQHzw97Netcw2P.png'),(15,'2025-10-21 17:37:57','2025-10-21 17:37:57',10,'images/cars/kEPhSdayfypTzy9sspdk03vtjsFrcgK7TzjJnikd.png'),(16,'2025-10-21 17:37:57','2025-10-21 17:37:57',10,'images/cars/jJzbNJivqAqdaXEt3H4q19Zrd8U4oWoycqYObeHm.png'),(17,'2025-10-21 17:37:57','2025-10-21 17:37:57',10,'images/cars/4GXsCTIrQ2gIyRMp9Rwbkn9BOJazCNwJslbwkuTu.png');
/*!40000 ALTER TABLE `car_ad_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_ads`
--

DROP TABLE IF EXISTS `car_ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_ads` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `ads_id` bigint unsigned NOT NULL,
  `manufacturer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_year` year NOT NULL,
  `condition` enum('جديدة','مستعملة','متضررة') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'مستعملة',
  `gear` enum('عادي','أوتوماتيك','الإثنان معا') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fuel_type` enum('بنزين','ديزل','كهرباء','هايبرد') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'بنزين',
  `distance_traveled` bigint unsigned NOT NULL,
  `negotiable_check` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `car_ads_ads_id_unique` (`ads_id`),
  CONSTRAINT `car_ads_ads_id_foreign` FOREIGN KEY (`ads_id`) REFERENCES `advertisements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_ads`
--

LOCK TABLES `car_ads` WRITE;
/*!40000 ALTER TABLE `car_ads` DISABLE KEYS */;
INSERT INTO `car_ads` VALUES (8,'2025-10-19 05:44:51','2025-10-19 05:44:51',39,'kia','cerato',2022,'مستعملة','أوتوماتيك','بنزين',10000,0),(9,'2025-10-19 05:49:07','2025-10-19 05:49:07',40,'kia','hundai',2022,'مستعملة','أوتوماتيك','بنزين',10000,0),(10,'2025-10-21 17:37:57','2025-11-03 09:01:28',62,'ASTON MARTIN','Lagonda',1992,'متضررة','أوتوماتيك','بنزين',2345,0);
/*!40000 ALTER TABLE `car_ads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_ad_counts`
--

DROP TABLE IF EXISTS `daily_ad_counts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_ad_counts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `ad_count` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `daily_ad_counts_date_unique` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_ad_counts`
--

LOCK TABLES `daily_ad_counts` WRITE;
/*!40000 ALTER TABLE `daily_ad_counts` DISABLE KEYS */;
INSERT INTO `daily_ad_counts` VALUES (1,'2025-10-23',0,'2025-10-24 11:51:21','2025-11-03 06:20:59'),(2,'2025-10-17',0,'2025-10-24 12:00:54','2025-10-24 12:00:54'),(3,'2025-10-18',0,'2025-10-24 12:01:19','2025-10-24 12:01:19'),(4,'2025-10-19',2,'2025-10-24 12:01:24','2025-10-24 12:01:24'),(5,'2025-10-20',4,'2025-10-24 12:01:28','2025-10-24 12:01:28'),(6,'2025-10-21',2,'2025-10-24 12:01:33','2025-10-24 12:01:33'),(7,'2025-10-22',0,'2025-10-24 12:01:37','2025-10-24 12:01:37'),(9,'2025-10-24',1,'2025-10-24 13:08:35','2025-10-24 13:08:35'),(10,'2025-10-25',0,'2025-10-25 11:47:21','2025-11-03 06:55:33'),(11,'2025-11-03',5,'2025-11-03 07:07:00','2025-11-03 07:18:20'),(12,'2025-11-05',0,'2025-11-05 15:47:48','2025-11-05 16:45:24'),(13,'2025-11-07',0,'2025-11-07 12:15:53','2025-11-07 15:14:29');
/*!40000 ALTER TABLE `daily_ad_counts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
INSERT INTO `failed_jobs` VALUES (1,'2f0cfbf3-52f7-47ac-8b4f-42f97da1a48a','database','default','{\"uuid\":\"2f0cfbf3-52f7-47ac-8b4f-42f97da1a48a\",\"displayName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"command\":\"O:24:\\\"App\\\\Jobs\\\\ProcessVideoJob\\\":2:{s:9:\\\"videoPath\\\";s:74:\\\"videos\\/real-estate\\/originals\\/nW6ucTOPoOBNV0yYSohg1W0Kh6qCM9vBo7JqD6cM.webm\\\";s:4:\\\"adId\\\";i:27;}\"},\"createdAt\":1760537183,\"delay\":null}','Illuminate\\Queue\\TimeoutExceededException: App\\Jobs\\ProcessVideoJob has timed out. in /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/TimeoutExceededException.php:15\nStack trace:\n#0 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(828): Illuminate\\Queue\\TimeoutExceededException::forJob()\n#1 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(228): Illuminate\\Queue\\Worker->timeoutExceededException()\n#2 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/process/Pipes/AbstractPipes.php(184): Illuminate\\Queue\\Worker->Illuminate\\Queue\\{closure}()\n#3 [internal function]: Symfony\\Component\\Process\\Pipes\\AbstractPipes->handleError()\n#4 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/process/Pipes/UnixPipes.php(100): stream_select()\n#5 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/process/Process.php(1406): Symfony\\Component\\Process\\Pipes\\UnixPipes->readAndWrite()\n#6 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/process/Process.php(452): Symfony\\Component\\Process\\Process->readPipes()\n#7 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/process/Process.php(251): Symfony\\Component\\Process\\Process->wait()\n#8 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/php-ffmpeg/php-ffmpeg/src/Alchemy/BinaryDriver/ProcessRunner.php(64): Symfony\\Component\\Process\\Process->run()\n#9 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/php-ffmpeg/php-ffmpeg/src/Alchemy/BinaryDriver/AbstractBinary.php(207): Alchemy\\BinaryDriver\\ProcessRunner->run()\n#10 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/php-ffmpeg/php-ffmpeg/src/Alchemy/BinaryDriver/AbstractBinary.php(136): Alchemy\\BinaryDriver\\AbstractBinary->run()\n#11 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/php-ffmpeg/php-ffmpeg/src/FFMpeg/Media/AdvancedMedia.php(241): Alchemy\\BinaryDriver\\AbstractBinary->command()\n#12 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Support/Traits/ForwardsCalls.php(23): FFMpeg\\Media\\AdvancedMedia->save()\n#13 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/pbmedia/laravel-ffmpeg/src/Drivers/PHPFFMpeg.php(255): ProtoneMedia\\LaravelFFMpeg\\Drivers\\PHPFFMpeg->forwardCallTo()\n#14 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/pbmedia/laravel-ffmpeg/src/Exporters/MediaExporter.php(263): ProtoneMedia\\LaravelFFMpeg\\Drivers\\PHPFFMpeg->__call()\n#15 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/pbmedia/laravel-ffmpeg/src/Exporters/MediaExporter.php(205): ProtoneMedia\\LaravelFFMpeg\\Exporters\\MediaExporter->saveWithMappings()\n#16 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/pbmedia/laravel-ffmpeg/src/Exporters/HLSExporter.php(288): ProtoneMedia\\LaravelFFMpeg\\Exporters\\MediaExporter->save()\n#17 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Collections/Traits/EnumeratesValues.php(780): ProtoneMedia\\LaravelFFMpeg\\Exporters\\HLSExporter->ProtoneMedia\\LaravelFFMpeg\\Exporters\\{closure}()\n#18 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/pbmedia/laravel-ffmpeg/src/Exporters/HLSExporter.php(287): Illuminate\\Support\\Collection->pipe()\n#19 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/app/Jobs/ProcessVideoJob.php(169): ProtoneMedia\\LaravelFFMpeg\\Exporters\\HLSExporter->save()\n#20 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): App\\Jobs\\ProcessVideoJob->handle()\n#21 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#22 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#23 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#24 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#25 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(132): Illuminate\\Container\\Container->call()\n#26 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#27 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#28 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then()\n#29 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#30 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#31 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#32 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then()\n#33 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#34 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#35 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#36 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(401): Illuminate\\Queue\\Worker->process()\n#37 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(187): Illuminate\\Queue\\Worker->runJob()\n#38 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#39 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#40 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#41 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#42 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#43 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#44 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#45 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#46 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#47 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#48 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(1110): Illuminate\\Console\\Command->run()\n#49 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(359): Symfony\\Component\\Console\\Application->doRunCommand()\n#50 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(194): Symfony\\Component\\Console\\Application->doRun()\n#51 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#52 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle()\n#53 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#54 {main}','2025-10-16 01:28:38'),(2,'825ee78d-4dac-4d3c-85f6-92c99a2a165a','database','default','{\"uuid\":\"825ee78d-4dac-4d3c-85f6-92c99a2a165a\",\"displayName\":\"App\\\\Notifications\\\\VerifyEmailWithOtp\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:7;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:36:\\\"App\\\\Notifications\\\\VerifyEmailWithOtp\\\":2:{s:16:\\\"verificationCode\\\";s:6:\\\"740854\\\";s:2:\\\"id\\\";s:36:\\\"b26c4f39-86cb-43df-bd7b-3dd3f6935853\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\"},\"createdAt\":1761325601,\"delay\":null}','Illuminate\\Queue\\TimeoutExceededException: App\\Notifications\\VerifyEmailWithOtp has timed out. in /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/TimeoutExceededException.php:15\nStack trace:\n#0 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(828): Illuminate\\Queue\\TimeoutExceededException::forJob()\n#1 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(228): Illuminate\\Queue\\Worker->timeoutExceededException()\n#2 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/Stream/AbstractStream.php(82): Illuminate\\Queue\\Worker->Illuminate\\Queue\\{closure}()\n#3 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/SmtpTransport.php(350): Symfony\\Component\\Mailer\\Transport\\Smtp\\Stream\\AbstractStream->readLine()\n#4 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/SmtpTransport.php(197): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->getFullResponse()\n#5 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/EsmtpTransport.php(150): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->executeCommand()\n#6 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/SmtpTransport.php(320): Symfony\\Component\\Mailer\\Transport\\Smtp\\EsmtpTransport->executeCommand()\n#7 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/SmtpTransport.php(206): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->ping()\n#8 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/AbstractTransport.php(69): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->doSend()\n#9 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/SmtpTransport.php(138): Symfony\\Component\\Mailer\\Transport\\AbstractTransport->send()\n#10 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Mail/Mailer.php(584): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->send()\n#11 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Mail/Mailer.php(331): Illuminate\\Mail\\Mailer->sendSymfonyMessage()\n#12 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/Channels/MailChannel.php(66): Illuminate\\Mail\\Mailer->send()\n#13 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/NotificationSender.php(163): Illuminate\\Notifications\\Channels\\MailChannel->send()\n#14 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/NotificationSender.php(118): Illuminate\\Notifications\\NotificationSender->sendToNotifiable()\n#15 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Support/Traits/Localizable.php(19): Illuminate\\Notifications\\NotificationSender->Illuminate\\Notifications\\{closure}()\n#16 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/NotificationSender.php(113): Illuminate\\Notifications\\NotificationSender->withLocale()\n#17 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/ChannelManager.php(54): Illuminate\\Notifications\\NotificationSender->sendNow()\n#18 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/SendQueuedNotifications.php(118): Illuminate\\Notifications\\ChannelManager->sendNow()\n#19 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Notifications\\SendQueuedNotifications->handle()\n#20 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#21 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#22 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#23 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#24 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(132): Illuminate\\Container\\Container->call()\n#25 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#26 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#27 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then()\n#28 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#29 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#30 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#31 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then()\n#32 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#33 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#34 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#35 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(401): Illuminate\\Queue\\Worker->process()\n#36 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(187): Illuminate\\Queue\\Worker->runJob()\n#37 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#38 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#39 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#40 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#41 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#42 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#43 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#44 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#45 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#46 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#47 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(1110): Illuminate\\Console\\Command->run()\n#48 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(359): Symfony\\Component\\Console\\Application->doRunCommand()\n#49 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(194): Symfony\\Component\\Console\\Application->doRun()\n#50 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#51 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle()\n#52 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#53 {main}','2025-10-24 14:07:44'),(3,'da6eff16-a195-40cd-a830-606abffcd3c3','database','default','{\"uuid\":\"da6eff16-a195-40cd-a830-606abffcd3c3\",\"displayName\":\"App\\\\Notifications\\\\VerifyEmailWithOtp\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:8;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:36:\\\"App\\\\Notifications\\\\VerifyEmailWithOtp\\\":2:{s:16:\\\"verificationCode\\\";s:6:\\\"171618\\\";s:2:\\\"id\\\";s:36:\\\"35070f9e-06a8-4440-a940-1d48bfa18a8a\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\"},\"createdAt\":1761410617,\"delay\":null}','Illuminate\\Queue\\TimeoutExceededException: App\\Notifications\\VerifyEmailWithOtp has timed out. in /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/TimeoutExceededException.php:15\nStack trace:\n#0 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(828): Illuminate\\Queue\\TimeoutExceededException::forJob()\n#1 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(228): Illuminate\\Queue\\Worker->timeoutExceededException()\n#2 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/Stream/AbstractStream.php(82): Illuminate\\Queue\\Worker->Illuminate\\Queue\\{closure}()\n#3 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/SmtpTransport.php(350): Symfony\\Component\\Mailer\\Transport\\Smtp\\Stream\\AbstractStream->readLine()\n#4 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/SmtpTransport.php(197): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->getFullResponse()\n#5 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/EsmtpTransport.php(150): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->executeCommand()\n#6 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/SmtpTransport.php(320): Symfony\\Component\\Mailer\\Transport\\Smtp\\EsmtpTransport->executeCommand()\n#7 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/SmtpTransport.php(206): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->ping()\n#8 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/AbstractTransport.php(69): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->doSend()\n#9 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/mailer/Transport/Smtp/SmtpTransport.php(138): Symfony\\Component\\Mailer\\Transport\\AbstractTransport->send()\n#10 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Mail/Mailer.php(584): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->send()\n#11 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Mail/Mailer.php(331): Illuminate\\Mail\\Mailer->sendSymfonyMessage()\n#12 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/Channels/MailChannel.php(66): Illuminate\\Mail\\Mailer->send()\n#13 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/NotificationSender.php(163): Illuminate\\Notifications\\Channels\\MailChannel->send()\n#14 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/NotificationSender.php(118): Illuminate\\Notifications\\NotificationSender->sendToNotifiable()\n#15 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Support/Traits/Localizable.php(19): Illuminate\\Notifications\\NotificationSender->Illuminate\\Notifications\\{closure}()\n#16 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/NotificationSender.php(113): Illuminate\\Notifications\\NotificationSender->withLocale()\n#17 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/ChannelManager.php(54): Illuminate\\Notifications\\NotificationSender->sendNow()\n#18 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Notifications/SendQueuedNotifications.php(118): Illuminate\\Notifications\\ChannelManager->sendNow()\n#19 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Notifications\\SendQueuedNotifications->handle()\n#20 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#21 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#22 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#23 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#24 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(132): Illuminate\\Container\\Container->call()\n#25 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#26 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#27 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then()\n#28 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#29 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#30 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#31 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then()\n#32 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#33 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#34 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#35 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(401): Illuminate\\Queue\\Worker->process()\n#36 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(187): Illuminate\\Queue\\Worker->runJob()\n#37 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#38 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#39 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#40 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#41 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#42 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#43 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#44 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#45 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#46 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#47 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(1110): Illuminate\\Console\\Command->run()\n#48 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(359): Symfony\\Component\\Console\\Application->doRunCommand()\n#49 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(194): Symfony\\Component\\Console\\Application->doRun()\n#50 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#51 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle()\n#52 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#53 {main}','2025-10-25 13:44:39'),(4,'1c8a0dd0-43ea-4697-aaf0-2fae6092eaec','database','default','{\"uuid\":\"1c8a0dd0-43ea-4697-aaf0-2fae6092eaec\",\"displayName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":600,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"command\":\"O:24:\\\"App\\\\Jobs\\\\ProcessVideoJob\\\":2:{s:9:\\\"videoPath\\\";s:73:\\\"videos\\/real-estate\\/originals\\/8gsprfZIoc0eHmZu49vwH54ti8KkuvWKzWqmAUGG.mp4\\\";s:4:\\\"adId\\\";i:87;}\"},\"createdAt\":1762536251,\"delay\":null}','Error: Typed property App\\Jobs\\ProcessVideoJob::$disk must not be accessed before initialization in /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/app/Jobs/ProcessVideoJob.php:47\nStack trace:\n#0 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): App\\Jobs\\ProcessVideoJob->handle()\n#1 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#2 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#3 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#4 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#5 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(129): Illuminate\\Container\\Container->call()\n#6 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#7 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#8 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then()\n#9 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#10 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#11 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#12 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then()\n#13 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#14 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#15 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#16 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(401): Illuminate\\Queue\\Worker->process()\n#17 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(187): Illuminate\\Queue\\Worker->runJob()\n#18 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#19 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#20 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#21 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#22 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#23 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#24 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#25 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#26 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#27 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#28 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(1073): Illuminate\\Console\\Command->run()\n#29 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand()\n#30 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(195): Symfony\\Component\\Console\\Application->doRun()\n#31 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#32 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle()\n#33 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#34 {main}','2025-11-07 14:24:13'),(5,'945a03c9-dd56-48ed-be2e-70566154564a','database','default','{\"uuid\":\"945a03c9-dd56-48ed-be2e-70566154564a\",\"displayName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":600,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"command\":\"O:24:\\\"App\\\\Jobs\\\\ProcessVideoJob\\\":2:{s:9:\\\"videoPath\\\";s:73:\\\"videos\\/real-estate\\/originals\\/2m7KYFZiHM0WuLxKkSPrs4A99zccGOwkf0uJnGa8.mp4\\\";s:4:\\\"adId\\\";i:88;}\"},\"createdAt\":1762536284,\"delay\":null}','Error: Typed property App\\Jobs\\ProcessVideoJob::$disk must not be accessed before initialization in /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/app/Jobs/ProcessVideoJob.php:47\nStack trace:\n#0 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): App\\Jobs\\ProcessVideoJob->handle()\n#1 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#2 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#3 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#4 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#5 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(129): Illuminate\\Container\\Container->call()\n#6 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#7 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#8 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then()\n#9 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#10 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#11 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#12 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then()\n#13 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#14 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#15 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#16 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(401): Illuminate\\Queue\\Worker->process()\n#17 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(187): Illuminate\\Queue\\Worker->runJob()\n#18 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#19 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#20 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#21 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#22 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#23 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#24 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#25 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#26 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#27 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#28 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(1073): Illuminate\\Console\\Command->run()\n#29 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand()\n#30 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(195): Symfony\\Component\\Console\\Application->doRun()\n#31 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#32 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle()\n#33 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#34 {main}','2025-11-07 14:24:47'),(6,'3035e6a1-9ad7-40be-9618-44e4f68cd602','database','default','{\"uuid\":\"3035e6a1-9ad7-40be-9618-44e4f68cd602\",\"displayName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":600,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"command\":\"O:24:\\\"App\\\\Jobs\\\\ProcessVideoJob\\\":2:{s:9:\\\"videoPath\\\";s:73:\\\"videos\\/real-estate\\/originals\\/RKhwIhF4A4yB8u8kJFQuAkKTLRAhJiXVfhStEnIw.mp4\\\";s:4:\\\"adId\\\";i:89;}\"},\"createdAt\":1762536323,\"delay\":null}','Error: Typed property App\\Jobs\\ProcessVideoJob::$disk must not be accessed before initialization in /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/app/Jobs/ProcessVideoJob.php:47\nStack trace:\n#0 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): App\\Jobs\\ProcessVideoJob->handle()\n#1 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#2 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#3 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#4 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#5 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(129): Illuminate\\Container\\Container->call()\n#6 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#7 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#8 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then()\n#9 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#10 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#11 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#12 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then()\n#13 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#14 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#15 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#16 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(401): Illuminate\\Queue\\Worker->process()\n#17 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(187): Illuminate\\Queue\\Worker->runJob()\n#18 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#19 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#20 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#21 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#22 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#23 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#24 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#25 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#26 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#27 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#28 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(1073): Illuminate\\Console\\Command->run()\n#29 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand()\n#30 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(195): Symfony\\Component\\Console\\Application->doRun()\n#31 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#32 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle()\n#33 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#34 {main}','2025-11-07 14:25:26'),(7,'4270cb4f-3f1a-461f-9bb0-a7418281d093','database','default','{\"uuid\":\"4270cb4f-3f1a-461f-9bb0-a7418281d093\",\"displayName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":600,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"command\":\"O:24:\\\"App\\\\Jobs\\\\ProcessVideoJob\\\":2:{s:9:\\\"videoPath\\\";s:73:\\\"videos\\/real-estate\\/originals\\/FxXx2rVh7sIaZjW4uAkHuFAcuIV2tYthfK9LgAhJ.mp4\\\";s:4:\\\"adId\\\";i:90;}\"},\"createdAt\":1762539106,\"delay\":null}','Error: Typed property App\\Jobs\\ProcessVideoJob::$disk must not be accessed before initialization in /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/app/Jobs/ProcessVideoJob.php:47\nStack trace:\n#0 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): App\\Jobs\\ProcessVideoJob->handle()\n#1 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#2 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#3 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#4 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#5 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(129): Illuminate\\Container\\Container->call()\n#6 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#7 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#8 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then()\n#9 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#10 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#11 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#12 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then()\n#13 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#14 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#15 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#16 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(401): Illuminate\\Queue\\Worker->process()\n#17 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(187): Illuminate\\Queue\\Worker->runJob()\n#18 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#19 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#20 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#21 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#22 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#23 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#24 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#25 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#26 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#27 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#28 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(1073): Illuminate\\Console\\Command->run()\n#29 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand()\n#30 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(195): Symfony\\Component\\Console\\Application->doRun()\n#31 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#32 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle()\n#33 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#34 {main}','2025-11-07 15:11:46'),(8,'65cb6cd5-d56f-42cd-b214-1769775ca4a4','database','default','{\"uuid\":\"65cb6cd5-d56f-42cd-b214-1769775ca4a4\",\"displayName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":600,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessVideoJob\",\"command\":\"O:24:\\\"App\\\\Jobs\\\\ProcessVideoJob\\\":2:{s:9:\\\"videoPath\\\";s:73:\\\"videos\\/real-estate\\/originals\\/EacUv8CLb2Ff8nng5KtDpOFyQGDB3oL77YM5pnf3.mp4\\\";s:4:\\\"adId\\\";i:91;}\"},\"createdAt\":1762539204,\"delay\":null}','Error: Typed property App\\Jobs\\ProcessVideoJob::$disk must not be accessed before initialization in /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/app/Jobs/ProcessVideoJob.php:47\nStack trace:\n#0 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): App\\Jobs\\ProcessVideoJob->handle()\n#1 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#2 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#3 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#4 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#5 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(129): Illuminate\\Container\\Container->call()\n#6 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#7 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#8 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then()\n#9 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#10 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#11 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#12 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then()\n#13 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#14 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#15 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#16 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(401): Illuminate\\Queue\\Worker->process()\n#17 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(187): Illuminate\\Queue\\Worker->runJob()\n#18 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#19 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#20 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#21 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#22 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#23 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#24 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Container/Container.php(836): Illuminate\\Container\\BoundMethod::call()\n#25 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#26 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#27 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#28 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(1073): Illuminate\\Console\\Command->run()\n#29 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand()\n#30 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/symfony/console/Application.php(195): Symfony\\Component\\Console\\Application->doRun()\n#31 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#32 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle()\n#33 /home/abdalrahman/codes/laravel/BazaarWeb/src/backend/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#34 {main}','2025-11-07 15:13:26');
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint unsigned NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_sender_id_foreign` (`sender_id`),
  KEY `messages_receiver_id_foreign` (`receiver_id`),
  CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_09_25_102927_create_personal_access_tokens_table',1),(5,'2025_09_25_201505_create_advertisements_table',1),(6,'2025_09_27_120322_user_ratings',1),(7,'2025_09_27_204818_create_car_ads_table',1),(8,'2025_09_28_033722_create_realestate_ads_table',1),(9,'2025_09_28_041910_create_car_ad_images_table',1),(10,'2025_09_28_042657_create_realestate_images_table',1),(11,'2025_10_08_110349_add_pending_email_to_users_table',1),(12,'2025_10_09_133046_add_name_last_updated_at_to_users_table',1),(13,'2025_10_09_140552_make_user_room_fields_nullable_in_users_table',1),(14,'2025_10_10_105357_add_message_to_user_ratings_table',2),(15,'2025_10_11_114034_change_status_and_fule_type_in_car_ads',3),(16,'2025_10_13_110648_create_ad_views_table',4),(17,'2025_10_15_121503_add_hls_url_to_realestate_ads_table',5),(18,'2025_10_14_090054_update_realestate_and_car_ads_tables',6),(19,'2025_10_14_135139_make_price_nullable_in_advertisements_table',6),(20,'2025_10_16_122450_make_description_nullable_in_advertisements_table',7),(21,'2025_10_18_133211_add_geo_location_to_advertisements_table',8),(22,'2025_10_19_090904_change_governorate_column_type_in_advertisements_table',9),(24,'2025_10_20_125627_add_video_type_to_realestate_ads_table',10),(25,'2025_10_20_122409_create_pending_advertisement_updates_table',11),(26,'2025_10_22_135830_add_views_count_and_ad_status_to_pending_advertisement_updates_table',12),(27,'2025_10_24_142526_create_daily_ad_counts_table',13),(28,'2025_10_24_115507_add_ads_num_to_users_table',14),(29,'2025_10_24_123736_rename_pending_advertisement_updates_to_pending_advertisements',14),(30,'2025_10_24_131707_add_approval_type_to_pending_advertisements_table',14),(31,'2025_11_03_100806_create_messages_table',15);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending_advertisements`
--

DROP TABLE IF EXISTS `pending_advertisements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pending_advertisements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `advertisement_id` bigint unsigned NOT NULL,
  `approval_type` enum('new','update') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'update',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `transaction_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ad_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `views_count` bigint unsigned NOT NULL DEFAULT '0',
  `governorate` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `geo_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `negotiable_check` tinyint(1) NOT NULL,
  `manufacturer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model_year` year DEFAULT NULL,
  `condition` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gear` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fuel_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distance_traveled` bigint unsigned DEFAULT NULL,
  `realestate_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailed_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` decimal(8,2) DEFAULT NULL,
  `bedroom_num` smallint unsigned DEFAULT NULL,
  `bathroom_num` smallint unsigned DEFAULT NULL,
  `floor_num` smallint unsigned DEFAULT NULL,
  `building_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cladding_condition` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pending_media` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pending_advertisement_updates_advertisement_id_foreign` (`advertisement_id`),
  CONSTRAINT `pending_advertisement_updates_advertisement_id_foreign` FOREIGN KEY (`advertisement_id`) REFERENCES `advertisements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_advertisements`
--

LOCK TABLES `pending_advertisements` WRITE;
/*!40000 ALTER TABLE `pending_advertisements` DISABLE KEYS */;
/*!40000 ALTER TABLE `pending_advertisements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'authToken','c0dc7beabe5c03e41b8c201978aaf74bde96321dffff9ef77e826ece4c31ea68','[\"*\"]',NULL,NULL,'2025-10-09 16:23:26','2025-10-09 16:23:26'),(3,'App\\Models\\User',2,'authToken','90b8f22301e08b815a6650375c68630695bd6ecf17149b704cbbba3ff55c136b','[\"*\"]',NULL,NULL,'2025-10-10 08:20:35','2025-10-10 08:20:35'),(4,'App\\Models\\User',2,'authToken','4b58af93a6d7c4851c28741bacaeecda3566c958c47ec26808867473546ce1d0','[\"*\"]','2025-10-10 08:21:39',NULL,'2025-10-10 08:21:39','2025-10-10 08:21:39'),(5,'App\\Models\\User',3,'authToken','a96be8bca6cd34b2e87fa82cd21ac17122b45d25033b34a1946960c1d2fbbf87','[\"*\"]','2025-10-10 08:45:19',NULL,'2025-10-10 08:34:19','2025-10-10 08:45:19'),(6,'App\\Models\\User',4,'authToken','9f86e9de6dff50becfaac4470f82a0e01dc402bbd84eaf2d91de22ab718371b1','[\"*\"]',NULL,NULL,'2025-10-10 08:40:22','2025-10-10 08:40:22'),(8,'App\\Models\\User',5,'authToken','cd9a7a229515b3ae8efb6291f6bc956c4d627c1aa927d111a313b829d55396e3','[\"*\"]','2025-10-10 08:59:30',NULL,'2025-10-10 08:57:37','2025-10-10 08:59:30'),(9,'App\\Models\\User',3,'authToken','b11991991f756eb11749c019adaa3132b158473bfaa814ee260c3a92ebe5fea7','[\"*\"]',NULL,NULL,'2025-10-11 09:06:08','2025-10-11 09:06:08'),(10,'App\\Models\\User',3,'authToken','977d8b301b35d257ba6155df7d66b365883a70f5b92eb6c9eb2b4bd62550d638','[\"*\"]','2025-10-13 04:43:58',NULL,'2025-10-12 13:34:20','2025-10-13 04:43:58'),(11,'App\\Models\\User',3,'authToken','4d072fb17381e9c7d38ca3c7e2015c697a66b484b15ae8243f590c857662d869','[\"*\"]',NULL,NULL,'2025-10-13 05:20:45','2025-10-13 05:20:45'),(13,'App\\Models\\User',3,'authToken','cbeda8c9ae50a7e2af80bd23641eaa8c4cf4c0a211d048c82e785af3c5311d16','[\"*\"]',NULL,NULL,'2025-10-16 11:25:11','2025-10-16 11:25:11'),(16,'App\\Models\\User',3,'authToken','0d039136a27c146899264c21ccbef36766c71bdeb014f2a7b364f502803232d2','[\"*\"]',NULL,NULL,'2025-10-18 11:46:29','2025-10-18 11:46:29'),(17,'App\\Models\\User',1,'authToken','2c31aa0b60ea7db233ecbfbb1a68e53b3d676f82304144d3092d9905f7467b79','[\"*\"]','2025-10-25 15:08:46',NULL,'2025-10-22 09:05:09','2025-10-25 15:08:46'),(18,'App\\Models\\User',6,'authToken','8b76a384daaaee85cfc02812d70fa46f4905a1ad87f91abccdfb3230db056b68','[\"*\"]','2025-10-24 13:05:49',NULL,'2025-10-24 10:50:19','2025-10-24 13:05:49'),(22,'App\\Models\\User',1,'authToken','afbea4d6f74b2e2f0c802390fe1f6684b3d265e96a91b0434f5a10433de0ff8c','[\"*\"]','2025-10-31 08:29:20',NULL,'2025-10-25 13:43:47','2025-10-31 08:29:20'),(23,'App\\Models\\User',1,'authToken','3360124e4f3c647e845c99596d5a5c50acb2e8a2de618e41b9b37606db72c111','[\"*\"]','2025-10-27 05:34:19',NULL,'2025-10-27 05:34:17','2025-10-27 05:34:19'),(24,'App\\Models\\User',1,'authToken','0684fd9f8694255815c65922dfebe084015d22fadfa6de0afee8834277b7e84c','[\"*\"]','2025-11-05 14:20:37',NULL,'2025-10-31 08:30:06','2025-11-05 14:20:37'),(25,'App\\Models\\User',1,'authToken','b4b933151d794e9ab0145a54193ee630348e45a1cd821dd2625e595eab90caa0','[\"*\"]',NULL,NULL,'2025-10-31 12:28:00','2025-10-31 12:28:00'),(26,'App\\Models\\User',1,'authToken','8c28a3d1246ac9bcc96650dc3e635c3c563559f83ae1bd19f936c68a1e3d8b11','[\"*\"]','2025-11-03 09:01:28',NULL,'2025-11-03 06:15:00','2025-11-03 09:01:28'),(27,'App\\Models\\User',1,'authToken','ea3b5ab893b5ad575c03f565b12b4da00d8fba32013612e004c073d8ee9414e9','[\"*\"]','2025-11-07 16:20:32',NULL,'2025-11-05 15:45:57','2025-11-07 16:20:32'),(28,'App\\Models\\User',1,'authToken','2d5251df31250454aa340f76a11513cc462d39557fcd27c1aac3d49cc6a38e12','[\"*\"]','2025-11-08 05:33:47',NULL,'2025-11-08 05:33:47','2025-11-08 05:33:47');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `realestate_ads`
--

DROP TABLE IF EXISTS `realestate_ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `realestate_ads` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `ads_id` bigint unsigned NOT NULL,
  `realestate_type` enum('شقة','فيلا','محل تجاري','مكتب','أرض','مزرعة','شاليه','مستودع','سوق تجاري') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'شقة',
  `detailed_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `area` decimal(8,2) NOT NULL,
  `bedroom_num` int DEFAULT NULL,
  `bathroom_num` int DEFAULT NULL,
  `floor_num` int DEFAULT NULL,
  `building_status` enum('جاهز','على الهيكل','قيد الإنشاء') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'جاهز',
  `cladding_condition` enum('جيد','جيد جداً','سوبر ديلوكس','عادي','بحاجة لتجديد','') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'جيد',
  `negotiable_check` tinyint(1) NOT NULL DEFAULT '0',
  `video_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hls_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `realestate_ads_ads_id_unique` (`ads_id`),
  CONSTRAINT `realestate_ads_ads_id_foreign` FOREIGN KEY (`ads_id`) REFERENCES `advertisements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `realestate_ads`
--

LOCK TABLES `realestate_ads` WRITE;
/*!40000 ALTER TABLE `realestate_ads` DISABLE KEYS */;
INSERT INTO `realestate_ads` VALUES (55,'2025-11-03 07:07:00','2025-11-03 07:07:00',75,'شقة','جانب جامع النوري',120.00,1,NULL,NULL,'جاهز','جيد',1,NULL,NULL,NULL),(56,'2025-11-03 07:09:42','2025-11-03 07:09:42',76,'فيلا','مقابل قصر المحافظ',1000.00,3,NULL,NULL,'جاهز','جيد',1,NULL,NULL,NULL),(57,'2025-11-03 07:13:50','2025-11-03 07:13:50',77,'شقة','جانب بيت الساورت',90.00,1,NULL,NULL,'جاهز','جيد',0,NULL,NULL,NULL),(58,'2025-11-03 07:16:43','2025-11-03 07:16:43',78,'مزرعة','ابو رمانة',2000.00,4,NULL,NULL,'جاهز','جيد',1,NULL,NULL,NULL),(59,'2025-11-03 07:18:20','2025-11-03 07:18:20',79,'محل تجاري','سوق البحصة',60.00,NULL,NULL,NULL,'جاهز','جيد',0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `realestate_ads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `realestate_images`
--

DROP TABLE IF EXISTS `realestate_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `realestate_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `realestate_ad_id` bigint unsigned NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `realestate_images_realestate_ad_id_foreign` (`realestate_ad_id`),
  CONSTRAINT `realestate_images_realestate_ad_id_foreign` FOREIGN KEY (`realestate_ad_id`) REFERENCES `realestate_ads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `realestate_images`
--

LOCK TABLES `realestate_images` WRITE;
/*!40000 ALTER TABLE `realestate_images` DISABLE KEYS */;
INSERT INTO `realestate_images` VALUES (59,'2025-11-03 07:07:00','2025-11-03 07:07:00',55,'images/real-estate/0t4fG44aCf5xex5029PTeCH5Zhx0FVRcgwAfn2jK.jpg'),(60,'2025-11-03 07:07:00','2025-11-03 07:07:00',55,'images/real-estate/C2lWLXTJeZ6YFQrJT0AuUK4u8fiYOGSeyGtPqKjp.jpg'),(61,'2025-11-03 07:09:42','2025-11-03 07:09:42',56,'images/real-estate/cpccd8rectaF95iwGZXOPbufch7Q82jgqWVz2noS.jpg'),(62,'2025-11-03 07:13:50','2025-11-03 07:13:50',57,'images/real-estate/tHNbfvzgkUQFvrSezaoobcnfrYGslVbn1CvNXMdC.jpg'),(63,'2025-11-03 07:16:43','2025-11-03 07:16:43',58,'images/real-estate/5seK9L0X9wRobeE2FM04Eng4ZV0vlYJ8OmQ0gFzi.jpg'),(64,'2025-11-03 07:18:20','2025-11-03 07:18:20',59,'images/real-estate/rekzZ8pi4DMJNN7IMgSCfNDMQZBkIpRf3OdPczpw.jpg');
/*!40000 ALTER TABLE `realestate_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('2AKftWEo4I3hfc8DkIQ5ojOTvwjWXGWzOblZz9pX',1,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUE8ycDVqN0RQQmdnOXFqUk9pdVZWVVdwVTBEMktrVkYwMU1iUzNDTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkL3N0YXRpc3RpY3MiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1760959542),('2fhYzDrm4QGbFy90ocOWHbKyhmb2SIgTFoaxd4kr',1,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoid0gzNG9vZk5PeTBVSUptR0RIN09VN2l6dVZ4aG5QU1d6NmdVZ09kUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvdXNlci9yZWFsZXN0YXRlLWFkcz9zdGF0dXM9YWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760959544),('2MWUevkp7j4GcSuKS4VCkvB7B8fDZFvFUAPgWiXz',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoibzNTZk9iVE5TVjduQWFVREpZUFkySHpsWnlLVzhRdGVWQlZpclBxTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL3ZpZGVvcy9obHMvLi4uL21hc3Rlci5tM3U4Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760951558),('6RZEQYoMFNRnosYWMcIhwCHbFu2MexDUrgiZ2JC1',1,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoib3F4ckQ5TTA5dlJYNE83bnpIWnNMbjVvNlVuZ1NqUUlTMzQwQTQ0TiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvdXNlciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1760959634),('9KqvuswicyhyW1m25sjC8pNhinslz0R0obwPslPJ',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMVI2MTdpakhRMTRVYTgySEQ4WVZVaUtvQU53WjdsV1lwc2RJSm8xaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWR2ZXJ0aXNlbWVudHMvNTciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1760959446),('A9swsIVRiRnxSZaCI9KfbtQxqfS8DBD5Fudic4W9',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoidG5tWUQ3M1NNS3NzZk9id3h0Q25oWkJGVGpQcXRFRm1rb1QzeUJ4WCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760959670),('anQ8ZR0JXq92ufcyHJwuHDOnDksuVoj7OQ2VOEY5',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVEpDaUVCQWRPM2ZIdUJwQWdrOExUQkEzUVVFYzQybVlrcnY4bGVvMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC90ZXN0L3ZpZGVvLzQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1760443109),('DIdwFFu4ckg7zhmCGEijxjSgtwlGd5icWRpCYhZz',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYTd0c21nU3NZeWlDbU94WkJQZmJvbWFxWGUzc25DOUNXVXRubjVIciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTk6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWR2ZXJ0aXNlbWVudHM/Z2VvX2xvY2F0aW9uPVN5cmlhIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760959540),('Dla0FiFN86ej3ddYdrrVhKZ8lkD0scm3GMnBO5lx',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSkVOUHAwbmhpSVFXc3o4MHBoekdSQ1F4TEhCRVdyQjM1d3NZbzlnbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC90ZXN0L3ZpZGVvLzQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1760386833),('F8AmOHiG8mbLj1hBj3JKGE3tGt8wdODS7Mft5fbO',NULL,'127.0.0.1','curl/7.81.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiZDNKb0dWTG9hUkk2WTVNdEVUenhGUG5UR2htTzBuRmVkMkJEdjNaRCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760971689),('I5Cb5D0R1eNpe5yfAR2n6F2MmlDOcSf4muMHf5Uf',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVWFGc29RWWdEV2k0N3RpYXBXZUdhS2hhaVc3U3ZqTzVXeG9HbmFERCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6OTI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdHJlYW0vdmlkZW9zL2hscy8zbGJadTJ0UmZvdkRtMXB4VlhZWnNWN1VPNnBaTmFqWUo4ODdZZFZYL21hc3Rlci5tM3U4Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760976137),('JMejYA1T8CtVwRsKYFLyl2OrIM4jK0xgeijzikqL',1,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSzYwdmlmRTJCcHZWY1d2ckNpSUQ4bHhVZ01YT0FRVlBlUEQ1VXp2cSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkL3ZpZXdzP3JhbmdlPXdlZWtzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760959543),('kU9MIOyY63rmmsymswsVXRpaC1ASNOwrvR4ZDLTg',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSHVOeDhSejhBUXJWNDRuUktmSUdXUWY3NnRGZlVpV2VXdk5pSU1hRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6OTI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdHJlYW0vdmlkZW9zL2hscy8zbGJadTJ0UmZvdkRtMXB4VlhZWnNWN1VPNnBaTmFqWUo4ODdZZFZYL21hc3Rlci5tM3U4Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760976167),('kuDhiBAlLRYDKZ3B4CFMZG3wPBtMXvrScAK9AZxR',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHQwM2ZSRjBTbUtUS2RURHJrSTBFSE5JS1FTR0tvbmVNMzNNR0JHUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWR2ZXJ0aXNlbWVudHMvNTciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1760959644),('KUNEHUrJqkjGEopfZHgr76kohrDyqaPQbaR6OQMV',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoidVl6NFhiWk96dDZXMVV0UzdGd3k0Wk5OVDhCOWphZUdZb1BiZEdKTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWR2ZXJ0aXNlbWVudHMvNTciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1760959471),('N7OFPI9phMIXWrEyRCsGoWNA4G8wA6O2WTUxRRM4',NULL,'127.0.0.1','PostmanRuntime/7.49.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQjJjZVdUS1l0c1RtajR0TEJMWGNhNVV3RVd2M0dMTnZSeVJIM0hKRSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1761926980),('nuM39erMHWRFqaXSjRqJugjAt3hFlpWcx4wGQ5eC',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYUZnelJOM3luRnJ6SUE0R2thOG1CNWNBRWI1dHQ1S1F3c0xiNGQ3MCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1761242609),('OESeFaY7HwWE7uUXTG71KIxdaK9uSQjBhnCu4JyM',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoieWZLRzVYUnhHTzhvemRwQnlYRUpPWDlNdVVwaDd3ZTJvcnJFNVc3UiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWR2ZXJ0aXNlbWVudHMvNTciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1760959634),('qCbbdkDkAZgQfFGJ9icyxnZArRzNQl09iU3VonQF',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiNHNGOE9tQlpCUVBmVmFGYjlHWUh6czhyNllaaTMzZzJ4dm1CUXZDSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6OTI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdHJlYW0vdmlkZW9zL2hscy8zbGJadTJ0UmZvdkRtMXB4VlhZWnNWN1VPNnBaTmFqWUo4ODdZZFZYL21hc3Rlci5tM3U4Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760976050),('RWyUqzrIgWluGdlXm2tZdD6l5fyPaQDwYuYtbAP7',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiOWZQS05ZYXRMQ3lPM2Fua0VYaXo3ZkhUWHBhZko4bkpwQXBVZ0p2TiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760959544),('rYIvQl3RfiSzfWACJKjDtA7UGsojwRHQbMerDdWt',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWjdLVHhGdnRGN3JINkZMdkNrSkpGaHg2dm9kU2xNUzhOV0x0cXZTRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czoyNzoiZ2VuZXJhdGVkOjpDbW03VWdLc2pOUUxlSnI0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1762546071),('tUjQjRBbCgnj82eynyKNndtwYg2XiYCMlIOZnP0X',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiVTVQNlMwSmtVaWRJSkFuMTJQZUFKeGpuRjN6MlJEOGtWZTEwSm41MSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1760959497),('v9VlB6Hv1nTe1htXMypFFTr5N0uuXkShzACp1GyJ',1,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaTJnMktNUzlJZ2dnMVA4RkFmU0tXa1V2emMzRjA1bTgxZjk3VTJOTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvdXNlciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1760959540),('VYdQBsZJGg4HESfLwBiGpcySSiLotphWM5b19qqh',1,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ3phSzNLVVFncWQzRW94cnFpZXBBbkhtaGZScURRUHBFSkpFbW40TSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvdXNlciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1760959446),('xTLo8IhcChnlwpklzyq4TbWu1IXNqiinRUo3cKQH',NULL,'127.0.0.1','PostmanRuntime/7.48.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUlJSc00wSWw4WXlWRXh6WnBrcjZYTjZvdlJYSUExcGJqZ082OEpyWSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1760713792),('yw3Z5HGDSfjiRXNcAl7MCmg724Z948I7PuD54qGZ',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkdYdG10MmdXa3lNNEdDd0xCa09PemR4TXRzV0xFQm5kY3laN002ayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWR2ZXJ0aXNlbWVudHMvNTciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1760959544),('ZSlM3Nu75hZ9rYMboG8S21KoRZYseRgwJcRNupeU',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWGUwdXl6UUYwcnNBaVhaMHBWcWNrdzJEUjFGOElwSzRyR0hOaVc1TyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC91cGxvYWQvdmlkZW8vNjEiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1762175273);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_ratings`
--

DROP TABLE IF EXISTS `user_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_ratings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `rater_id` bigint unsigned NOT NULL,
  `rated_id` bigint unsigned NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_ratings_rater_id_rated_id_unique` (`rater_id`,`rated_id`),
  KEY `user_ratings_rated_id_foreign` (`rated_id`),
  CONSTRAINT `user_ratings_rated_id_foreign` FOREIGN KEY (`rated_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_ratings_rater_id_foreign` FOREIGN KEY (`rater_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_ratings`
--

LOCK TABLES `user_ratings` WRITE;
/*!40000 ALTER TABLE `user_ratings` DISABLE KEYS */;
INSERT INTO `user_ratings` VALUES (2,5,1,4,'This user was very helpful!','2025-10-10 08:58:56','2025-10-10 08:59:30'),(3,1,4,5,'جيد','2025-10-21 17:36:04','2025-10-25 15:04:57');
/*!40000 ALTER TABLE `user_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_last_updated_at` timestamp NULL DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pending_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pending_email_verification_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pending_email_expires_at` timestamp NULL DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `verification_code` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_code_expires_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `review` decimal(8,2) NOT NULL,
  `total_view` int NOT NULL,
  `ads_num` int unsigned NOT NULL DEFAULT '0',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_phone_unique` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'AbdAlRahman','Monajjed',NULL,'mnabood82@gmail.com',NULL,NULL,NULL,'2025-10-09 16:24:01','336977','2025-11-05 15:55:43',NULL,'$2y$12$MbC5YrTRqGz0/VXuxHCBd.oMolsK7Y2HDrZyYXTvTMq0FqDDncrWy',1,3.50,0,5,NULL,'2025-10-09 16:23:26','2025-11-07 15:14:29'),(4,'mohammad','mon',NULL,'monajjedmohammed0@gmail.com',NULL,NULL,NULL,'2025-10-10 08:41:06',NULL,NULL,NULL,'$2y$12$IZo5EPpjgOoxG0nWMN4bNevQr5ax2..QMuNoCFPfdPJoG9Tb3KHd6',0,5.00,0,0,NULL,'2025-10-10 08:40:22','2025-10-25 15:04:57'),(5,'AbdAlRahman','Monajjed',NULL,'kraimridasaeedschooles@gmail.com',NULL,NULL,NULL,'2025-10-10 08:58:15',NULL,NULL,NULL,'$2y$12$PMkAKl4O/5bE2XBYmdvxNuoSa6ikZlk.uVlDKesf6zOTiMNQxZHpa',0,0.00,0,0,NULL,'2025-10-10 08:57:37','2025-10-10 08:58:15'),(7,'عبد الرحمن','منجد',NULL,'migrant3211@gmail.com',NULL,NULL,NULL,'2025-10-24 14:30:36',NULL,NULL,NULL,'$2y$12$rgPooUFL4Ov47bs2h8ovn.UwJnKfUGwhu8JVmIAC.EI2vQrMGFeXO',0,0.00,0,0,NULL,'2025-10-24 14:06:41','2025-10-24 14:30:36');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-08 15:53:00
