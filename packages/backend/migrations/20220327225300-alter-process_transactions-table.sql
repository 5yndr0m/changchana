ALTER TABLE process_transactions 
ADD CONSTRAINT process_transactions_name_transaction_key_unique UNIQUE (name, transaction_key);
