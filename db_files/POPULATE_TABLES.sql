INSERT INTO  
    Users(UserName, FirstName, LastName, Email, Pass)
VALUES
('user1','name1','lname1','email1','pass1'),
('user2','name2','lname2','email2','pass2'),
('user3','name3','lname3','email3','pass3'),
('user4','name4','lname4','email4','pass4'),
('user5','name5','lname5','email5','pass5'),
('user6','name6','lname6','email6','pass6');


INSERT INTO 
	Groups(GroupID, GroupName)
VALUES
(1,'group1'),
(2,'group2'),
(3,'group3');


INSERT INTO
	UserData(UserName, GroupID, UserTypes, NumPoints)
VALUES
('user1',1,0,10),
('user2',1,1,10),
('user3',2,2,10),
('user4',2,2,10),
('user5',2,3,10);


INSERT INTO 
	BlackBox(UserName, GroupID)
VALUES
('user1',3),
('user2',3),
('user3',3),
('user4',3),
('user5',3);


INSERT INTO 
	WhiteBox(UserName, GroupID) 
VALUES
('user1',1),
('user2',1),
('user3',1),
('user4',1),
('user5',1);


INSERT INTO 
	BlackList(UserName)
VALUES 
('user6')