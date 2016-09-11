<?php 

include 'connect.php';
$con=mysqli_connect($host,$user,$pw,$db);
// check connection
if (mysqli_connect_errno()) {
  	echo "Failed to connect to MySQL: " . mysqli_connect_error();
};

$query="DELETE FROM Vocab";

$result=mysqli_query($con,$query);

mysqli_close($con);

?>