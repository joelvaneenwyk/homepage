﻿CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, email VARCHAR(256) not null, auth VARCHAR(256) not null);