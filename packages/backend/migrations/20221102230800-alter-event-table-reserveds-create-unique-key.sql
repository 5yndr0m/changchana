ALTER TABLE event_table_reserveds
ADD CONSTRAINT event_table_reserveds_key_unique UNIQUE (event, round_id, zone_id, table_number);
