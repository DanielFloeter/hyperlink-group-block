/**
 * Upgrade test: content saved by plugin 2.0.5 must load without
 * "block recovery" in the current version.
 *
 * The 2.0.5 block (block.json + save) is registered first to produce real
 * markup, then replaced by the current block and the markup is parsed again.
 */
import {
	createBlock,
	parse,
	serialize,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import clsx from 'clsx';

jest.mock( '../style.scss', () => ( {} ) );
jest.mock( '../edit', () => () => null );

const NAME = 'tiptip/hyperlink-group-block';

// block.json of 2.0.5 (a29195e).
const legacyMetadata = {
	apiVersion: 3,
	title: 'Hyperlink Group',
	category: 'design',
	supports: {
		html: true,
		anchor: true,
		align: true,
		spacing: { margin: true, padding: true },
		interactivity: { clientNavigation: true },
	},
	attributes: {
		colorText: { type: 'string' },
		colorBkg: { type: 'string' },
		colorBkgHover: { type: 'string' },
		url: { type: 'string' },
		title: { type: 'string' },
		linkTarget: { type: 'string' },
		ariaLabel: { type: 'string' },
		rel: { type: 'string' },
		backgroundColor: { type: 'string' },
		textColor: { type: 'string' },
		gradient: { type: 'string' },
		queryLoopLink: { type: 'boolean', default: false },
	},
};

// save.js of 2.0.5.
function legacySave( { attributes } ) {
	const { linkTarget, rel, title, url, className } = attributes;
	return (
		<a
			className={ clsx( 'wp-block-hyperlink-group' ) }
			href={ url }
			title={ title }
			target={ linkTarget }
			rel={ rel }
		>
			<div { ...useBlockProps.save( { className: clsx( className ) } ) }>
				<InnerBlocks.Content />
			</div>
		</a>
	);
}

const cases = {
	minimal: { url: 'https://example.com' },
	'no url': {},
	'legacy colors + class': {
		url: 'https://example.com',
		colorText: '#ff0000',
		colorBkg: '#00ff00',
		colorBkgHover: '#0000ff',
		className: 'foo',
	},
	'new tab + rel + title + aria': {
		url: 'https://example.com',
		linkTarget: '_blank',
		rel: 'noreferrer noopener',
		title: 'Title',
		ariaLabel: 'Label',
	},
	'tab name': { url: 'https://example.com', linkTarget: 'my-tab' },
	'query loop': { queryLoopLink: true },
	anchor: { url: 'https://example.com', anchor: 'my-anchor' },
	'align wide': { url: 'https://example.com', align: 'wide' },
	'align full': { url: 'https://example.com', align: 'full' },
	'padding + margin': {
		url: 'https://example.com',
		style: {
			spacing: {
				padding: { top: '10px', right: '20px', bottom: '10px', left: '20px' },
				margin: { top: 'var:preset|spacing|30', bottom: '0' },
			},
		},
	},
	'preset color attrs': {
		url: 'https://example.com',
		textColor: 'primary',
		backgroundColor: 'secondary',
	},
	everything: {
		url: 'https://example.com',
		linkTarget: '_blank',
		rel: 'noreferrer noopener',
		title: 'Title',
		ariaLabel: 'Label',
		colorText: '#ff0000',
		colorBkg: '#00ff00',
		colorBkgHover: '#0000ff',
		className: 'foo bar',
		anchor: 'x',
		align: 'wide',
		style: { spacing: { padding: { top: '1em' } } },
	},
};

const legacyMarkup = {};

beforeAll( () => {
	registerBlockType( 'core/paragraph', {
		apiVersion: 3,
		title: 'P',
		category: 'text',
		supports: { className: false },
		attributes: { content: { type: 'string', source: 'html', selector: 'p' } },
		save: ( { attributes } ) => (
			<RawHTML>{ `<p>${ attributes.content }</p>` }</RawHTML>
		),
	} );

	registerBlockType( NAME, { ...legacyMetadata, save: legacySave } );
	for ( const [ label, attrs ] of Object.entries( cases ) ) {
		legacyMarkup[ label ] = serialize( [
			createBlock( NAME, attrs, [
				createBlock( 'core/paragraph', { content: 'Hi' } ),
			] ),
		] );
	}
	unregisterBlockType( NAME );

	require( '../index.js' );
} );

describe( 'content saved by 2.0.5', () => {
	test.each( Object.keys( cases ) )( '%s', ( label ) => {
		const [ block ] = parse( legacyMarkup[ label ] );
		if ( ! block.isValid ) {
			process.stdout.write(
				`\n--- ${ label } (invalid) ---\n${ legacyMarkup[ label ] }\n`
			);
		}
		expect( block.isValid ).toBe( true );
		// Every 2.0.5 block goes through a deprecation, which logs an info.
		expect( console ).toHaveInformed();

		// Re-saved content must stay valid.
		const [ again ] = parse( serialize( [ block ] ) );
		expect( again.isValid ).toBe( true );
	} );
} );

/**
 * Paste real markup from the code editor (Options → Code editor) here to
 * reproduce a block-recovery case.
 */
const realWorld = [
	// `<!-- wp:tiptip/hyperlink-group-block … /wp:tiptip/hyperlink-group-block -->`
];

( realWorld.length ? describe : describe.skip )( 'real world markup', () => {
	test.each( ( realWorld.length ? realWorld : [ '' ] ).map( ( m, i ) => [ i, m ] ) )( '#%i', ( i, markup ) => {
		const [ block ] = parse( markup );
		expect( block.isValid ).toBe( true );
	} );
} );
