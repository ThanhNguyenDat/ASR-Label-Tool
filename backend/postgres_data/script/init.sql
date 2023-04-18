-- DB For Roles

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE "role" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE "user_role" (
    id SERIAL PRIMARY KEY,
    -- user_id INTEGER REFERENCES "user"(id),
    -- role_id INTEGER REFERENCES "role"(id),
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    CONSTRAINT "fk_user_role_user_id" FOREIGN KEY ("user_id") REFERENCES "user" ("id"),
    CONSTRAINT "fk_user_role_role_id" FOREIGN KEY ("role_id") REFERENCES "role" ("id")
);


INSERT INTO "user" (
    username,
    password,
    email
) VALUES ('admin', 'root_ailab_3107', 'root_ailab@gmail.com'),
        ('colab', 'colab', 'colab@gmail.com'),
        ('guest', 'guest', 'guest@gmail.com');


INSERT INTO "role" (
    name,
    description
) VALUES ('admin', 'admin description'),
        ('colab', 'colab description');


INSERT INTO "user_role" (
    user_id,
    role_id
) VALUES (1, 1),
        (1, 2),
        (2, 2);



-- DB FOR FACEID
CREATE TABLE "user_faceid" (
    id SERIAL PRIMARY KEY,
    uid INTEGER NOT NULL UNIQUE,
    avatar VARCHAR,
    name VARCHAR(50) NOT NULL,
    domain VARCHAR(20) NOT NULL UNIQUE,
    enroll_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL
);

INSERT INTO "user_faceid" (
    uid,
    avatar,
    name,
    domain,
    enroll_type,
    status
) VALUES (1, 'https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/272858595_1763530754038181_7657492639481153746_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=gB4y73PqRZEAX9QaeHL&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfDi9kiEQV4-OLMirSbr-5yYL7d2EoUFZ3WwSsLmXqtcug&oe=6442BF42', 'Nguyen Dat Thanh', 'thanhnd1', 'MyVNG', 'Enabled'),
        (2, '', 'Nguyen Dat Thanh', 'thanhnd2', 'MyVNG', 'Enabled'),
        (3, '', 'Nguyen Dat Thanh', 'thanhnd3', 'MyVNG', 'Enabled'),
        (4, '', 'Nguyen Dat Thanh', 'thanhnd4', 'MyVNG', 'Enabled'),
        (5, '', 'Nguyen Dat Thanh', 'thanhnd5', 'MyVNG', 'Enabled'),
        (6, '', 'Nguyen Dat Thanh', 'thanhnd6', 'MyVNG', 'Enabled'),
        (7, '', 'Nguyen Dat Thanh', 'thanhnd7', 'MyVNG', 'Enabled'),
        (8, '', 'Nguyen Dat Thanh', 'thanhnd8', 'MyVNG', 'Enabled'),
        (9, '', 'Nguyen Dat Thanh', 'thanhnd9', 'MyVNG', 'Enabled'),
        (10, '', 'Nguyen Dat Thanh', 'thanhnd10', 'MyVNG', 'Enabled'),
        (11, '', 'Nguyen Dat Thanh', 'thanhnd11', 'MyVNG', 'Enabled'),
        (12, '', 'Nguyen Dat Thanh', 'thanhnd12', 'MyVNG', 'Enabled'),
        (13, '', 'Nguyen Dat Thanh', 'thanhnd13', 'MyVNG', 'Enabled');
