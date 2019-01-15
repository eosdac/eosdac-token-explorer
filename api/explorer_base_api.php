<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
include('./db_config.php');

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PWD;
$db = DB_NAME;

//set up mysql
try {
	    $conn = new PDO("mysql:host=$servername;dbname=$db", $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8') );
	    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    // $conn->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false);
}
catch(PDOException $e){
    	echo "Connection failed: " . $e->getMessage();
}

//api routing
if (isset($_GET['get'])) {

    switch ($_GET['get']) {
 
        case 'tokenstats':
            $stmt = $conn->prepare('SELECT ( SELECT COUNT(*) FROM transfers ) AS tot_transfers, ( SELECT COUNT(*) FROM balances WHERE balance > 0 ) AS tot_hodlers, (SELECT SUM(balance) FROM balances )AS tot_bal_db ');
            break;
    }
}

if (isset($_GET['chart'])) {

    switch ($_GET['chart']) {
 
        case 'topholders':
            $stmt = $conn->prepare('SELECT account,balance,is_member,has_voted,is_exchange FROM balances WHERE balance > 0 ORDER BY balance DESC LIMIT 500');
            break;
        case 'tokenactivity':
            $where = isset($_GET['account']) ? 'AND _from ="'.$_GET['account'].'" OR _to ="'.$_GET['account'].'"' : '';
            $stmt = $conn->prepare('SELECT DATE(block_time) date, COUNT(DISTINCT account_action_seq) totalCount FROM transfers WHERE account_action_seq > 200135 '.$where.' GROUP BY DATE(block_time)');
            break;
    }
}

if (isset($_GET['search'])) {

    $search = $_GET['search'];
    $stmt = $conn->prepare('SELECT account as label, account as value, balance as sublabel FROM balances WHERE account LIKE "%'.$search.'%"  LIMIT 10');

}


$stmt->execute();
// set the resulting array to associative
$result = $stmt->fetchALL(PDO::FETCH_OBJ);

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: *');
header('Content-Type: application/json');
echo json_encode($result);
?>