import { v1 } from "uuid";

export function getId() {
	return v1().replace( /-/g, "" );
}

console.log( getId() );

