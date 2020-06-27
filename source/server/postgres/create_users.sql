CREATE TABLE IF NOT EXISTS users(
	id SERIAL PRIMARY KEY,
	profile_id VARCHAR(256) not null,
	login VARCHAR(256) not null,
	avatar_url VARCHAR(256) not null,
	accessToken VARCHAR(256) not null);
