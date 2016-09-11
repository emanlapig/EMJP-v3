// MVC.js

var EMJP3 = {};

EMJP3.Model = function() {
	var _model = this;
	this.word_index = 0;
	this.word = {
		ind: 0,
		word_split: [],
		fg_split: [],
		type: "",
		def: ""
	}
};

EMJP3.View = function( model ) {
	var _model = model;
	var _view = this;

	this.edit_word = {
		edit_mode: false,
		step2: function() {
			var model = _model.word;
			var word = $( "#word-input" ).val();
			var word_split = word.split( "" );
			if ( _view.edit_word.edit_mode ) {
				var keep_fg = ( model.word_split == word_split );
				var fg_split = model.fg_split.split( "," );
			}
			model.word_split = word_split;
			for ( var i=0; i<model.word_split.length; i++ ) {
				var container = document.createElement( "div" );
				container.setAttribute( "id", "char-input-"+i );
				container.setAttribute( "class", "char-input" );

				var frag = document.createDocumentFragment();

				var fgInput = document.createElement( "input" );
				fgInput.setAttribute( "type", "text" );
				fgInput.setAttribute( "id", "fg-input-"+i );
				fgInput.setAttribute( "name", "fg-input-"+i );
				fgInput.setAttribute( "class", "fg-input" );
				if ( keep_fg ) {
					fgInput.setAttribute( "value", fg_split[i] );
				}

				var kjInput = document.createElement( "input" );
				kjInput.setAttribute( "type", "text" );
				kjInput.setAttribute( "id", "kj-input-"+i );
				kjInput.setAttribute( "name", "kj-input-"+i );
				kjInput.setAttribute( "class", "kj-input" );
				kjInput.setAttribute( "value", model.word_split[i] );

				frag.appendChild( fgInput );
				frag.appendChild( kjInput );
				container.appendChild( frag );

				$( "#reading-input" ).append( container );
			}
		},
		step3: function() {
			var model = _model.word;
			model.fg_split = [];
			for ( var i=0; i<model.word_split.length; i++ ) {
				var fg = $( "#fg-input-"+i ).val();
				model.fg_split.push( fg );

				var container = document.createElement( "div" );
				container.setAttribute( "id", "char-preview-"+i );
				container.setAttribute( "class", "char-preview" );

				var frag = document.createDocumentFragment();

				var fgPrev = document.createElement( "div" );
				fgPrev.setAttribute( "id", "fg-preview-"+i );
				fgPrev.setAttribute( "class", "fg-preview" );
				fgPrev.innerHTML = fg;

				var kjPrev = document.createElement( "div" );
				kjPrev.setAttribute( "id", "kj-preview-"+i );
				kjPrev.setAttribute( "class", "kj-preview" );
				kjPrev.innerHTML = model.word_split[i];

				frag.appendChild( fgPrev );
				frag.appendChild( kjPrev );
				container.appendChild( frag );

				$( "#word-display" ).append( container );
			}
			if ( !_view.edit_word.edit_mode ) {
				var ind = _model.word_index + 1;
				$( "#word-index" ).val( ind );
			}
			$( "#word-split" ).val( model.word_split );
			$( "#fg-split" ).val( model.fg_split );
		}
	}

	this.popups = {
		show: function( el ) {
			$( el ).css( "display", "block" );
		},
		hide: function( el ) {
			$( el ).css( "display", "none" );
		}
	}
};

EMJP3.Controller = function( model, view ) {
	var _model = model;
	var _view = view;
	var _controller = this;

	this.init_view = function() {
		// bind async-loaded list buttons
		_controller.word_list.bind_list_btns();

		// ------------------ STATIC BUTTON BINDINGS ------------------
		// edit word form buttons
		$( "#edit-next-1" ).on( "click", _view.edit_word.step2 );
		$( "#edit-next-2" ).on( "click", _view.edit_word.step3 );
		$( "#edit-submit" ).on( "click", _controller.edit_word.submit_new );

		// reset form button
		$( "a#reset-form" ).on( "click", function( event ) {
			_controller.edit_word.reset_form();
		});

		// clear all words button
		$( "a#clear-words" ).on( "click", function( event ) {
			_view.popups.show( "#confirm-clear-words" );
		});
		$( "#confirm-clear-words #yes" ).on( "click", function( event ) {
			_controller.clear_words();
		});
		$( "#confirm-clear-words #no" ).on( "click", function( event ) {
			_view.popups.hide( "#confirm-clear-words" );
		});

		// cancel delete word button
		$( "#confirm-delete-word #no" ).on( "click", function( event ) {
			_view.popups.hide( "#confirm-delete-word" );
		});
	}

	this.word_list = {
		bind_list_btns: function() { // bind events to async-loaded list buttons
			var edit_word_btns = $( ".edit-word-btn" );
			for ( var i=0; i<edit_word_btns.length; i++ ) {
				var ind = $( edit_word_btns[i] ).attr( "data-word-index" );
				// edit word button binding
				var edit_btn = "input#edit-word-" + ind;
				$( edit_btn ).on( "click", function( event ) {
					var ind = this.getAttribute( "data-word-index" );
					var options = { ind: ind };
					_controller.edit_word.reset_form();
					_controller.edit_word.set_form( options );
					$( "#edit-submit" ).unbind();
					$( "#edit-submit" ).on( "click", _controller.edit_word.submit_edit );
				});
				// delete word button binding
				var del_btn = "input#del-word-" + ind;
				$( del_btn ).on( "click", function( event ) {
					var ind = this.getAttribute( "data-word-index" );
					_controller.delete_word.to_delete = ind;

					$( "#confirm-delete-word #yes" ).unbind();
					$( "#confirm-delete-word #yes" ).on( "click", function( event ) {
						var ind = _controller.delete_word.to_delete;
						var options = { ind: ind };
						_controller.delete_word.execute( options );
					});

					_view.popups.show( "#confirm-delete-word" );
				});
			}
		}
	}

	this.edit_word = {
		submit_new: function() {
			var data = $( "form#word-edit" ).serialize();
			$.ajax({
				method: "POST",
				url: "includes/submit-new.php",
				data: data,
				success: function( result ) {
					$( "#vocab-list" ).text( "" );
					$( "#vocab-list" ).append( result );
					_controller.word_list.bind_list_btns();
					_controller.edit_word.reset_form();
					_model.word_index += 1;
				}
			});
		},
		submit_edit: function() {
			var data = $( "form#word-edit" ).serialize();
			$.ajax({
				method: "POST",
				url: "includes/submit-edit.php",
				data: data,
				success: function( result ) {
					$( "#vocab-list" ).text( "" );
					$( "#vocab-list" ).append( result );
					_controller.word_list.bind_list_btns();
					_controller.edit_word.reset_form();
				}
			});
		},
		reset_form: function() {
			$( "#word-edit" ).find( "input[type=text], input[type=hidden], textarea" ).val( "" );
			$( "#word-display, #reading-input" ).text( "" );
			$( "#word-edit #title" ).text( "New Word" );
			$( "#edit-submit" ).unbind();
			$( "#edit-submit" ).on( "click", _controller.edit_word.submit_new );
			_view.edit_word.edit_mode = false;
		},
		set_form: function( options ) {
			$.ajax({
				method: "POST",
				url: "includes/fetch-word.php",
				data: options,
				success: function( result ) {
					var word = JSON.parse( result );
					$( "#word-index" ).val( word.ind );
					$( "#word-split" ).val( word.word );
					$( "#word-input" ).val( word.word.split( "," ).join( "" ) );
					$( "#fg-split" ).val( word.reading );
					$( "#word-type" ).val( word.type );
					$( "#word-def" ).val( word.def );
					$( "#word-edit #title" ).text( "Edit Word" );
					_model.word.ind = word.ind;
					_model.word.word_split = word.word;
					_model.word.fg_split = word.reading;
					_view.edit_word.edit_mode = true;
				}
			});
		}
	}

	this.delete_word = {
		to_delete: 0,
		execute: function( options ) {
			$.ajax({
				method: "POST",
				url: "includes/delete-word.php",
				data: options,
				success: function( result ) {
					$( "#vocab-list" ).text( "" );
					$( "#vocab-list" ).append( result );
					_controller.word_list.bind_list_btns();
					_view.popups.hide( "#confirm-delete-word" );
				}
			});
		}
	}

	this.clear_words = function() {
		$.ajax({
			method: "POST",
			url: "includes/clear-words.php",
			success: function() {
				window.location.reload();
			}
		});
	}
};