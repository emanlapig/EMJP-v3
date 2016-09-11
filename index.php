<?php

$word_index=0;
$have_index=false;

function get_index() {
	include 'includes/connect.php';
	$con=mysqli_connect($host,$user,$pw,$db);
	// check connection
	if (mysqli_connect_errno()) {
	  	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	};

	$query="SELECT * FROM Vocab WHERE ind=0";

    if ($result=mysqli_query($con,$query)) {
	    while ($row=mysqli_fetch_row($result)) {
	    	$word_index=$row[1];
	    	$have_index=true;
	    };
	    mysqli_free_result($result);
	};

	mysqli_close($con);

	if ($have_index) {
		echo $word_index;
	} else {
		echo "-1";

		$con=mysqli_connect($host,$user,$pw,$db);
		$query="INSERT INTO Vocab (ind, word) VALUES (0, 0)";
		$sql=mysqli_query($con,$query);

		mysqli_close($con);
	};
};

?>
<html>
<head>
	<title>EMJP3</title>
	<script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>
	<script type="text/javascript" src="Main.js"></script>
	<link rel='stylesheet' type='text/css' href='style.css'>
</head>
<body>

	<form id="word-edit" name="word-edit">
		<div class="page">
			<span id="title">New Word</span><br><br>
			<input type="text" id="word-input" name="word-input" placeholder="Enter a word"></input><br>
			<select id="word-type" name="type">
				<option value="n">noun</option>
				<option value="v">verb</option>
			</select><br>
			<input type="button" value="Next" id="edit-next-1" name="edit-next-1"></input>
		</div>
		<div class="page">
			<div id="reading-input">
				<!-- furigana inputs -->
			</div><br>
			<input type="button" value="Back" id="edit-back-2" name="edit-back-2"></input>
			<input type="button" value="Next" id="edit-next-2" name="edit-next-2"></input>
		</div>
		<div class="page">
			<div id="word-display">
			</div>
			<textarea rows="3" id="word-def" name="def" placeholder="Enter a definition"></textarea><br>
			<input type="text" id="word-index" name="ind"></input>
			<input type="text" id="word-split" name="word"></input>
			<input type="text" id="fg-split" name="reading"></input>
			<br><br>
			<input type="button" value="Back" id="edit-back-3" name="edit-back-3"></input>
			<input type="button" value="Submit" id="edit-submit" name="edit-submit"></input>
		</div>
	</form>

	<a id="reset-form">Reset Form</a><br><br>
	<a id="clear-words">Clear Words</a><br><br>

	<div id="vocab-list">
		<?php include 'includes/word-list.php'; ?>
	</div>

	<div class="overlay" id="confirm-delete-word">
		<div class="popup">
			Are you sure you want to delete this word?<br>
			<input type="button" value="yes" id="yes"></input>
			<input type="button" value="no" id="no"></input>
		</div>
	</div>

	<div class="overlay" id="confirm-clear-words">
		<div class="popup">
			Are you sure you want to clear all words?<br>
			<input type="button" value="yes" id="yes"></input>
			<input type="button" value="no" id="no"></input>
		</div>
	</div>

	<script type="text/javascript">
		$( function() {
			var model = new EMJP3.Model();
			var view = new EMJP3.View( model );
			var controller = new EMJP3.Controller( model, view );

			controller.init_view();
			model.word_index = <?php echo get_index(); ?>;

			if ( model.word_index === -1 ) {
				window.location.reload();
			}
		});
	</script>

</body>
</html>