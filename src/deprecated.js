

import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import classnames from 'classnames';

import metadata from './../block.json';

const v1 = {
    ...metadata,
    save( { attributes, className } ) {
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
    },
};

const v2 = {
    ...metadata,
    save( { attributes } ) {
        const { 
            linkTarget,
            rel,
            title,
            url,
            className,
        } = attributes;
    
        const buttonClasses = classnames(
            'wp-block-hyperlink-group',
        );
        const wrapperClasses = classnames( className );
    
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
    },
};


/**
 * New deprecations need to be placed first
 * for them to have higher priority.
 *
 * Old deprecations may need to be updated as well.
 *
 * See block-deprecation.md
 */
export default [ v2, v1 ];
