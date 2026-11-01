import { parse, serialize, registerBlockType } from '@wordpress/blocks';
import { RawHTML } from '@wordpress/element';

jest.mock( '../style.scss', () => ( {} ) );
jest.mock( '../edit', () => () => null );

beforeAll( () => {
	registerBlockType( 'core/paragraph', {
		apiVersion: 3,
		title: 'P',
		supports: { className: false },
		attributes: { content: { type: 'string', source: 'html', selector: 'p' } },
		save: ( { attributes } ) => <RawHTML>{ `<p>${ attributes.content }</p>` }</RawHTML>,
	} );
	require( '../index.js' );
} );

const v2 = `<!-- wp:tiptip/hyperlink-group-block {"colorText":"#ff0000","colorBkg":"#00ff00","colorBkgHover":"#0000ff","url":"https://example.com","className":"foo"} -->
<a class="wp-block-hyperlink-group" href="https://example.com"><div class="wp-block-tiptip-hyperlink-group-block foo"><!-- wp:paragraph -->
<p>Hi</p>
<!-- /wp:paragraph --></div></a>
<!-- /wp:tiptip/hyperlink-group-block -->`;

const v1 = `<!-- wp:tiptip/hyperlink-group-block {"url":"https://example.com"} -->
<div class="wp-block-tiptip-hyperlink-group-block"><a class="wp-block-hyperlink-group" href="https://example.com"><!-- wp:paragraph -->
<p>Hi</p>
<!-- /wp:paragraph --></a></div>
<!-- /wp:tiptip/hyperlink-group-block -->`;

test( 'v2 migrates legacy colors', () => {
	const [ block ] = parse( v2 );
	expect( block.isValid ).toBe( true );
	expect( block.attributes.colorText ).toBeUndefined();
	expect( block.attributes.style ).toEqual( {
		color: { text: '#ff0000', background: '#00ff00' },
		elements: { link: { ':hover': { color: { background: '#0000ff' } } } },
	} );
	process.stdout.write( serialize( [ block ] ) + '\n\n' );
	expect( console ).toHaveInformed();
	const [ again ] = parse( serialize( [ block ] ) );
	expect( again.isValid ).toBe( true );
} );

test( 'v1 still valid', () => {
	const [ block ] = parse( v1 );
	expect( block.isValid ).toBe( true );
	process.stdout.write( serialize( [ block ] ) + '\n\n' );
	expect( console ).toHaveInformed();
} );
