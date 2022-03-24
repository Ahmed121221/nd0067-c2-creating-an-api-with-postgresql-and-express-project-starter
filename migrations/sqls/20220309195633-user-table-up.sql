create table users (
    id serial primary key,
    firstName varchar(80),
    lastName varchar(80),
    password varchar(255),
    email VARCHAR(255) UNIQUE NOT NULL
);