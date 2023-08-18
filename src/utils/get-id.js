"use strict";

const uuid = require( "uuid" );

console.log( uuid.v1().replace( /-/g, "" ) );

