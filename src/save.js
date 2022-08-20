import classnames from 'classnames';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { 
		linkTarget,
		rel,
		title,
		url,
	} = attributes;

	const buttonClasses = classnames(
		'wp-block-hyperlink-group',
	);

	return (
		<a 
			className={ buttonClasses }
			href={ url }
			title={ title }
			target={ linkTarget }
			rel={ rel }
		>
			<div>
					<InnerBlocks.Content />
			</div>
		</a>
	);
}

