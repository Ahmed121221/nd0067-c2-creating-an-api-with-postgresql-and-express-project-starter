CREATE TABLE products (
    id serial primary key,
    name varchar(120),
    price DOUBLE PRECISION,
    category_id int REFERENCES categories(id) on delete
    set
        null
);