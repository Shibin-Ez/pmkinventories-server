--@block
use testdb2;

--@block add new column with data 1000+id
ALTER TABLE inventories ADD COLUMN categoryId INT NOT NULL DEFAULT 1 AFTER inventoryId;

--@block delete column siteId
ALTER TABLE sites DROP COLUMN siteId;

--@block
select * from categories;

--@block
UPDATE categories SET name = 'other' where id = 1;

--@block siteId = 1000+id logic
update inventories set inventoryId = 1000+id;

--@block see table schema
describe inventories;

--@block
ALTER TABLE inventories MODIFY id INT PRIMARY KEY AUTO_INCREMENT;


--@block set siteId = 1000+id
update sites set siteId = 1000+id;


--@block
SELECT * FROM crudLogs;