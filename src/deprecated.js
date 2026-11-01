import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import clsx from 'clsx';

import { migrateLegacyColors } from './link-colors';

/**
 * Deprecations must not inherit block.json: new supports would otherwise change
 * the markup they produce and old content would fail to validate.
 */
const legacySupports = {
	html: true,
	anchor: true,
	align: true,
	spacing: {
		margin: true,
		padding: true,
	},
};

const legacyAttributes = {
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
};

// <= 2.0.5: <a><div wrapper>…</div></a>, custom color attributes.
const v2 = {
	apiVersion: 3,
	attributes: legacyAttributes,
	supports: legacySupports,
	migrate: migrateLegacyColors,
	save( { attributes } ) {
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
	},
};

// <div wrapper><a>…</a></div>
const v1 = {
	apiVersion: 3,
	attributes: legacyAttributes,
	supports: legacySupports,
	migrate: migrateLegacyColors,
	save( { attributes, className } ) {
		const { linkTarget, rel, title, url } = attributes;

		return (
			<div { ...useBlockProps.save( { className: clsx( className ) } ) }>
				<a
					className={ clsx( 'wp-block-hyperlink-group' ) }
					href={ url }
					title={ title }
					target={ linkTarget }
					rel={ rel }
				>
					<InnerBlocks.Content />
				</a>
			</div>
		);
	},
};

/**
 * New deprecations need to be placed first
 * for them to have higher priority.
 *
 * See block-deprecation.md
 */
export default [ v2, v1 ];
