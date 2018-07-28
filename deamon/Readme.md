<h2>Script for constructing token balances based on transfer actions</h2>

this script only works on nodes that have the history plugin enabled with the correct filter.

**1. Install modules**
```
npm install
```

**2. Create Mysql tables with triggers**

```
see sql.txt
```

**3. Run script**
```
node action_deamon_promise.js
```
![image](https://user-images.githubusercontent.com/5130772/43351339-c47a52d2-9210-11e8-81bb-3159cc0d1515.png)

**4. Use pm2 (process manager) to deamonize the script**
```
npm install pm2 -g
pm2 start action_deamon.js

//verify that the deamon is running
pm2 list
```
![image](https://user-images.githubusercontent.com/5130772/43351300-53586832-9210-11e8-8905-835646e6e94a.png)
