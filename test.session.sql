--@block
SHOW TABLES;

--@block;
SELECT * FROM categories;

--@block
ALTER TABLE categories ADD COLUMN type ENUM('inventory', 'material') NOT NULL;

--@block
DESCRIBE categories;

--@block
ALTER TABLE categories DROP COLUMN type;