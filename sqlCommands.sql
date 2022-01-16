CREATE TYPE status as ENUM ('00','01'); --00 -> Inactive, 01 -> Active
CREATE TABLE country(
	ID serial PRIMARY KEY,
	country VARCHAR(25) NOT NULL,
	status status not null default '01'
);

CREATE TABLE education(
	ID serial PRIMARY KEY,
	education VARCHAR(255) NOT NULL,
	status status not null default '01'
);

CREATE TABLE user_details(
	ID serial PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
	dob DATE NOT NULL,
	profile VARCHAR(255),
	nationality INTEGER,
	education_qualification INTEGER,
    created_ts TIMESTAMP,
    updated_ts TIMESTAMP,
	status status not null default '01',
	CONSTRAINT fk_user_education
		FOREIGN KEY (education_qualification)
		REFERENCES education (ID),
	CONSTRAINT fk_user_nationality
		FOREIGN KEY (nationality)
		REFERENCES country (ID)
);

INSERT INTO country (country) VALUES ('Afghanistan'), ('Albania'),('Algeria'),('Bahrain'),('Bangladesh'), ('Belgium'),('Brazil'),('China'), ('France'),('India'),
('Indonesia'), ('Iran'), ('Iraq'),('Kuwait'),('Mexico'),('Nepal'),('Pakistan'),('Philippines'),('Saudi Arabia');

INSERT INTO education (education) values ('Higher Secondory'), ('Bachelors Degree'), ('Masters Degree'), ('Doctorate'), 
('Special Certifications');