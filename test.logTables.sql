--@block
use testdb2;

--@block
create table crudLogs (
    id int primary key auto_increment,
    userId int not null,
    action varchar(20) not null,
    tableName varchar(20) not null,
    columnName varchar(20) not null,
    entryId int not null,
    oldData varchar(255),
    newData varchar(255),
    timestamp timestamp default current_timestamp
);

--@block
create table prevStocks like stocks;
insert into prevStocks select * from stocks;

--@block
select * from exchanges;

--@block delete all contents of exchanges
delete from exchanges;


--@block delete table crudLogs
drop table crudLogs;

--@block
create table prevStocks like stocks;
insert into prevStocks select * from stocks;

--@block initialize all values to 0
update prevStocks set available = 0, serviceable = 0, scrapped = 0;

--@block remove all entries from stocks
delete from prevStocks;

--@block get table schema of stocks
describe exchanges;

--@block make exchanges id primary key and auto increment
ALTER TABLE exchanges MODIFY id INT PRIMARY KEY AUTO_INCREMENT;

--@block set table schema of stocks id to primary key and auto increment
ALTER TABLE prevStocks MODIFY id INT PRIMARY KEY AUTO_INCREMENT;