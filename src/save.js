import clsx from 'clsx';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';


// Leave save.js for deprecated.js
export default function save({ attributes }) {
	const { 
		linkTarget,
		rel,
		title,
		url,
		className,
	} = attributes;

	const buttonClasses = clsx(
		'wp-block-hyperlink-group',
	);
	const wrapperClasses = clsx( className );

	return (
		<a 
			className={ buttonClasses }
			href={ url }
			title={ title }
			target={ linkTarget }
			rel={ rel }
		>
			<div { ...useBlockProps.save( { className: wrapperClasses } ) }>
					<InnerBlocks.Content />
			</div>
		</a>
	);
}

