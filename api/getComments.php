<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE");
	error_reporting(0);
	try {
	require_once ("php_includes/db_conn.php");
	$mysqli = $db_conn;
	// Check for database connection error
	if (mysqli_connect_errno()) {
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	//declaring
	$data = json_decode(file_get_contents("php://input"));
	$postID = $mysqli->real_escape_string($data->postID);

	$query="SELECT * FROM logcomments WHERE postID = '$postID'";
	$result = $mysqli->query($query) or die($mysqli->conn->error.__LINE__);
	$logs = array();

	if($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
		$logs[] = $row;
		}
	}

	echo $json_response = json_encode($logs);
} catch (exception $e) {
        echo json_encode(null);
}
?>
