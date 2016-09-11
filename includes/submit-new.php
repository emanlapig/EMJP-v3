<?php 
include 'connect.php';

$ind=$_POST['ind'];
$word=$_POST['word'];
$reading=$_POST['reading'];
$type=$_POST['type'];
$def=$_POST['def'];

$con=mysqli_connect($host,$user,$pw,$db);
// check connection
if ( mysqli_connect_errno() ) {
  	echo "Failed to connect to MySQL: " . mysqli_connect_error();
};

$query="INSERT INTO Vocab (ind, word, reading, type, def) VALUES ('$ind', '$word', '$reading', '$type', '$def')";

$sql=mysqli_query($con,$query);

mysqli_close($con);

$con=mysqli_connect($host,$user,$pw,$db);
$query="UPDATE Vocab SET word='$ind' WHERE ind=0";
$sql=mysqli_query($con,$query);

mysqli_close($con);

include 'word-list.php';

?>