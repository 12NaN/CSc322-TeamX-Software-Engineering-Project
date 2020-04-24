-- The User login system that will be used for authentication.
CREATE TABLE IF NOT EXISTS Users(
    UserName VARCHAR(255),
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255),
    Pass VARCHAR(255),
    PRIMARY KEY (UserName)
);


--- The group names and their identiable information.
CREATE TABLE IF NOT EXISTS groups(
        group_id INTEGER UNSIGNED,
        group_name VARCHAR(20),
        PRIMARY KEY (group_id)
);


--- The Users status based on their respective groups.
CREATE TABLE IF NOT EXISTS user_data(
        user_name VARCHAR(20),
        group_id INTEGER UNSIGNED,
        user_type INTEGER UNSIGNED,
        reputation INTEGER,
        interests VARCHAR(120),
        "references" VARCHAR(20),
        PRIMARY KEY (user_name),
        FOREIGN KEY (user_name) REFERENCES user(user_name) 
        ON DELETE CASCADE,
        FOREIGN KEY (group_id) REFERENCES groups(group_id)
        ON DELETE CASCADE
);


--- Users that are automatically accepted from their respective group.
CREATE TABLE IF NOT EXISTS whiteBox(
        user_name VARCHAR(20),
        group_id INTEGER UNSIGNED,
        FOREIGN KEY (group_id) REFERENCES groups(group_id)
        ON DELETE CASCADE,
        FOREIGN KEY (user_name) REFERENCES user(user_name)
        ON DELETE CASCADE
);


 --- Users that are banned from their respective groups.
CREATE TABLE IF NOT EXISTS blackbox(
        user_name VARCHAR(20),
        group_id INTEGER UNSIGNED,
        FOREIGN KEY (group_id) REFERENCES groups(group_id)
        ON DELETE CASCADE,
        FOREIGN KEY (user_name) REFERENCES user(user_name)
        ON DELETE CASCADE
);


--- Users that are banned from the entire system.
CREATE TABLE IF NOT EXISTS blacklist(
        user_name VARCHAR(20),
        PRIMARY KEY (user_name)
        FOREIGN KEY (user_name) REFERENCES user(user_name)
);



