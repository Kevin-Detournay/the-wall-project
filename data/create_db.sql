BEGIN;

-- On nettoie la BDD avant toute chose
DROP TABLE IF EXISTS "list", "card", "label", "card_has_label";

CREATE TABLE "list"(
    -- une colonne id qui doit permettre une unicité dans la table doit toujours être généré automatiquement pas la BDD et avoir un index de clé primaire (ici nous on à choisi l'option par défaut afin de pouvoir ajouter nous même la valeur de l'id pour notre seeding)
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    -- En général pour nommé une colonne qui contient une date, on ajoute le mot clé "at" à la fin de la description du type d'information. On respectera la convention de nommage en snake_case.
    -- Afin de stocker à la fois une date et une heure on utilise le format "timestamp", en prenant bien soin d'y ajouté le fuseau horaire de la configuration du serveur. pour cela on utilisera le type TIMESTAMPTZ.
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Comme c'est une date de mise à jour, celle-ci interviendra peut-être dans le futur ou pas. Donc on laisse la possibilté d'avoir une valeur NULL qui sera la sienne à la création d'un enregistrement.
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "content" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ,
    -- On a également une convention de nommage pour les colonnes de référence qui est <nom ded la table>_<colonne contenant la référence>
    "list_id" INTEGER NOT NULL REFERENCES "list"("id") ON DELETE CASCADE
    -- On peut si on le souhaite ajouté les contraintes de clé étrangèe ou autre à la fin de al définition de la table.
    -- Cela est surtout utile quand la même contrainte s'applique à plusieurs colonnes
    --,FOREIGN KEY("list_id") REFERENCES "list"("id")
);

CREATE TABLE "label"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card_has_label"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    -- On peut si on le soughaite ommettre la colonne de référence, il prendra par défaut la clé primaire de la table de référence. Mais je trouve cela moins lisible, et c'est mieux d'être le plus explicite possible pour la personne qui devra passer derrière nous.
    "card_id" INTEGER NOT NULL REFERENCES "card" ON DELETE CASCADE,
    -- Afin de nous permmettre de supprimer un label ou une carte sans avoir a supprimer d'abord les associations on peut ajouter "ON DELETE CASCADE" sur la colonne ayant un clé étrangère afin qu'il supprime automatiquement les références.
    "label_id" INTEGER NOT NULL REFERENCES "label" ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- Par contre ici on n'a pas besoin de colonne updated_at car une association ne se met pas à jour, elle se créer ou se supprime.
);

INSERT INTO "list" ("id", "name", "position")
VALUES
(1, 'première liste', 1),
(2, 'deuxième liste', 0)
;

INSERT INTO "card" ("id", "content", "color", "list_id", "position")
VALUES
(1, 'carte 1', '#ff00ff', 1, 1),
(2, 'carte 2', '#00ffff', 1, 0),
(3, 'carte 3', '#ffff00', 2, 0);

INSERT INTO "label" ("id", "name", "color")
VALUES
(1, 'urgent', '#ff0000'),
(2, 'front', '#0000ff'),
(3, 'back', '#00ff00');

INSERT INTO "card_has_label" ("card_id", "label_id")
VALUES
(1, 1),
(1, 3),
(2, 2),
(3, 1),
(3, 3);

-- Ces 3 requêtes permettent de faire démarré le compteur d'incrémentation automatique des tables à partir du dernier id présent dans les enregistrements
SELECT setval('list_id_seq', (SELECT MAX(id) from "list"));
SELECT setval('card_id_seq', (SELECT MAX(id) from "card"));
SELECT setval('label_id_seq', (SELECT MAX(id) from "label"));


COMMIT;