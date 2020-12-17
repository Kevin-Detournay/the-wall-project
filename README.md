# oKanban : Atelier Conception

## Description du projet

On refait Trello !

- On souhaite créer une application de type Kanban où il est possible de créer des cartes à l'intérieur de listes.
- L'utilisateur peut créer autant de listes qu'il désire et mettre autant de cartes à l'intérieur de ces listes.
- Chaque liste dispose d'un nom.
- Chaque carte dispose d'un titre, d'une position au sein de la liste, d'une couleur (optionnelle) et d'un ou plusieurs label(s) (optionnel(s))

On se base sur ce besoin pour créer le MCD de l'application.

**Important** : Pas question d'écrire la moindre ligne de SQL ! On s'arrête à la conception aujourd'hui. La mise en place effective de la BDD, c'est pour demain.

## Étape 1 : MCD

**Outils** => [Mocodo](http://mocodo.wingi.net/)  
**Récap** => [Conception d'un MCD](https://github.com/O-clock-Alumni/fiches-recap/blob/master/bdd/conception-03-mcd.md)

### Entités

- un nom unique
- deux points `:`
- les attributs, séparés par une virgule `,`
- exemples :  
`AUTHOR: pen name, real name, date of birth, language`  
`BOOK: title, number of pages, type, release date`

### Relations

- [rappels](https://github.com/O-clock-Alumni/fiches-recap/blob/master/bdd/conception-03-mcd.md#cardinalit%C3%A9s)
- définir les cardinalités en se posant les bonnes questions :
  - _1 entité `A` est liée à combien d'entité `B` minimum ?_
    - 0 ou 1
  - _1 entité `A` est liée à combien d'entité `B` maximum ?_
    - 1 ou n
  - _1 entité `B` est liée à combien d'entité `A` minimum ?_
    - 0 ou 1
  - _1 entité `B` est liée à combien d'entité `A` maximum ?_
    - 1 ou n
  - au final, on a 1  cardinalité pour chaque "sens" de la relation
    - exemple : `A` => `B` = `0,n`
    - exemple : `B` => `A` = `0,1`
    - => on parle alors de relation de type `1:n` (on prend le max de chaque cardinalité)
- pour représenter cela sur _Mocodo_
  - écrire sur une seule ligne (comme pour une entité)
    - un nom unique pour la relation
    - une virgule `,`
    - minimum et maximum d'une des deux cardinalités, collés l'un à l'autre, ex : `11`, `0N` (:warning: c'est zéro-N, pas `on` en majuscules) etc.
    - le nom de l'entité visée par la cardinalité
    - une virgule `,`
    - min et max de l'autre cardinalité
    - le nom de l'autre entité
  - exemple : `WRITES, 0N AUTHOR, 11 BOOK` (:warning: zéro-N)

#### Positionnement

Mocodo utilise un système de grille très simple _(Pensez aux tableaux HTML, le fonctionnement est assez identique !)_

- Écrivez chaque élément (entité ou relation) sur une ligne dédiée
  - Mocodo va les positionner côte à côte horizontalement (comme des `<td>`)
- Sautez une ligne dans le script pour passer à la ligne suivante dans le schéma
  - Mocodo dessinera le prochain élément tout à gauche, en dessous de la ligne précédente (comme si vous aviez changé de `<tr>`)
- Écrivez simplement `:` sur une ligne pour laisser la "case" vide (comme une `<td> </td>` avec un simple espace dedans)

## Étape 2 : User Stories

En tant que _client_, je veux _un document_ dans le but de _comprendre les fonctionnalités de mon application_.

Complètez le tableau dans le fichier [user_stories.md](./user_stories.md).
