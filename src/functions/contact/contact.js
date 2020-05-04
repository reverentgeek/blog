"use strict";

const sgMail = require( "@sendgrid/mail" );

const sendMsg = async ( { from, subject, message } ) => {
	sgMail.setApiKey( process.env.SENDGRID_API_KEY );
	const msg = {
		to: "david@reverentgeek.com",
		from: "david@reverentgeek.com",
		replyTo: from,
		subject,
		html: message
	};
	await sgMail.send( msg );
};

exports.handler = async function( event, context ) {
	try {
		const testEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
		console.log( "event:", event );
		console.log( "context:", context );
		const data = JSON.parse( event.body );
		const keys = Object.keys( data );
		if ( keys.length !== 3 || !testEmail.test( data.from )
			|| !data.from || !data.subject || !data.message ) {
			return {
				statusCode: 400,
				body: JSON.stringify( { msg: "missing required fields or data is invalid" } )
			};
		}
		await sendMsg( data );
		return {
			statusCode: 200,
			body: JSON.stringify( { success: true } )
		};
	} catch ( err ) {
		console.log( err );
		if ( err.response && err.response.body && err.response.body.errors ) {
			console.log( err.response.body.errors );
		}
		return {
			statusCode: 500,
			body: JSON.stringify( { msg: err.message } )
		};
	}
};
