--@block
SHOW TABLES;

--@block
DESCRIBE orders;

--@block CHANGE ORDERS DATE SCHEME
ALTER TABLE orders
  CHANGE COLUMN startDate startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;


--@block
CREATE TABLE materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(10) NOT NULL,
  gstPercent DECIMAL(5, 2) NOT NULL,
  categoryId INT NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);

--@block
CREATE TABLE vendors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  gstNo VARCHAR(15) NOT NULL,
  phoneNo VARCHAR(15) NOT NULL,
  email VARCHAR(255) NOT NULL
);

--@block
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  siteId INT NOT NULL,
  materialId INT NOT NULL,
  quantity INT NOT NULL,
  vendorId INT,
  adminId INT,
  amount DECIMAL(10, 2) NOT NULL,
  invoiceNo VARCHAR(50) NOT NULL,
  startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deadline DATE NOT NULL,
  recieptURL VARCHAR(255),
  note TEXT,
  status ENUM('pending', 'approved', 'rejected', 'paid') NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (siteId) REFERENCES sites(id),
  FOREIGN KEY (materialId) REFERENCES materials(id),
  FOREIGN KEY (vendorId) REFERENCES vendors(id),
  FOREIGN KEY (adminId) REFERENCES users(id),
  CHECK (quantity > 0),
  CHECK (amount > 0),
  CHECK (startDate <= deadline)
);

