ALTER TABLE
    products_orders
ADD
    CONSTRAINT product_unique_per_order UNIQUE (product_id, order_id);