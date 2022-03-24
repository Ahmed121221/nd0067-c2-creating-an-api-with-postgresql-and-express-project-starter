create table products_orders (
    id serial primary key,
    product_id int REFERENCES products(id),
    order_id int REFERENCES orders(id),
    quantity int,
    CONSTRAINT product_unique_per_order UNIQUE (product_id, order_id)
);