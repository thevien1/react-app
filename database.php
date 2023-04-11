<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

date_default_timezone_set("Asia/Ho_Chi_Minh");
$host = "localhost"; 
$user = "root"; 
$password = ""; 
$dbname = "reactapp"; 
$id = '';
 
$con = mysqli_connect($host, $user, $password,$dbname);
 
$method = $_SERVER['REQUEST_METHOD'];
 
 
if (!$con) {
  die("Connection failed: " . mysqli_connect_error());
}
 
 
switch ($method) {
    case 'GET':
      if(isset($_GET["id"])){
        $id = $_GET['id'];  
        $sql = "select * from roles".($id?" where id=$id":''); 
      }
      else if(isset($_GET["get_client_id"])){
        
        $id = $_GET['get_client_id'];  
        $sql = "select * from clients".($id?" where id=$id":''); 
      } 
      else if(isset($_GET["get_payment_id"])){
        $id = $_GET['get_payment_id'];  
        $sql = "select * from payments".($id?" where id=$id":''); 
      }
      else if(isset($_GET["wallets"])){
        $id = $_GET['id'];  
        $sql = "select * from wallets"; 
      }
      else if(isset($_GET["get_games"])){
        $searchName = str_replace(' ', '%', $_GET['name']); 
        $sql = "select * from games WHERE name LIKE '%{$searchName}%' AND deletedAt IS NULL"; 
      } 
      else if(isset($_GET["get_withdraws_id"])){
        $sql = "select * from withdrawtransactions WHERE paymentId='".$_GET["get_withdraws_id"]."' AND status='in-progress' AND deletedAt IS NULL ORDER BY `withdrawtransactions`.`id` DESC"; 
      }
      else if(isset($_GET["get_withdraws"])){
        $sql = "select * from withdrawtransactions WHERE  status='in-progress' AND deletedAt IS NULL ORDER BY `withdrawtransactions`.`id` DESC"; 
      }
      else if(isset($_GET["get_orderId"])){
        $id = $_GET['get_orderId'];  
        $sql = "select * from orders".($id?" where id=$id":''); 
       
      }
      else if(isset($_GET["get_wallets"])){
        $searchName = str_replace(' ', '%', $_GET['name']); 
        if($_GET['gameId']=='undefined'){
          $_GET['gameId']='';
        }
        $name = str_replace(' ', '%', $_GET['name']);  
        $gameId = $_GET['gameId'];
        $number = $_GET['number'];
        $name = $_GET['name'];

        $sql = "SELECT * FROM wallets WHERE deletedAt IS NULL ";

        if (!empty($gameId)) {
          $sql .= "AND gameId='$gameId' ";
        }
        if (!empty($number)) {
          $sql .= "AND orderNumber='$number' ";
        }
        if (!empty($name)) {
          $sql .= "AND name LIKE '%$name%' ";
        }
        $sql .= "ORDER BY wallets.orderNumber ASC";
        if (empty($_GET['gameId']) && empty($_GET['number']) && empty($_GET['name'])) {
          $sql = "SELECT * FROM wallets WHERE deletedAt IS NULL ORDER BY id ASC";
        }
        // $sql = "select * from walletss WHERE name LIKE '%{$searchName}%' AND deletedAt IS NULL"; 
      }  
      else if(isset($_GET["get_reports"])){
        $time = explode(",", $_GET["datetime"]);
        $from=explode(" 00:00:00",$time[0]);
        $to=explode(" 00:00:00",$time[1]);
$dateFrom = date('Y-m-d 00:00:00', strtotime($from[0]));
$dateTo = date('Y-m-d 23:59:00', strtotime($to[0]));

if($_GET['userId']=='undefined'){
  $_GET['userId']='';
}
if($_GET['gameId']=='undefined'){
  $_GET['gameId']='';
}

$sql = "SELECT * FROM orders WHERE 1=1";
$sql .= !empty($_GET['userId']) ? " AND userId='{$_GET['userId']}'" : "";
$sql .= !empty($_GET['gameId']) ? " AND gameId='{$_GET['gameId']}'" : "";
$sql .= !empty($dateFrom) ? " AND (createdAt BETWEEN '$dateFrom' AND '$dateTo')" : "";
$sql .= " AND deletedAt IS NULL ORDER BY createdAt ASC";
      }
      else if(isset($_GET["get_clients"])){
        $name=$_GET['name'];
        $sql = "SELECT * FROM clients WHERE 1=1";
        $sql .= !empty($_GET['name']) ? " AND  fullName LIKE '%$name%'  " : "";
        $sql .= !empty($_GET['phoneNumber']) ? " AND phoneNumber='{$_GET['phoneNumber']}'" : "";

        $sql .= " AND deletedAt IS NULL ORDER BY id DESC";

      }
      else if(isset($_GET["get_walles_gameId"])){
        $sql = "select * from wallets WHERE gameId='".$_GET["get_walles_gameId"]."' AND deletedAt IS NULL ORDER BY `wallets`.`orderNumber` ASC"; 
      }
      else if(isset($_GET["get_budgets_walletId"])){
        $ids = $_GET["get_budgets_walletId"];
        $sql = "SELECT * FROM budgets WHERE walletId IN ($ids) AND deletedAt IS NULL ORDER BY `budgets`.`orderNumber` ASC"; 
      }
      else if(isset($_GET["get_transactions_clienId"])){
        $sql = "select * from transactions WHERE clientId='".$_GET["get_transactions_clienId"]."' AND remainAmount > 0 AND deletedAt IS NULL ORDER BY `transactions`.`remainAmount` ASC"; 
      }
      else if(isset($_GET["get_users"])){
        // $sql = "SELECT users.id as userId, roles.id as roleId,users.name
        // FROM users
        // INNER JOIN roles
        // ON users.roleId = roles.id
        // WHERE users.deletedAt IS NULL OR users.deletedAt > NOW()"; 
        $searchName = str_replace(' ', '%', $_GET['name']); 
        $searchPhone = str_replace(' ', '%', $_GET['phoneNumber']); 
        $sql = "SELECT users.id as userId, roles.id as roleId,users.name,users.email,users.phoneNumber,users.bankName,users.bankAccount,users.id,roles.code
        FROM roles
        INNER JOIN users
        ON users.roleId = roles.id
        WHERE users.name LIKE '%{$searchName}%' AND users.phoneNumber LIKE '%{$searchPhone}%' AND users.deletedAt IS NULL "; 
      }
      else if(isset($_GET["get_users_id"])){
        $id = $_GET['get_users_id'];  
        $sql = "SELECT users.id as userId, roles.id as roleId,users.name,users.email,users.phoneNumber,users.bankName,users.bankAccount,users.id,roles.code,users.zaloId,users.maxAbsent,users.bonus,users.salary,users.allowSms,users.allowZalo
        FROM users
        INNER JOIN roles
        ON users.roleId = roles.id ".($id?" where users.id=$id":'');;
      }
      else if(isset($_GET["get_games_id"])){
        $id = $_GET['get_games_id'];  
        $sql = "select * from games".($id?" where id=$id":'');
      }
      else if(isset($_GET["get_games_budgetId"])){
        $gameId = $_GET['get_games_budgetId'];  
$sql = "SELECT budgets.name,
        wallets.price AS walletsPrice,
        wallets.amount AS walletsAmount,
        wallets.name AS walletsName,
        wallets.id AS walletsId,
        wallets.packages,
        budgets.quantity AS budgetsQuantity,
        wallets.positive AS positive,
        budgets.price AS budgetsPrice,
        budgets.quantity * budgets.price / wallets.price AS totalAmount,
        budgets.quantity * budgets.price   AS usedQuantity
        FROM budgets 
        JOIN wallets ON budgets.walletId = wallets.id 
        JOIN games ON wallets.gameId = games.id 
        WHERE wallets.gameId = $gameId 
            AND budgets.quantity > 0 
            AND wallets.deletedAt IS NULL
        ORDER BY budgets.price ASC";
      }
      else if(isset($_GET["get_games_walletId"])){
        $gameId = $_GET['get_games_walletId'];  
$sql = "SELECT budgets.name,
        budgets.walletId AS budgetId,
        wallets.price AS walletsPrice,
        wallets.amount AS walletsAmount,
        wallets.name AS walletsName,
        wallets.id AS walletsId,
        wallets.packages,
        budgets.quantity AS budgetsQuantity,
        wallets.positive AS positive,
        budgets.price AS budgetsPrice
        FROM budgets 
        JOIN wallets ON budgets.walletId = wallets.id 
        JOIN games ON wallets.gameId = games.id 
        WHERE wallets.gameId = $gameId 
            AND wallets.deletedAt IS NULL
          ORDER BY wallets.orderNumber ASC, budgets.orderNumber ASC";
      }
      else if(isset($_GET["get_wallets_id"])){
        $id = $_GET['get_wallets_id'];  
        $sql = "select * from wallets".($id?" where id=$id":'');
      }
      else if(isset($_GET["get_budgets_id"])){
        $sql = "select * from budgets WHERE walletId='".$_GET['get_budgets_id']."' AND `deletedAt` IS NULL ORDER BY `budgets`.`orderNumber` ASC";
      }
      else if(isset($_GET["connectLogin"])){
         $sql = "select * from users WHERE email='".$_GET['email']."' OR password='".$_GET['password']."' ";  
      }
      else if(isset($_GET["userEmail"])){
        $sql = "select * from users WHERE email='".$_GET["userEmail"]."' AND `deletedAt` IS NULL "; 
      }
      else if(isset($_GET["get_payments"])){
        $sql = "select * from payments WHERE `deletedAt` IS NULL ORDER BY `payments`.`orderNumber` ASC"; 
      }
      else if(isset($_GET["get_transactions"])){
        $sql = "SELECT * FROM transactions WHERE 1=1";
        $sql .= !empty($_GET['status']) ? " AND status='{$_GET['status']}'" : "";
        $sql .= !empty($_GET['code']) ? " AND code='{$_GET['code']}'" : "";
        $sql .= $_GET['remain'] !== 'false' ? " AND remainAmount > 0" : "";
        $sql .= " AND deletedAt IS NULL ORDER BY updatedAt DESC, id DESC";
      }
      else if(isset($_GET["get_orders"])){
        if($_GET['status']=='none'){
          $_GET['status']='';
        }
        if($_GET['paymentStatus']=='none'){
          $_GET['paymentStatus']='';
        }
        if($_GET['clientId']=='undefined'){
          $_GET['clientId']='';
        }
        $sql = "SELECT * FROM orders WHERE 1=1";
        $sql .= !empty($_GET['status']) ? " AND status='{$_GET['status']}'" : "";
        $sql .= !empty($_GET['paymentStatus']) ? " AND paymentStatus='{$_GET['paymentStatus']}'" : "";
        $sql .= !empty($_GET['clientId']) ? " AND clientId='{$_GET['clientId']}'" : "";
        $sql .= !empty($_GET['orderId']) ? " AND id='{$_GET['orderId']}'" : "";
        $sql .= " AND deletedAt IS NULL ORDER BY id DESC";
      }
      else if(isset($_GET["get_budgetsorders"])){
        $sql = "SELECT budgets.name,
        budgetsorders.orderId,
        budgetsorders.budgetId AS budgetId,
        wallets.price AS walletsPrice,
        wallets.amount AS walletsAmount,
        wallets.name AS walletsName,
        wallets.id AS walletsId,
        wallets.packages,
        budgets.quantity AS budgetsQuantity,
        wallets.positive AS positive,
        budgets.price AS budgetsPrice,
        budgetsorders.quantity AS quantity,
        CASE WHEN wallets.positive = 1
             THEN (budgetsorders.quantity * budgets.price) / (wallets.price * wallets.amount)
             ELSE budgetsorders.quantity
        END AS usedQuantity,
        CASE WHEN wallets.positive = 0
             THEN (budgetsorders.quantity * budgets.price) / (wallets.price / wallets.amount)
             ELSE budgetsorders.quantity
        END AS totalAmount
 FROM budgetsorders 
 JOIN budgets ON budgetsorders.budgetId = budgets.id 
 JOIN wallets ON budgets.walletId = wallets.id 
 ORDER BY wallets.orderNumber ASC, budgets.orderNumber ASC
 ";
        // $sql ="select * from budgetsorders WHERE `deletedAt` IS NULL ORDER BY `budgetsorders`.`orderId` DESC";
      }
      else if(isset($_GET["get_budgetsordersId"])){
        $orderId=$_GET["get_budgetsordersId"];
        $sql = "SELECT budgets.name,
        budgetsorders.orderId,
        budgetsorders.budgetId AS budgetId,
        wallets.price AS walletsPrice,
        wallets.packages,
        wallets.amount AS walletsAmount,
        wallets.name AS walletsName,
        wallets.id AS walletsId,
        budgets.quantity AS budgetsQuantity,
        wallets.positive AS positive,
        budgets.price AS budgetsPrice,
        budgetsorders.quantity AS quantity,
        CASE WHEN wallets.positive = 1
             THEN (budgetsorders.quantity * budgets.price) / (wallets.price * wallets.amount)
             ELSE budgetsorders.quantity
        END AS usedQuantity,
        CASE WHEN wallets.positive = 0
             THEN (budgetsorders.quantity * budgets.price) / (wallets.price / wallets.amount)
             ELSE budgetsorders.quantity
        END AS totalAmount
 FROM budgetsorders 
 JOIN budgets ON budgetsorders.budgetId = budgets.id 
 JOIN wallets ON budgets.walletId = wallets.id 
 JOIN orders ON budgetsorders.orderId = orders.id
 WHERE budgetsorders.orderId = $orderId
 ORDER BY wallets.orderNumber ASC, budgets.orderNumber ASC;

 ";
        // $sql ="select * from budgetsorders WHERE `deletedAt` IS NULL ORDER BY `budgetsorders`.`orderId` DESC";
      }
      else if(isset($_GET["get_budgets"])){
        $sql ="select * from budgets WHERE `deletedAt` IS NULL ORDER BY `budgets`.`orderNumber` ASC";
      }
      else if(isset($_GET["get_photos"])){
        $sql ="select * from orderphotos WHERE `deletedAt` IS NULL ORDER BY `orderphotos`.`id` ASC";
      }
      else if(isset($_GET["get_photos_orderId"])){
        $sql ="select * from orderphotos WHERE orderId='".$_GET["get_photos_orderId"]."' AND `deletedAt` IS NULL ORDER BY `orderphotos`.`id` ASC";
      }
      else if(isset($_GET["get_transaction_orderId"])){
        $sql ="SELECT transactions.code,
        payments.owner,
        clients.fullName,
        transactionsorders.transactionId,
        transactions.remainAmount AS remainAmount,
        transactionsorders.amount AS transactionsordersAmount
        FROM transactionsorders
        INNER JOIN transactions ON transactionsorders.transactionId = transactions.id
        INNER JOIN payments ON transactions.paymentId = payments.id
        INNER JOIN clients ON transactions.clientId = clients.id
        WHERE transactionsorders.orderId = '".$_GET["get_transaction_orderId"]."' AND transactionsorders.deletedAt IS NULL
        ORDER BY transactionsorders.id ASC";
      }
      else if(isset($_GET["get_transactionsAmount"])){
        $sql = "select * from transactions WHERE createdAt >= DATE_FORMAT(NOW(), '%Y-%m-01') AND createdAt <= LAST_DAY(NOW()) AND `deletedAt` IS NULL ORDER BY `transactions`.`updatedAt` DESC,id DESC"; 
      }
      break;
    case 'POST':
        if(isset($_GET["id"])){
            $id = $_GET['id'];  
            $name = $_POST["name"];
            $email = $_POST["email"];
            $country = $_POST["country"];
            $city = $_POST["city"];
            $job = $_POST["job"];
            $sql = "UPDATE contacts SET name='$name', email='$email', city='$city', country='$country', job='$job' WHERE id = $id"; 
        }
        else if(isset($_GET["delete_wallet"])){
          $delete = $_GET['delete_wallet']; 
          $sql = "UPDATE wallets SET deletedAt='".date('Y-m-d H:i:s')."' WHERE id = '$delete' "; 
          $sql_u = mysqli_query($con,"select * from wallets WHERE id='$delete' "); 
          $row_u = mysqli_fetch_array($sql_u); 
          mysqli_query($con,"UPDATE budgets SET deletedAt='".date('Y-m-d H:i:s')."' WHERE walletId ='".$row_u['id']."'"); 
        }
        
        else if(isset($_GET["delete_user"])){
          $delete = $_GET['delete_user']; 
          $sql = "UPDATE users SET deletedAt='".date('Y-m-d H:i:s')."' WHERE id = '$delete' "; 
          $sql_u = mysqli_query($con,"select * from users WHERE id='$delete' "); 
          $row_u = mysqli_fetch_array($sql_u); 
          mysqli_query($con,"UPDATE roles SET deletedAt='".date('Y-m-d H:i:s')."' WHERE id ='".$row_u['roleId']."'"); 
        }
        else if(isset($_GET["delete_client"])){
          $clientId = $_GET['delete_client']; 
$sql = "UPDATE clients 
        LEFT JOIN orders ON clients.id = orders.clientId
        LEFT JOIN transactions ON clients.id = transactions.clientId
        LEFT JOIN transactionsOrders ON transactions.id = transactionsOrders.transactionId
        SET clients.deletedAt = '".date('Y-m-d H:i:s')."',
            orders.deletedAt = '".date('Y-m-d H:i:s')."',
            transactions.deletedAt = '".date('Y-m-d H:i:s')."',
            transactionsOrders.deletedAt = '".date('Y-m-d H:i:s')."'
        WHERE clients.id = $clientId";
 
        }
        else if(isset($_GET["delete_transaction"])){
          $delete = $_GET['delete_transaction']; 
          if($_GET['status']=='Delete'){
            $sql = "UPDATE transactions SET deletedAt = '".date('Y-m-d H:i:s')."' WHERE id =  '$delete' "; 
            mysqli_query($con,"UPDATE orders
            SET paidAmount = paidAmount - (
            SELECT SUM(amount)
            FROM transactionsorders
            WHERE orderId = orders.id AND transactionId = $delete AND deletedAt IS NULL
            ),
            paymentStatus =
            CASE
            WHEN paidAmount > 0 THEN 'partPaid'
            ELSE 'unPaid'
            END
            WHERE EXISTS (
            SELECT 1
            FROM transactionsorders
            WHERE orderId = orders.id AND transactionId = $delete AND deletedAt IS NULL
            )");
            mysqli_query($con,"UPDATE transactionsorders SET deletedAt = '".date('Y-m-d H:i:s')."' WHERE transactionId = $delete ");
          }else{
            $sql = "UPDATE payments 
            SET 
                onHoldBalance = onHoldBalance - 
                CASE currency 
                    WHEN 'VND' THEN 
                        (SELECT amount FROM transactions WHERE id = $delete) 
                    ELSE 
                        (SELECT amount FROM transactions WHERE id = $delete) / 22200 
                END, 
                balance = balance + 
                CASE currency 
                    WHEN 'VND' THEN 
                        (SELECT amount FROM transactions WHERE id = $delete) 
                    ELSE 
                        (SELECT amount FROM transactions WHERE id = $delete) / 22200 
                END 
            WHERE 
                id = (SELECT paymentId FROM transactions WHERE id = $delete)
            "; 
            mysqli_query($con,"UPDATE transactions SET status = 'completed' WHERE id = $delete ");
          }
 
        }
        else if(isset($_POST["create_game"])){
          $_POST['name']=mysqli_real_escape_string($con,$_POST['name']);
          $name = $_POST["name"];
          $description = $_POST["description"];
          
        
        if(!isset($_FILES["avatar"])){
          $sql = "insert into games (name, description, image,createdAt,updatedAt,deletedAt) values ('a', 'a','','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)"; 
        }else{
          $upload_dir = 'public/images';
          $avatar_name = $_FILES["avatar"]["name"];
          $avatar_tmp_name = $_FILES["avatar"]["tmp_name"];
          $time_tmp = time().'_'.$avatar_name;
          // $linktmp='http://muoiti.com/uploads/'.$time_tmp;
          $linktmp=$time_tmp;
          move_uploaded_file($avatar_tmp_name , 'public/images/'.$time_tmp);
          $sql = "insert into games (name, description, image,createdAt,updatedAt,deletedAt) values ('$name', '$description','$linktmp','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)"; 
        }
        }  
        else if(isset($_POST["create_user"])){
          $sql = "insert into roles (code, name, createdAt, updatedAt,deletedAt) values ('admin','2','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)"; 
          if ($con->query($sql) === TRUE) {
            $last_id = $con->insert_id;
          }
          if($_POST['allowZalo']=='true'){
            $_POST['allowZalo']='1'; 
          }
          if($_POST['allowSms']=='true'){
            $_POST['allowSms']='1'; 
          }
          $_POST['password']=md5($_POST['password']);
          $sql = "INSERT INTO users (roleId,name,email,password,avatarUrl,createdAt,updatedAt,deletedAt,allowSms,allowZalo,zaloId,phoneNumber,salary,bonus,bankAccount,bankName,maxAbsent) 
                VALUES ($last_id,'".$_POST['name']."','".$_POST['email']."','".$_POST['password']."','','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL,'".$_POST['allowSms']."','".$_POST['allowZalo']."','".$_POST['zaloId']."','".$_POST['phoneNumber']."','".$_POST['salary']."','".$_POST['bonus']."','".$_POST['bankAccount']."','".$_POST['bankName']."','".$_POST['maxAbsent']."')" ;
        }
        else if(isset($_POST["update_user"])){
          $id = $_POST['id']; 
          $sql = "UPDATE roles SET name='".$_POST['name']."',code='".$_POST['code']."', updatedAt='".date('Y-m-d H:i:s')."' WHERE id = $id"; 
          if ($con->query($sql) === TRUE) {
            $last_id = $con->insert_id;
          }
          if($_POST['allowZalo']=='true'){
            $_POST['allowZalo']='1'; 
          }
          if($_POST['allowSms']=='true'){
            $_POST['allowSms']='1'; 
          }
              if($_POST['password']==''){
                $sql = "UPDATE users SET name='".$_POST['name']."',email='".$_POST['email']."',bankName='".$_POST['bankName']."',bankAccount='".$_POST['bankAccount']."',phoneNumber='".$_POST['phoneNumber']."',salary='".$_POST['salary']."',bonus='".$_POST['bonus']."',maxAbsent='".$_POST['maxAbsent']."',allowSms='".$_POST['allowSms']."',allowZalo='".$_POST['allowZalo']."',zaloId='".$_POST['zaloId']."',updatedAt='".date('Y-m-d H:i:s')."' WHERE id = $id"; 
              }else{
              $_POST['password']=md5($_POST['password']);
              $sql = "UPDATE users SET name='".$_POST['name']."',email='".$_POST['email']."',password='".$_POST['password']."',bankName='".$_POST['bankName']."',bankAccount='".$_POST['bankAccount']."',phoneNumber='".$_POST['phoneNumber']."',salary='".$_POST['salary']."',bonus='".$_POST['bonus']."',maxAbsent='".$_POST['maxAbsent']."',allowSms='".$_POST['allowSms']."',allowZalo='".$_POST['allowZalo']."',zaloId='".$_POST['zaloId']."',updatedAt='".date('Y-m-d H:i:s')."' WHERE id = $id"; 
              }
        }
        else if(isset($_POST["update_game"])){
          $id = $_POST['id']; 
          $name = $_POST["name"];
          $description = $_POST["description"];
           
          if(!isset($_FILES["avatar"])){
            $sql = "UPDATE games SET name='$name', description='$description',updatedAt='".date('Y-m-d H:i:s')."' WHERE id = $id"; 
          }else{
            $avatar_name = $_FILES["avatar"]["name"];
            $avatar_tmp_name = $_FILES["avatar"]["tmp_name"];
            $time_tmp = time().'_'.$avatar_name;
            $linktmp=$time_tmp;
            move_uploaded_file($avatar_tmp_name , 'public/images/'.$time_tmp);
            $sql = "UPDATE games SET name='$name', description='$description',image='$linktmp',updatedAt='".date('Y-m-d H:i:s')."'  WHERE id = $id"; 
          } 
        }
        else if(isset($_POST["create_wallet"])){
          if($_POST['positive']=='true'){
            $_POST['positive']='1'; 
          }
          if($_POST['notes']=='undefined'){
            $_POST['notes']=''; 
          }
          $sql = "INSERT INTO wallets (gameId,userId ,name,packages,remainPackages,price,notes,createdAt,updatedAt,deletedAt,orderNumber,positive,amount) 
                VALUES ('".$_POST['gameId']."','".$_POST['userId']."','".$_POST['name']."','".$_POST['packages']."','".$_POST['remainPackages']."','".$_POST['price']."','".$_POST['notes']."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL,'".$_POST['orderNumber']."','".$_POST['positive']."','".$_POST['amount']."')" ;
        }
        else if(isset($_POST["create_budget_wallet"])){
          $sql_w = mysqli_query($con,"select * from wallets ORDER BY `wallets`.`id` DESC"); 
          $row_w = mysqli_fetch_array($sql_w); 
          $lay_id= $row_w['id'];
          $sql = "INSERT INTO budgets (walletId ,name,quantity,remainQuantity,price,createdAt,updatedAt,deletedAt,orderNumber,usedQuantity) 
                VALUES ('$lay_id','".$_POST['budgetName']."','".$_POST['budgetQuantity']."','".$_POST['budgetRemainPackages']."','".$_POST['budgetPrice']."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL,'".$_POST['orderNumber']."','0')" ;
        }
        else if(isset($_POST["update_wallet"])){
          $id = $_POST['id']; 
          if($_POST['positive']=='true'){
            $_POST['positive']='1'; 
          }
          $sql = "UPDATE wallets SET name='".$_POST['name']."',gameId='".$_POST['gameId']."',userId='".$_POST['userId']."',packages='".$_POST['packages']."',remainPackages='".$_POST['remainPackages']."',price='".$_POST['price']."',notes='".$_POST['notes']."',orderNumber='".$_POST['orderNumber']."',positive='".$_POST['positive']."',amount='".$_POST['amount']."',updatedAt='".date('Y-m-d H:i:s')."' WHERE id = $id"; 
        }
        else if(isset($_POST["update_budget_wallet"])){
          $id = $_POST['walletId']; 
          if($_POST["status"]=='false'){
            $sql = "UPDATE budgets SET name='".$_POST['budgetName']."',quantity='".$_POST['budgetQuantity']."',price='".$_POST['budgetPrice']."',orderNumber='".$_POST['orderNumber']."',updatedAt='".date('Y-m-d H:i:s')."' WHERE id = '".$_POST['id']."'"; 
          }
          else{
            $sql = "INSERT INTO budgets (walletId ,name,quantity,remainQuantity,price,createdAt,updatedAt,deletedAt,orderNumber,usedQuantity) 
                VALUES ('$id','".$_POST['budgetName']."','".$_POST['budgetQuantity']."','".$_POST['budgetRemainPackages']."','".$_POST['budgetPrice']."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL,'".$_POST['orderNumber']."','0')" ;
          }
        }
        else if(isset($_POST["create_client"])){
          $_POST['fullName'] = mysqli_real_escape_string($con, $_POST['fullName']);
          $sql = "INSERT INTO clients (email,fullName,faceBookName,phoneNumber,address,createdAt,updatedAt,deletedAt) 
                VALUES ('".$_POST['email']."','".$_POST['fullName']."','".$_POST['faceBookName']."','".$_POST['phoneNumber']."','".$_POST['address']."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)" ;
        }
        else if(isset($_POST["update_client"])){
          $id = $_POST['id']; 
          $_POST['fullName'] = mysqli_real_escape_string($con, $_POST['fullName']);
          $sql = "UPDATE clients SET email='".$_POST['email']."',fullName='".$_POST['fullName']."',faceBookName='".$_POST['faceBookName']."',phoneNumber='".$_POST['phoneNumber']."',address='".$_POST['address']."',updatedAt='".date('Y-m-d H:i:s')."' WHERE id = $id"; 
        }
        else if(isset($_POST["create_payment"])){
          $_POST['owner'] = mysqli_real_escape_string($con, $_POST['owner']);
          $_POST['bank'] = mysqli_real_escape_string($con, $_POST['bank']);
          $sql = "INSERT INTO payments (type,owner,balance,onHoldBalance,notes,createdAt,updatedAt,deletedAt,currency,status,orderNumber,bank) 
                VALUES ('".$_POST['type']."','".$_POST['owner']."','".$_POST['balance']."','".$_POST['onHoldBalance']."','".$_POST['notes']."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL,'".$_POST['currency']."','".$_POST['status']."','".$_POST['orderNumber']."','".$_POST['bank']."')" ;
        }
        else if(isset($_POST["update_payment"])){
          $id = $_POST['id']; 
          $_POST['owner'] = mysqli_real_escape_string($con, $_POST['owner']);
          $_POST['bank'] = mysqli_real_escape_string($con, $_POST['bank']);
          $sql = "UPDATE payments SET type='".$_POST['type']."',owner='".$_POST['owner']."',balance='".$_POST['balance']."',onHoldBalance='".$_POST['onHoldBalance']."',notes='".$_POST['notes']."',status='".$_POST['status']."',currency='".$_POST['currency']."',orderNumber='".$_POST['orderNumber']."',bank='".$_POST['bank']."',updatedAt='".date('Y-m-d H:i:s')."' WHERE id = $id"; 
        }
        else if(isset($_POST["create_withdraw"])){
          mysqli_query($con,"UPDATE payments SET balance='".$_POST['balance']."' WHERE id = '".$_POST['paymentId']."'"); 

          $sql = "INSERT INTO withdrawtransactions (paymentId,userId,amount,createdAt,updatedAt,deletedAt,status) 
                VALUES ('".$_POST['paymentId']."','".$_POST['userId']."','".$_POST['amount']."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL,'in-progress')" ;
        }
        else if(isset($_POST["update_withdraw"])){
          $id = $_POST['id']; 
          $sql = "UPDATE withdrawtransactions SET status='completed',updatedAt='".date('Y-m-d H:i:s')."' WHERE id = $id"; 
        }
        else if(isset($_POST["create_transaction"])){
          $_POST['code']= str_replace(' ', '', $_POST['code']); 
          $_POST['code']=mysqli_real_escape_string($con,$_POST['code']);
          $amount=$_POST['amount'];
          if($_POST['status']=='completed'){
            mysqli_query($con,"UPDATE payments
            SET balance = balance + 
                CASE 
                    WHEN currency = 'VND' THEN $amount 
                    WHEN currency = 'USD' THEN $amount / 22200 
                END
            WHERE id ='".$_POST['paymentId']."'"); 
          }else{
            mysqli_query($con,"UPDATE payments
            SET onHoldBalance = onHoldBalance + 
                CASE 
                    WHEN currency = 'VND' THEN $amount 
                    WHEN currency = 'USD' THEN $amount / 22200 
                END
            WHERE id ='".$_POST['paymentId']."'"); 
          }
          $sql = "INSERT INTO transactions (code,paymentId,clientId,amount,remainAmount,status,currency,createdAt,updatedAt,deletedAt) 
                VALUES ('".$_POST['code']."','".$_POST['paymentId']."','".$_POST['clientId']."','".$_POST['amount']."','".$_POST['amount']."','".$_POST['status']."','".$_POST['currency']."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)" ;
        }
        else if(isset($_POST["update_budget_usedQuantity"])){
          $id = $_POST['id']; 
          if(isset($_POST['walletId'])){
            $sql = "UPDATE budgets SET usedQuantity='".$_POST['usedQuantity']."' WHERE walletId = $id"; 
          }else{
            $sql = "UPDATE budgets SET usedQuantity='".$_POST['usedQuantity']."' WHERE id = $id"; 
          } 
        }
        else if(isset($_POST["create_order"])){
          
          $createOrder = "INSERT INTO orders (clientId,gameId,userId,basePrice,salePrice,paidAmount,bonusAmount,paymentStatus,status,info,notes,createdAt,updatedAt,deletedAt) 
                VALUES ('".$_POST['clientId']."','".$_POST['gameId']."','".$_POST['userId']."','".$_POST['basePrice']."','".$_POST['salePrice']."','".$_POST['paidAmount']."','".$_POST['bonusAmount']."','".$_POST['paymentStatus']."','".$_POST['status']."','".$_POST['info']."','".$_POST['notes']."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)" ;
          mysqli_query($con, $createOrder);
          $last_id = mysqli_insert_id($con);
       
        function processKeyValuePairs($input) {
          $keyValuePairs = explode(',', $input);
          return array_map(function ($pair) {
            return explode('/', $pair);
          }, $keyValuePairs);
        }
        if($_POST['paymentStatus']!='unPaid'){
          foreach (processKeyValuePairs($_POST['transactionOders']) as $pair) {
            $transactionId = $pair[0];
            $usedAmount = $pair[1];
          mysqli_query($con,"INSERT INTO transactionsorders (orderId,transactionId,amount,createdAt,updatedAt,deletedAt) 
          VALUES ('".$last_id."','".$transactionId."','".$usedAmount."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)");  
          mysqli_query($con, "UPDATE transactions 
          SET remainAmount = remainAmount - $usedAmount, updatedAt = '".date('Y-m-d H:i:s')."'
          WHERE id = $transactionId"); 
          }
        }
        $sql = "INSERT INTO budgetsorders (orderId,budgetId,quantity,createdAt,updatedAt,deletedAt) VALUES ";

foreach (processKeyValuePairs($_POST['budgetsorders']) as $budgetOrders) {
    $budgetId = $budgetOrders[0];
    $usedQuantity = $budgetOrders[1];
    $quantityBudget = $budgetOrders[2];
    $walletId = $budgetOrders[3];
    $priceBudget = $budgetOrders[4];

    $sql .= "('".$last_id."','".$budgetId."','".$usedQuantity."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL),";
     
    mysqli_query($con,"UPDATE budgets 
        JOIN wallets ON wallets.id = budgets.walletId
        SET budgets.quantity = CASE wallets.positive 
                                    WHEN 1 THEN budgets.quantity + $usedQuantity
                                    WHEN 0 THEN budgets.quantity - $usedQuantity
                                 END,
            wallets.packages = CASE wallets.positive 
                                    WHEN 1 THEN wallets.packages + ($usedQuantity * budgets.price / wallets.price)
                                    WHEN 0 THEN wallets.packages - ($usedQuantity * budgets.price / wallets.price)
                                 END
        WHERE budgets.id = $budgetId");
}

    //     foreach (processKeyValuePairs($_POST['walletsIds']) as $pair) {
    //       $id = $pair[0];
    //       $positive = $pair[1];
    //       $packages = $pair[2];
    //       $priceWallet = $pair[3];
    //       foreach (processKeyValuePairs($_POST['budgetsorders']) as $budgetOrders) {
    //         $budgetId = $budgetOrders[0];
    //         $usedQuantity = $budgetOrders[1];
    //         $quantityBudget = $budgetOrders[2];
    //         $walletId = $budgetOrders[3];
    //         $priceBudget = $budgetOrders[4];
    //         $sql_w = mysqli_query($con,"select * from wallets WHERE id = $walletId"); 
    //         $row_w = mysqli_fetch_array($sql_w);
    //         if($id==$walletId && $usedQuantity!='0'){
    //           if($positive=='0'){
    //             $quantity = $quantityBudget-$usedQuantity;
    //             $packagesTotal = $row_w['packages'] -($usedQuantity*$priceBudget/ $priceWallet);
    //             mysqli_query($con,"INSERT INTO budgetsorders (orderId,budgetId,quantity,createdAt,updatedAt,deletedAt) 
    //             VALUES ('".$last_id."','".$budgetId."','".$usedQuantity."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)");  
    //             $sql= "UPDATE budgets SET quantity='".$quantity."' WHERE id = $budgetId";
    //             mysqli_query($con,"UPDATE wallets SET packages='".$packagesTotal."' WHERE id = $id");
    //           }else{
    //             $quantity = $quantityBudget+$usedQuantity;
    //             $packagesTotal = $row_w['packages']+($usedQuantity*$priceBudget/ $priceWallet);
    //             mysqli_query($con,"INSERT INTO budgetsorders (orderId,budgetId,quantity,createdAt,updatedAt,deletedAt) 
    //             VALUES ('".$last_id."','".$budgetId."','".$usedQuantity."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)");  
    //             $sql="UPDATE budgets SET quantity='".$quantity."' WHERE id = $budgetId";
    //             mysqli_query($con,"UPDATE wallets SET packages='".$packagesTotal."' WHERE id = $id");
    //           }
               
    //         }
          
    //       }
        
    // }
  }
  else if(isset($_POST["update_transaction_oder"])){
    $id=$_POST['id'];
    $sql = "UPDATE orders SET paidAmount='".$_POST['paidAmount']."',paymentStatus='".$_POST['paymentStatus']."' WHERE id = $id"; 

    function processKeyValuePairs($input) {
      $keyValuePairs = explode(',', $input);
      return array_map(function ($pair) {
        return explode('/', $pair);
      }, $keyValuePairs);
    }
    
    if($_POST['paymentStatus']!='unPaid'){
      foreach (processKeyValuePairs($_POST['transactionOders']) as $pair) {
        $transactionId = $pair[0];
        $usedAmount = $pair[1];
      mysqli_query($con,"INSERT INTO transactionsorders (orderId,transactionId,amount,createdAt,updatedAt,deletedAt) 
      VALUES ('".$_POST['id']."','".$transactionId."','".$usedAmount."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)");  
      mysqli_query($con, "UPDATE transactions 
      SET remainAmount = remainAmount - $usedAmount, updatedAt = '".date('Y-m-d H:i:s')."'
      WHERE id = $transactionId"); 
      }
    }
  }
  else if(isset($_POST["update_status_oder"])){
    $id=$_POST['id'];
    function processKeyValuePairs($input) {
      $keyValuePairs = explode(',', $input);
      return array_map(function ($pair) {
        return explode('/', $pair);
      }, $keyValuePairs);
    }
    if($_POST['status']=='delete'){
      $sql = "UPDATE orders SET deletedAt='".date('Y-m-d H:i:s')."'  WHERE id = $id"; 
      mysqli_query($con,"UPDATE budgetsorders SET deletedAt='".date('Y-m-d H:i:s')."'  WHERE orderId = $id");
      mysqli_query($con,"UPDATE orderphotos SET deletedAt='".date('Y-m-d H:i:s')."'  WHERE orderId = $id");
      mysqli_query($con,"UPDATE transactionsorders SET deletedAt='".date('Y-m-d H:i:s')."'  WHERE orderId = $id");
    if($_POST['paymentStatus']!='unPaid'){
    foreach (processKeyValuePairs($_POST['transactionOders']) as $pair) {
        $transactionId = $pair[0];
        $usedAmount = $pair[1];
        mysqli_query($con, "UPDATE transactions 
        SET remainAmount = remainAmount - $usedAmount, updatedAt = '".date('Y-m-d H:i:s')."'
        WHERE id = $transactionId");  
      }
    }
    foreach (processKeyValuePairs($_POST['budgetsorders']) as $budgetOrders) {
      $budgetId = $budgetOrders[0];
      $budgetsQuantity = $budgetOrders[1];
      $quantity = $budgetOrders[2];
      $positive = $budgetOrders[3];
      $budgetsPrice = $budgetOrders[4];
      $walletsPrice = $budgetOrders[5];
      $walletsId = $budgetOrders[7];
        mysqli_query($con,"UPDATE budgets 
            JOIN wallets ON wallets.id = budgets.walletId
            SET budgets.quantity = CASE wallets.positive 
                                        WHEN 1 THEN budgets.quantity - $quantity
                                        WHEN 0 THEN budgets.quantity + $quantity
                                     END,
                wallets.packages = CASE wallets.positive 
                                        WHEN 1 THEN wallets.packages - ($quantity * budgets.price / wallets.price)
                                        WHEN 0 THEN wallets.packages + ($quantity * budgets.price / wallets.price)
                                     END
            WHERE budgets.id = $budgetId");
    }

  } else{
    $sql = "UPDATE orders SET status='".$_POST['status']."'  WHERE id = $id";  
  } 
  }
else if(isset($_POST['create_orderphotos'])){
          $sql_w = mysqli_query($con,"select * from orders ORDER BY `orders`.`id` DESC"); 
            $row_w = mysqli_fetch_array($sql_w); 
            $lay_id= $row_w['id'];
              $upload_dir = 'public/images';
              $avatar_name = $_FILES["avatar"]["name"];
              $avatar_tmp_name = $_FILES["avatar"]["tmp_name"];
              $time_tmp = time().'_'.$avatar_name;
              $linktmp=$time_tmp;
              move_uploaded_file($avatar_tmp_name , 'public/images/'.$time_tmp);
              $sql = "insert into orderphotos (orderId,image,createdAt,updatedAt,deletedAt) values ('$lay_id','$linktmp','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)";   
  }
  else if(isset($_POST['update_orderphotos'])){

      $lay_id= $_POST['id'];
        $upload_dir = 'public/images';
        $avatar_name = $_FILES["avatar"]["name"];
        $avatar_tmp_name = $_FILES["avatar"]["tmp_name"];
        $time_tmp = time().'_'.$avatar_name;
        $linktmp=$time_tmp;
        move_uploaded_file($avatar_tmp_name , 'public/images/'.$time_tmp);
        $sql = "insert into orderphotos (orderId,image,createdAt,updatedAt,deletedAt) values ('$lay_id','$linktmp','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."',NULL)";   
}
  else if(isset($_POST["update_status_ordersAll"])){
    $id = $_POST['id']; 
      $sql = "UPDATE orders SET status='done' WHERE id = $id"; 
  }
  else if(isset($_POST["delete_photo_order"])){
    $id = $_POST['idPhotos']; 
      $sql = "UPDATE orderphotos SET deletedAt='".date('Y-m-d H:i:s')."' WHERE id = $id"; 
  }
  break;
}
 
// run SQL statement
$sql = rtrim($sql, ",") . ";";
$result = mysqli_query($con,$sql);
 
// die if SQL statement failed
if (!$result) {
  http_response_code(404);
  die(mysqli_error($con));
}
 
if ($method == 'GET') {
    if (!$id) echo '[';
      for ($i=0 ; $i<mysqli_num_rows($result) ; $i++) {
        echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
      }
    if (!$id) echo ']';
} elseif ($method == 'POST') {
    echo json_encode($result);
} else {
    echo mysqli_affected_rows($con);
}
 
$con->close();
?>