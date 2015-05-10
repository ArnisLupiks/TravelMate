<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE");
try{
    require_once ("php_includes/db_conn.php");
    // Connecting to mysql database
    $mysqli = $db_conn;

    // Check for database connection error
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    } // The mysql database connection script


    //declare
    $data = json_decode(file_get_contents("php://input"));
    $postID = $mysqli->real_escape_string($data->postID);
    $uid = $mysqli->real_escape_string($data->uid);
    $comUsrID = $mysqli->real_escape_string($data->comUsrID);
    //$location = mysql_real_escape_string($data->location);
    $comContent = $mysqli->real_escape_string($data->comContent);
    //execute
        $query="INSERT INTO logcomments (postID, uid, comUsrID, comContent) VALUES ('$postID', '$uid', '$comUsrID', '$comContent')";
        $result = $mysqli->query($query) or die($mysqli->error.__LINE__);
        $result = $mysqli->affected_rows;
       echo $json_response = json_encode($result);


  } catch (exception $e) {
          echo json_encode(null);
}

?>
