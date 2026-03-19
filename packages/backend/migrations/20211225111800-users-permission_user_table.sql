-- Set points default to 0
ALTER TABLE `users-permissions_user` MODIFY COLUMN points INT NOT NULL DEFAULT 0;
ALTER TABLE users-`users-permissions_user` MODIFY COLUMN vaccinated tinyint NOT NULL DEFAULT 0;
