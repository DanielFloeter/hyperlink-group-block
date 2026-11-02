import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { link as icon } from '@wordpress/icons';

import './style.scss';

import Edit from './edit';
import save from './save';
import deprecated from './deprecated';

import metadata from './../block.json';
const { name } = metadata;

registerBlockType( name, {
	...metadata,
	icon,
	description: __(
        'Combine blocks into a group wrapped with a hyperlink.',
        'hyperlink-group-block'
    ),
	keywords: [
        __('container'),
        __('wrapper'),
		__('anchor'),
		__('a'),
		__('hyperlink'),
		__('link'),
        __('tiptoppress'),
		__( 'card', 'hyperlink-group-block' ),
		__( 'teaser', 'hyperlink-group-block' ),
		__( 'box', 'hyperlink-group-block' ),
		__( 'tile', 'hyperlink-group-block' ),
		__( 'banner', 'hyperlink-group-block' ),
		__( 'call to action', 'hyperlink-group-block' ),
		__( 'clickable', 'hyperlink-group-block' ),
		__( 'stretched link', 'hyperlink-group-block' ),
		__( 'linked group', 'hyperlink-group-block' ),
		__( 'url', 'hyperlink-group-block' ),
		__( 'group', 'hyperlink-group-block' ),
		__( 'section', 'hyperlink-group-block' ),
	],
	example: {
		attributes: {
			style: {
				color: {
					text: '#000000',
					background: '#ffffff',
				},
			},
		},
		innerBlocks: [
			{
				name: 'core/paragraph',
				attributes: {
					customTextColor: '#cf2e2e',
					fontSize: 'large',
					content: __( 'One.' ),
				},
			},
			{
				name: 'core/paragraph',
				attributes: {
					customTextColor: '#ff6900',
					fontSize: 'large',
					content: __( 'Two.' ),
				},
			},
			{
				name: 'core/paragraph',
				attributes: {
					customTextColor: '#fcb900',
					fontSize: 'large',
					content: __( 'Three.' ),
				},
			},
			{
				name: 'core/paragraph',
				attributes: {
					customTextColor: '#00d084',
					fontSize: 'large',
					content: __( 'Four.' ),
				},
			},
			{
				name: 'core/paragraph',
				attributes: {
					customTextColor: '#0693e3',
					fontSize: 'large',
					content: __( 'Five.' ),
				},
			},
			{
				name: 'core/paragraph',
				attributes: {
					customTextColor: '#9b51e0',
					fontSize: 'large',
					content: __( 'Six.' ),
				},
			},
		],
	},
	transforms: {
		from: [
			{
				// Replace a single group instead of wrapping it: inner blocks
				// and all shared attributes (supports) move over.
				type: 'block',
				blocks: [ 'core/group' ],
				priority: 5, // must win over the '*' wildcard transform (default 10)
				transform: ( attributes, innerBlocks ) => {
					// Group-only attributes the Hyperlink Group doesn't have.
					const { tagName, templateLock, allowedBlocks, ...rest } =
						attributes;
					return createBlock( name, rest, innerBlocks );
				},
			},
			{
				type: 'block',
				isMultiBlock: true,
				blocks: [ '*' ],
				// Hide the transform for a single Hyperlink Group: converting it
				// would do nothing, the menu shows an empty preview.
				isMatch: ( attributes, blocks ) =>
					! (
						blocks.length === 1 &&
						blocks[ 0 ].name === 'tiptip/hyperlink-group-block'
					),
				__experimentalConvert( blocks ) {
					// Avoid transforming a single `core/group` Block
					if (
						blocks.length === 1 &&
						blocks[ 0 ].name === 'tiptip/hyperlink-group-block'
					) {
						return;
					}

					// Clone the Blocks to be Grouped
					// Failing to create new block references causes the original blocks
					// to be replaced in the switchToBlockType call thereby meaning they
					// are removed both from their original location and within the
					// new group block.
					const groupInnerBlocks = blocks.map( ( block ) => {
						return createBlock(
							block.name,
							block.attributes,
							block.innerBlocks
						);
					} );

					return createBlock(
						'tiptip/hyperlink-group-block',
						{},
						groupInnerBlocks

					);
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/group' ],
				transform: ( attributes, innerBlocks ) => {
					// Link-only attributes the group doesn't have.
					const {
						url,
						title,
						linkTarget,
						ariaLabel,
						rel,
						queryLoopLink,
						...rest
					} = attributes;
					return createBlock( 'core/group', rest, innerBlocks );
				},
			},
		],
		ungroup: ( attributes, innerBlocks ) => innerBlocks,
	},
	edit: Edit,
	save,
	deprecated,
} );