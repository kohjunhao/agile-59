### House finder website ###

#### useage of program ####

Install the node packages

* Run `npm install` from the project directory to install all the node packages.


Create data base

* Run `npm run build-db-win` to create the database on Windows
* Run `npm run build-db` to create the database on mac


Delete Database

*Run `npm run clean-db-win` to delete the database on Windows 
*Run `npm run clean-db` to delete the database on Windows 


Run web app

* Run ```npm run start``` to start serving the web app (Access via http://localhost:3000)


login details 

* It can be login in via the user name or the email address

* Default user name : admin
* Default email : admin@example.com
* Default password : Admin@123


Register a new account

* A user name must only contain letters. The letter can be in uppercase and lowercase
* A email must include an @ in the email address.
* A password must consist of 8 characters, a special character and a mix of letter and number


#### Additional libraries use in this app ####

* nodemon
* express session
* mustache handle bar
* Jquery