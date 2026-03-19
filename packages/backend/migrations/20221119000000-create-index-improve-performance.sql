CREATE INDEX users_permissions_user_email_IDX USING BTREE ON `users-permissions_user` (email);
CREATE INDEX inboxes_users_permissions_user_IDX USING BTREE ON inboxes (users_permissions_user);
CREATE INDEX upload_file_morph_related_id_IDX USING BTREE ON upload_file_morph (related_id);
CREATE INDEX bookings_user_IDX USING BTREE ON bookings (`user`);
CREATE INDEX atk_logs_users_permissions_user_IDX USING BTREE ON atk_logs (users_permissions_user);
CREATE INDEX users_permissions_user_phone_IDX USING BTREE ON `users-permissions_user` (phone);
