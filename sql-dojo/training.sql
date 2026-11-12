CREATE TABLE transactions (
    id INT PRIMARY KEY,     -- Unique ID for each transaction     
    type TEXT,              -- Income or Expense
    description TEXT,       -- Miete, Strom, Lebensmiettel
    amount DECIMAL(10,2)    -- €
);

-- Transaction 1 (Income)
INSERT INTO transactions (id, type, description, amount)
VALUES (1, 'income', 'Gehalt', 2500.00)

-- Transaction 2 (outcome)
INSERT INTO transactions (id, type, description, amount)
VALUES (2, 'expense', 'Miete', 850.00)

--Transaction 3 (outcome)
INSERT INTO transactions (id, type, description, amount)
VALUES (3, 'expense', 'Strom', 65.50)

INSERT INTO transactions (id,type, description, amount)
VALUES (4, 'expense', 'Internet', 39.00)

INSERT INTO transactions (id,type, description, amount)
VALUES (5, 'expense', 'Mobyle', 28.00)

INSERT INTO transactions (id,type, description, amount)
VALUES (6, 'expense', 'Car Insurance', 60.00)



SELECT * FROM transactions;

SELECT description, amount
FROM transactions
WHERE type='expense'
ORDER BY amount DESC;

SELECT COUNT(*)
FROM transactions
WHERE type='income';

SELECT SUM(amount)
FROM transactions
WHERE type='expense';

SELECT type, COUNT(*), SUM(amount)
FROM transactions
GROUP BY type;

UPDATE transactions
SET 'expense' = 45.00
WHERE id = ;

DELETE FROM transactions
WHERE id = 6;

CREATE TABLE categories (
    id INT PRIMARY KEY,     -- Unique ID for each transaction
    type TEXT;              -- Wohnen
)
-- 
INSERT INTO categories (id, name)
VALUES (1, 'Wohnen'
        2, 'Nebenkosten'
        3, 'Einkomen'
        4, 'Freizeit'
);

INSERT INTO categories (id, name)
VALUES (1, 'Wohnen');
INSERT INTO categories (id, name)
VALUES (2, 'Nebenkosten');
INSERT INTO categories (id, name)
VALUES (3, 'Einkomen');
INSERT INTO categories (id, name)
VALUES (4, 'Freizeit');

-- 1. Drop the existing invalid table
DROP TABLE IF EXISTS categories;

-- 2. Create the clean categories table
CREATE TABLE categories (
    id INT PRIMARY KEY,
    name TEXT
);

-- 3. Populate categories
INSERT INTO categories (id, name)
VALUES 
    (1, 'Wohnen'),
    (2, 'Nebenkosten'),
    (3, 'Einkommen'),
    (4, 'Freizeit');

-- 4. Verify the result
SELECT * FROM categories;

DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
    id INT PRIMARY KEY,     -- Unique ID for each transaction
    description TEXT,       -- 'Gehalt' , 'Miete'
    amount DECIMAL(10,2),   -- €
    category_id INT,        -- the new numerical linking column
    FOREIGN KEY (category_id) REFERENCES categories(id) -- declaring the link to the categories table
);

INSERT INTO transactions (id, description, amount, category_id)
VALUES
    (1, 'Gehalt', 2500, 3),
    (2, 'Miete', 850, 1),
    (3, 'Strom', 72.00, 2);

    -- Joining transactions with their categories
SELECT 
    transactions.description, 
    transactions.amount, 
    categories.name AS category_name
FROM transactions
JOIN categories 
  ON transactions.category_id = categories.id;
        