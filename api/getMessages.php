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
	$receiverUid = $mysqli->real_escape_string($data->uid);

	$query="SELECT * FROM messages WHERE receiverUid = '$receiverUid'";
	$result = $mysqli->query($query) or die($mysqli->conn->error.__LINE__);
	$data = array();

	if($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
		$data[] = $row;
		}
	}

	echo $json_response = json_encode($data);

	/*

	//executig sql query
	$query = "SELECT * FROM messages WHERE receiverUid = ?";
		$statement = $mysqli->prepare($query);
		$statement->bind_param('s', $receiverUid);
		$statement->execute();
		$result = $statement -> get_result();
	        $data = array();
	        //MYSQLI_NUM = Array items will use a numerical index key.
	        //MYSQLI_ASSOC = Array items will use the column name as an index key.
	        //MYSQLI_BOTH = [default] Array items will be duplicated, with one having a numerical index key and one having the column name as an index key.
	        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
	            $data[] = $row;
	        }
	        //unicode
	        header("Content-Type: application/json", true);
	        echo json_encode($data);
					//close connection
		$statement->close();
		$mysqli->close();
*/
} catch (exception $e) {
        echo json_encode(null);
}
?>
