export const Sites = {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    name: 'VARCHAR(255)',
    address: 'VARCHAR(255)',
    latitude: 'FLOAT(8, 5)',
    longitude: 'FLOAT(8, 5)',
}

export const Inventories = {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    name: 'VARCHAR(255)',
    unit: 'VARCHAR(10)',
}

export const Stocks = {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    siteId: 'INT FOREIGN KEY',
    inventoryId: 'INT FOREIGN KEY',
    available: 'INT',
    serviceable: 'INT',
    scrapped: 'INT',
}

export const Exchanges = {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    fromStockId: 'INT',
    toStockId: 'INT',
    quantity: 'INT',
    date: 'DATE',
}

export const InternalExchanges = {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    stockId: 'INT',
    quantity: 'INT',
    fromType: 'VARCHAR(10)',
    toType: 'VARCHAR(10)',
    date: 'DATE',
}

export const Users = {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    userRole: 'VARCHAR(20)',
    name: 'VARCHAR(255)',
    siteId: 'INT FOREIGN KEY',
    mobileNo: 'VARCHAR(20)',
    email: 'VARCHAR(255)',
}