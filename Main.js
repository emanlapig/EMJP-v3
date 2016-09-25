// MVC.js

var EMJP3 = {};

EMJP3.Model = function() {
	var _model = this;
	this.word_index = 0;
	this.word = {
		ind: 0,
		wordSplit: [],
		fgSplit: [],
		type: "",
		def: ""
	}
};

EMJP3.View = function( model ) {
	var _model = model;
	var _view = this;

	this.page_nav = {
		show_vocab: function() {
			$( ".page.homepage" ).addClass( "off-left" ); // hide homepage
			$( ".page.vocabulary" ).removeClass( "off-right" ); // show vocab list
			$( "footer a#new-word-btn").removeClass( "hidden" ); // reveal new word btn
		},
		show_edit_word: function() {
			$( ".page.vocabulary" ).addClass( "off-left" ); // hide vocab list
			$( ".page.word-edit" ).removeClass( "off-right" ); // show word edit form
		}
	}

	this.edit_word = {
		edit_mode: false,
		step2: function() {
			$( "form#word-edit .form-page.page2" ).removeClass( "hidden" );
			$( "form#word-edit .form-page.page1" ).addClass( "hidden" );
			/*setTimeout( function() {
				$( "form#word-edit .form-page.page2" ).addClass( "fade-in" );
			}, 100);*/
			var model = _model.word;
			var word = $( "#word-input" ).val();
			var wordSplit = word.split( "" );
			if ( _view.edit_word.edit_mode ) {
				var keepFg = ( model.wordSplit == wordSplit );
				var fgSplit = model.fgSplit.split( "," );
			} else {
				var keepFg = false;
				var fgSplit = false;
			}
			model.wordSplit = wordSplit;
			$( "#word-input2" ).val( word );
			_view.edit_word.add_fgInputs( keepFg, fgSplit );
		},
		step3: function() {
			$( "form#word-edit .form-page.page3" ).removeClass( "hidden" );
			setTimeout( function() {
				$( "form#word-edit .form-page.page3" ).addClass( "fade-in" );
			}, 100);
			var model = _model.word;
			model.fgSplit = [];
			for ( var i=0; i<model.wordSplit.length; i++ ) {
				var fg = $( "#fg-input-"+i ).val();
				model.fgSplit.push( fg );

				/*var container = document.createElement( "div" );
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
				kjPrev.innerHTML = model.wordSplit[i];

				frag.appendChild( fgPrev );
				frag.appendChild( kjPrev );
				container.appendChild( frag );

				$( "#word-display" ).append( container );*/
			}
			if ( !_view.edit_word.edit_mode ) {
				var ind = _model.word_index + 1;
				$( "#word-index" ).val( ind );
			}
			$( "#word-split" ).val( model.wordSplit );
			$( "#fg-split" ).val( model.fgSplit );
		},
		add_fgInputs: function( keepFg, fgSplit ) {
			$( "#reading-input" ).text( "" );
			var model = _model.word;
			for ( var i=0; i<model.wordSplit.length; i++ ) {
				var container = document.createElement( "div" );
				container.setAttribute( "id", "char-input-"+i );
				container.setAttribute( "class", "char-input" );

				var frag = document.createDocumentFragment();

				var fgInput = document.createElement( "input" );
				fgInput.setAttribute( "type", "text" );
				fgInput.setAttribute( "id", "fg-input-"+i );
				fgInput.setAttribute( "name", "fg-input-"+i );
				fgInput.setAttribute( "class", "fg-input" );
				if ( keepFg ) {
					fgInput.setAttribute( "value", fgSplit[i] );
				}

				var kjInput = document.createElement( "input" );
				kjInput.setAttribute( "type", "text" );
				kjInput.setAttribute( "id", "kj-input-"+i );
				kjInput.setAttribute( "name", "kj-input-"+i );
				kjInput.setAttribute( "class", "kj-input" );
				kjInput.setAttribute( "value", model.wordSplit[i] );

				frag.appendChild( fgInput );
				frag.appendChild( kjInput );
				container.appendChild( frag );

				$( "#reading-input" ).append( container );
			}
		},
		special_reading: function() {
			var model = _model.word;
			var word = $( "#word-input" ).val();
			model.wordSplit = [ word ];
			$( "#word-input2" ).val( word );
			_view.edit_word.add_fgInputs( false, false );
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
		$( "#spec-read" ).on( "click", _view.edit_word.special_reading );
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

		// main menu
		$( ".homepage a#vocab-link" ).on( "click", function( event ) {
			_view.page_nav.show_vocab();
		});

		// footer
		$( "footer a#new-word-btn" ).on( "click", function( event ) {
			_view.page_nav.show_edit_word();
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
					_model.word.wordSplit = word.word;
					_model.word.fgSplit = word.reading;
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