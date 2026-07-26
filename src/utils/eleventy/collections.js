// Tags that organize the site rather than describe a topic. These are set by
// directory data (posts.json, pages.json) and never surface as browsable topics.
const RESERVED_TAGS = new Set( [ "all", "posts", "page" ] );

// Display names for topic slugs that don't title-case cleanly.
const TOPIC_LABELS = {
	ai: "AI",
	devrel: "DevRel",
	dotnet: ".NET",
	javascript: "JavaScript",
	nodejs: "Node.js",
	"web-development": "Web Development"
};

export function topicLabel( slug ) {
	if ( TOPIC_LABELS[slug] ) {
		return TOPIC_LABELS[slug];
	}
	return slug
		.split( "-" )
		.map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) )
		.join( " " );
}

export function topicsOnly( tags ) {
	if ( !Array.isArray( tags ) ) {
		return [];
	}
	return [ ...new Set( tags ) ].filter( tag => !RESERVED_TAGS.has( tag ) ).sort();
}

function byNewestFirst( a, b ) {
	return new Date( b.date ) - new Date( a.date );
}

// Neighbours of the current page within a collection. Eleventy hands collections
// back oldest-first, so the preceding entry is the older post.
export function adjacentPosts( collection, url ) {
	const items = Array.isArray( collection ) ? collection : [];
	const index = items.findIndex( item => item.url === url );
	if ( index === -1 ) {
		return { older: null, newer: null };
	}
	return {
		older: index > 0 ? items[index - 1] : null,
		newer: index < items.length - 1 ? items[index + 1] : null
	};
}

export function registerCollections( config ) {
	// One entry per topic, newest posts first, most-used topics first.
	config.addCollection( "topics", ( collectionApi ) => {
		const byTopic = new Map();

		for ( const post of collectionApi.getFilteredByTag( "posts" ) ) {
			for ( const tag of topicsOnly( post.data.tags ) ) {
				if ( !byTopic.has( tag ) ) {
					byTopic.set( tag, [] );
				}
				byTopic.get( tag ).push( post );
			}
		}

		return [ ...byTopic.entries() ]
			.map( ( [ slug, posts ] ) => ( {
				slug,
				label: topicLabel( slug ),
				url: `/topics/${ slug }/`,
				count: posts.length,
				posts: posts.sort( byNewestFirst )
			} ) )
			.sort( ( a, b ) => b.count - a.count || a.label.localeCompare( b.label ) );
	} );

	// Posts grouped by year, newest year first, for the archive page.
	config.addCollection( "postsByYear", ( collectionApi ) => {
		const byYear = new Map();

		for ( const post of [ ...collectionApi.getFilteredByTag( "posts" ) ].sort( byNewestFirst ) ) {
			const year = new Date( post.date ).getFullYear();
			if ( !byYear.has( year ) ) {
				byYear.set( year, [] );
			}
			byYear.get( year ).push( post );
		}

		return [ ...byYear.entries() ]
			.map( ( [ year, posts ] ) => ( { year, posts } ) )
			.sort( ( a, b ) => b.year - a.year );
	} );
}
