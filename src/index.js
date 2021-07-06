import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { link as icon } from '@wordpress/icons';

import './style.scss';

import Edit from './edit';
import save from './save';

import metadata from './../block.json';
const { name } = metadata;

registerBlockType( name, {
	...metadata,
	icon,
	description: __(
        'Combine blocks into a group wrapped with an hyperlink.',
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
				type: 'block',
				isMultiBlock: true,
				blocks: [ '*' ],
				__experimentalConvert( blocks ) {
					// Avoid transforming a single `core/group` Block
					if (
						blocks.length === 1 &&
						blocks[ 0 ].name === 'tiptip/hyperlink-group'
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
						'tiptip/hyperlink-group',
						groupInnerBlocks
					);
				},
			},
		]
	},
	edit: Edit,
	save,
} );
