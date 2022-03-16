create table orders (
    id serial primary key,
    status int REFERENCES status(id),
    user_id int REFERENCES users(id)
);