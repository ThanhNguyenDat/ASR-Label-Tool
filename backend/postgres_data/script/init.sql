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
) VALUES ('admin', 'root_ailab_3107', 'root_ailab@gmail.com');


INSERT INTO "role" (
    name,
    description
) VALUES ('admin', 'admin description');


INSERT INTO "user_role" (
    user_id,
    role_id
) VALUES (1, 1);
