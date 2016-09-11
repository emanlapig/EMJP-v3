<?php 

$words=array();

include 'connect.php';
$con=mysqli_connect($host,$user,$pw,$db);

// Check connection
if ( mysqli_connect_errno() ) {
  	echo "Failed to connect to MySQL: " . mysqli_connect_error();
};

$query="SELECT * FROM Vocab ORDER BY ind ASC";

if ($result=mysqli_query($con,$query)) {
	while ($row=mysqli_fetch_array($result) ) {
	    array_push($words,$row);
	}
	mysqli_free_result($result);
}

mysqli_close($con);

?>

<?php foreach ($words as $key=>$word) : ?>
	<div class="list-word" id="list-word-<?php echo $word['ind']; ?>">
		(<?php echo $word['ind']; ?>) 
		Word: <?php echo $word['word']; ?>; 
		Reading: <?php echo $word['reading']; ?>; 
		Type: <?php echo $word['type']; ?>; 
		Def: <?php echo $word['def']; ?>; 
		<input type="button" class="edit-word-btn" id="edit-word-<?php echo $word['ind']; ?>" value="edit" data-word-index="<?php echo $word['ind']; ?>"></input>
		<input type="button" class="del-word-btn" id="del-word-<?php echo $word['ind']; ?>" value="delete" data-word-index="<?php echo $word['ind']; ?>"></input>
	</div>
<?php endforeach; ?>