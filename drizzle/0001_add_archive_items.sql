CREATE TABLE `archive_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(16) NOT NULL,
	`category` varchar(32) NOT NULL,
	`title` varchar(128) NOT NULL,
	`desc` text,
	`date` varchar(16),
	`src` text,
	`bvid` varchar(32),
	`thumbnail` text,
	`videoUrl` text,
	`tags` text,
	`aspect` varchar(16) DEFAULT 'landscape',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `archive_items_id` PRIMARY KEY(`id`)
);
