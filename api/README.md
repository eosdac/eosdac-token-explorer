<h2>API endpoints for the explorer</h2>
<p>The explorer uses the same api endpoint as [jQuery datatables](https://datatables.net/) for loading its table data. Although the explorer doesn't use jQuery datatables (it uses [Quasar datatable](https://quasar-framework.org/components/datatable.html) component) we decided to make the table api calls compatible with jQuery's version because this is the widest adopted datatable system and many api endpoints are available in many different languages.</p>

1. **Clone or download repo**

2. **Install depedencies with composer `composer install` inside the api folder**

3. **Edit the database config file (db_config.php) to match your setup**

4. **Edit the frontends config to match the API endpoints if you haven't done it already**
    
    ```
    frontend/src/statics/config/explorer_config.json
    ```
