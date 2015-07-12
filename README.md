REST API server
=====================================

This is a demo application of a REST server using restify as HTTP server and sequelize as ORM.
This application uses mysql as database therefore you need to have a mysql instance accessible from the machine running
the server.

The default configuration redirects all the console.log to the logs, edit the replaceConsole flag in the configuration
file to change this setting.

To run the test suite, use `npm test` command. Please note that the test suite wipes out the database table before each
run. It's a good idea not to use the same database as development/production.
The test suite uses an independent configuration file located at `./main/config/test.json`

---

### Getting up and running

1. Run `npm install` from the root directory
2. Create a mysql database using the script provided in ./sql/db.sql
3. Configure the database section in `./main/config/development.json`
4. Run `npm start` to start the server.
5. By default the API endpoints will be available at http://localhost:3000/v1/promotions
6. You can import `./test/postman_shortcuts.json` into your Postman Chrome app to start playing with the server
---