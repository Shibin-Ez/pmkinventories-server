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
select * from crudLogs;

--@block delete table crudLogs
drop table crudLogs;