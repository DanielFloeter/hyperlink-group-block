import {
	createBlock,
	registerBlockType,
	switchToBlockType,
	getBlockType,
} from '@wordpress/blocks';
// Registers the block supports hooks that add `anchor`, `style`, colors, …
import '@wordpress/block-editor';

jest.mock( '../style.scss', () => ( {} ) );
jest.mock( '../edit', () => () => null );

const NAME = 'tiptip/hyperlink-group-block';

beforeAll( () => {
	registerBlockType( 'core/paragraph', {
		apiVersion: 3,
		title: 'P',
		attributes: { content: { type: 'string' } },
		save: () => null,
	} );
	registerBlockType( 'core/group', {
		apiVersion: 3,
		title: 'Group',
		supports: { anchor: true, align: true, color: { gradients: true } },
		attributes: {
			tagName: { type: 'string', default: 'div' },
			templateLock: { type: [ 'string', 'boolean' ] },
			allowedBlocks: { type: 'array' },
			layout: { type: 'object' },
		},
		save: () => null,
	} );
	require( '../index.js' );
} );

const groupAttributes = {
	tagName: 'section',
	anchor: 'hero',
	align: 'wide',
	className: 'foo',
	backgroundColor: 'primary',
	textColor: 'contrast',
	style: {
		spacing: { padding: { top: '1rem' } },
		border: { radius: '8px' },
	},
	layout: { type: 'constrained' },
};

test( 'core/group is replaced, not wrapped', () => {
	const paragraph = createBlock( 'core/paragraph', { content: 'Hi' } );
	const group = createBlock( 'core/group', groupAttributes, [ paragraph ] );

	const [ result ] = switchToBlockType( group, NAME );

	expect( result.name ).toBe( NAME );
	expect( result.innerBlocks ).toHaveLength( 1 );
	expect( result.innerBlocks[ 0 ].name ).toBe( 'core/paragraph' );
	expect( result.attributes ).toMatchObject( {
		anchor: 'hero',
		align: 'wide',
		className: 'foo',
		backgroundColor: 'primary',
		textColor: 'contrast',
		style: groupAttributes.style,
		layout: { type: 'constrained' },
	} );
	expect( result.attributes.tagName ).toBeUndefined();
} );

test( 'multiple blocks are still wrapped', () => {
	const blocks = [
		createBlock( 'core/paragraph', { content: 'One' } ),
		createBlock( 'core/group', {}, [] ),
	];

	const [ result ] = switchToBlockType( blocks, NAME );

	expect( result.name ).toBe( NAME );
	expect( result.innerBlocks.map( ( b ) => b.name ) ).toEqual( [
		'core/paragraph',
		'core/group',
	] );
} );

test( 'Hyperlink Group converts back to core/group without link attributes', () => {
	const paragraph = createBlock( 'core/paragraph', { content: 'Hi' } );
	const link = createBlock(
		NAME,
		{
			url: 'https://example.com',
			linkTarget: '_blank',
			rel: 'noopener',
			queryLoopLink: true,
			anchor: 'hero',
			backgroundColor: 'primary',
		},
		[ paragraph ]
	);

	const [ result ] = switchToBlockType( link, 'core/group' );

	expect( result.name ).toBe( 'core/group' );
	expect( result.innerBlocks ).toHaveLength( 1 );
	expect( result.attributes ).toMatchObject( {
		anchor: 'hero',
		backgroundColor: 'primary',
	} );
	expect( result.attributes.url ).toBeUndefined();
	expect( result.attributes.queryLoopLink ).toBeUndefined();
} );

test( 'ungroup returns the inner blocks', () => {
	const inner = [ createBlock( 'core/paragraph', { content: 'Hi' } ) ];
	const { ungroup } = getBlockType( NAME ).transforms;

	expect( ungroup( {}, inner ) ).toBe( inner );
} );
