<?php 

$ind=$_POST['ind'];

include 'connect.php';
$con=mysqli_connect($host,$user,$pw,$db);
// check connection
if (mysqli_connect_errno()) {
  	echo "Failed to connect to MySQL: " . mysqli_connect_error();
};

$query="SELECT * FROM Vocab WHERE ind='$ind'";

if ($result=mysqli_query($con,$query)) {
    while ($row=mysqli_fetch_assoc($result)) {
    	echo json_encode($row);
    };
    mysqli_free_result($result);
};

mysqli_close($con);

?>