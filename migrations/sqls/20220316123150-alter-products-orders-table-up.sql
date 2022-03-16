ALTER TABLE
    products_orders
ADD
    CONSTRAINT product_unique UNIQUE (product_id);