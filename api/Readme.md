<h2>API endpoints for the explorer</h2>
The explorer uses the same api endpoint as jquery datatables for loading it's table data. Although the explorer doesn't use jquery datatables (it uses Quasar datatable component) we decided to make the table api calls compatible with jqueries version because this is far most the widest adopted datatable and numerous api endpoints are available in many different languages.

**1. Install depedencies with composer**
```
composer install
```

**2. Edit the database config file (db_config.php) to match your setup**

**3. Edit the frontends config to match the API endpoints if you haven't done it already**

```
frontend/src/statics/config/explorer_config.json
```
