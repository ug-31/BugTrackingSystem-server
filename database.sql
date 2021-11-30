CREATE DATABASE bug_tracking_system;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    password TEXT
);

CREATE TABLE projects(
    id SERIAL PRIMARY KEY,
    pname TEXT ,
    startdate TEXT,
    description TEXT,
    uid INTEGER REFERENCES users(id)
);

CREATE TABLE versions(
    id SERIAL PRIMARY KEY,
    pid INTEGER REFERENCES projects(id),
    vname TEXT ,
    vno TEXT,
    releasedate TEXT,
    releasedby TEXT,
    comment TEXT,
    activebugs INTEGER
);

CREATE TABLE bugs(
    id SERIAL PRIMARY KEY,
    pid INTEGER REFERENCES projects(id),
    vid INTEGER REFERENCES versions(id),
    bname TEXT,
    reportdate TEXT,
    reportedby TEXT,
    bugpriority TEXT,
    comment TEXT,
    bugtype TEXT,
    bugstatus TEXT
);
