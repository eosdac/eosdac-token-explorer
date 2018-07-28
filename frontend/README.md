<h2>Token explorer frontend</h2>

The frontend is made with [vue.js](https://vuejs.org/) and [quasar](https://quasar-framework.org/).

<h3>Deployment for development</h3>

1. **Install Vue-Cli**

    ```
    yarn global add vue-cli
    ```
    or:
    ```
    npm install -g vue-cli
    ```

2. **Install Quasar-Cli**

    Node.js >= 8.9.0 is required.
    
    ```
    yarn global add quasar-cli
    ```
    or:
    ```
    npm install -g quasar-cli
    ```
3. **Clone Repo**

4. **Install modules**

    From the project directory
    
    ```
    yarn install
    ```
    or:
    ```
    npm install
    ```

5. **Run dev server with material theme**

    ```
    quasar dev
    ```

    [Quasar Docs](https://quasar-framework.org/guide/index.html)

<h3>Deployment for production</h3>

1. **Edit the config file to point the explorer to the correct api urls**

    ```
    src/statics/config/explorer_config.json
    ```

2. **Build project for production**

    ```
    quasar build
    ```

3. **Copy content of dist/spa-mat folder to your webserver**

4. **Add .htaccess file to the root folder**

    As a singple page application, we want to direct the webserver to redirect all requests to the index.html file.
    
    ```
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
    ```

5. **Enable mod_rewrite module and AllowOverride ALL (Apache2)**

    Enable mod_rewrite
    ```
    sudo a2enmod rewrite
    ```
    Restart apache2
    ```
    sudo /etc/init.d/apache2 restart
    ```
    OR
    ```
    sudo systemctl restart apache2
    ```
    Edit apache2.conf
    ```
    <Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride ALL
        Require all granted
    </Directory>
    ```
