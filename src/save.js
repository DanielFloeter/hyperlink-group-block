import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

// The front end is rendered by PHP (render_callback). This markup is used for
// block validation and as fallback, and mirrors the PHP output: the block
// wrapper is the `<a>` itself, so all block supports land on it.
export default function save( { attributes } ) {
	const { linkTarget, rel, title, url } = attributes;

	return (
		<a
			{ ...useBlockProps.save() }
			href={ url }
			title={ title }
			target={ linkTarget }
			rel={ rel }
		>
			<InnerBlocks.Content />
		</a>
	);
}
