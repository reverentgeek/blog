"use strict";
import axios from "axios";


( function() {
	const btn = document.getElementById( "submit" );
	const form = document.getElementById( "contact" );
	const alert = document.getElementById( "alert" );
	const badalert = document.getElementById( "badalert" );
	const badmsg = document.getElementById( "badmsg" );
	const email = document.getElementById( "email" );
	const subject = document.getElementById( "subject" );
	const message = document.getElementById( "message" );

	function showAlert() {
		alert.classList.remove( "hidden" );
	}

	function hideForm() {
		form.classList.add( "hidden" );
	}

	function showBadAlert( msg ) {
		badmsg.textContent = msg;
		badalert.classList.remove( "hidden" );
	}

	function contactSubmit( event ) {
		const data = {
			email: email.value,
			subject: subject.value,
			message: message.value
		};
		// console.log(data);
		axios.post("/.netlify/functions/contact", data )
			.then(res => {
				showAlert();
				hideForm();
			})
			.catch(err => {
				showBadAlert(err.message);
			});
		event.preventDefault();
	}

	btn.addEventListener( "click", contactSubmit );

} )();
