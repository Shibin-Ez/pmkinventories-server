--@block
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    userId VARCHAR(10) NOT NULL,
    userRole VARCHAR(20) NOT NULL,
    siteId INT,
    mobileNo VARCHAR(10) NOT NULL,
    email VARCHAR(255),
    passwordHash VARCHAR(255) NOT NULL
);

--@block
SELECT * FROM stocks;

--@block FOR DELETING USER TABLE
DROP TABLE stocks;
```


--@block
CREATE TABLE inventories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(20)
);

--@block
SELECT * FROM users;

--@block
CREATE TABLE sites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    siteType VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude VARCHAR(255),
    longitude VARCHAR(255)
);

--@block
CREATE TABLE stocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    siteId INT NOT NULL,
    inventoryId INT NOT NULL,
    available INT DEFAULT 0,
    serviceable INT DEFAULT 0,
    scrapped INT DEFAULT 0,
    UNIQUE (siteId, inventoryId)
);