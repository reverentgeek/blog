// Load Prism.js for syntax highlighting on blog posts
import Prism from "prismjs";

// Custom Edge.js language definition
// Extends HTML with Edge.js directives, interpolation, and comments
Prism.languages.edge = Prism.languages.extend( "markup", {} );

Prism.languages.insertBefore( "edge", "tag", {
	"edge-comment": {
		pattern: /\{\{--[\s\S]*?--\}\}/,
		alias: "comment"
	},
	"edge-directive": {
		pattern: /@(?:if|elseif|else|end|each|unless|include|includeIf|component|slot|let|assign|inject|raw|!component)\b[^]*?(?=\))\)|@(?:else|end)\b/,
		inside: {
			keyword: /^@\w+/,
			punctuation: /[()]/,
			string: { pattern: /(["'])(?:\\.|(?!\1)[^\\])*\1/, greedy: true },
			operator: /[=!<>]=?|&&|\|\|/,
			variable: /\b[a-zA-Z_$][\w$.]*\b/,
			number: /\b\d+\b/
		}
	},
	"edge-output": {
		pattern: /\{\{\{?[\s\S]*?\}?\}\}/,
		inside: {
			delimiter: { pattern: /^\{\{\{?|\}?\}\}$/, alias: "punctuation" },
			string: { pattern: /(["'])(?:\\.|(?!\1)[^\\])*\1/, greedy: true },
			keyword: /\bawait\b/,
			function: /\b[a-zA-Z_$][\w$]*(?=\s*\()/,
			operator: /[=!<>]=?|\?|&&|\|\||[+\-*/%]/,
			punctuation: /[(),.:[\]]/,
			variable: /\b[a-zA-Z_$][\w$.]*\b/,
			number: /\b\d+\b/
		}
	}
} );
