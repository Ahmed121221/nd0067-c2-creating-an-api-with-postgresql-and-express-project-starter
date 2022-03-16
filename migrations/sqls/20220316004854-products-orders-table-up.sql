create table products_orders (
    id serial primary key,
    product_id int REFERENCES products(id),
    order_id int REFERENCES orders(id),
    quantity int
);