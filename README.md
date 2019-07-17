# Chat en ligne BeCode Messenger
* Projet de groupe avec Frédérick Van Isschot, Enzo Buono, Cindy Buchet et Cléo Buck.
* Formation: BeCode
* Du 11 au 15 juillet
* HTML, CSS et NodeJS

## Instructions de l'exercice

<details><summary>Afficher les détails</summary>

Créer une application de chat. Les utilisateurs n'ont pas obligations à se logger pour pouvoir envoyer des messages. Ils doivent juste choisir un pseudo.

## Brief Client
- En tant qu'utilisateur je veux choisir mon pseudo pour envoyer des messages
- En tant qu'utilisateur je veux pouvoir envoyer des messages à tout le monde
- En tant qu'utilisateur, pour chaque message, je veux voir la date d'envoie et l'émetteur, pour faciliter la compréhension de la conversation.
- En tant qu'utilisateur je veux voir les messages de haut en bas du moins récent au plus récent, pour pouvoir suivre le fil de la discussion en lisant de bas en haut.
- En tant qu'utilisateur je veux pouvoir avoir un historique des conversations.
- Pour le design, vous pouvez vous inspirer de Ryver ou Discord mais faites simple ! Concentrez-vous sur le back. 

## Bonus
- Utilisez une architecture MVC pour la structure de vos fichiers.
- Utilisez firebase pour s'authentifier avec github.

## Techno
Liste non-exhaustive.

- Nodejs
    - npm
        - [socket.io](https://www.npmjs.com/package/socket.io)
- mysql, mariadb, [postgresql](https://github.com/simplonco/nodejs-express-sql) ou encore mongoDB, à votre guise pour la db.

Pour le design n'hésitez pas à piocher dans les [templates existants](https://codepen.io/search/pens?q=chat&page=1&order=popularity&depth=everything)   
</details>

## Comment le tester localement?

1. Cloner le repository
2. Vérifier si node.js est installé dans votre ordinateur
3. Ouvrir le terminal et naviguer dans le dossier du projet
4. Entrer `npm install` pour installer les modules requises
5. Entrer `npm start` pour démarer le serveur du chat
6. Naviguer sur `http://localhost:4050/` pour accèder à la page du chat

## Le projet

Ce projet nous à appris à créer un chat en ligne qui permet d'entrer des message et faire en sorte que tous ces messages soient stockés dans une base de donnée et que ceux-ci soient affichés chez tous ceux qui sont connectés en temps réel.

On à donc utilisé *socket*, un module NPM qui permet de gérer des événements en temps réel et qui se transmettent entre les personnes connectés.

Ces messages sont ensuite envoyés chez MongoDB, un site de base de donnée sous forme d'objet json.