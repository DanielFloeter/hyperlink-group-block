import classnames from 'classnames';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes, className }) {
	const { 
		linkTarget,
		rel,
		title,
		url,
	} = attributes;
	const buttonClasses = classnames(
		'wp-block-hyperlink-group',
	);
	const wrapperClasses = classnames( className );

	return (
		<div { ...useBlockProps.save( { className: wrapperClasses } ) }>
			<a 
				className={ buttonClasses }
				href={ url }
				title={ title }
				target={ linkTarget }
				rel={ rel }
			>
				<InnerBlocks.Content />
			</a>
		</div>
	);
}

