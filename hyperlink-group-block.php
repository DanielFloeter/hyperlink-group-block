<?php
/**
 * Plugin Name:     Hyperlink Group Block
 * Plugin URI:      https://wordpress.org/plugins/hyperlink-group/
 * Description:     Combine blocks into a group wrapped with an hyperlink (&lt;a&gt;).
 * Version:         1.0.6
 * Author:          TipTopPress
 * Author URI:      http://tiptoppress.com
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     hyperlink-group-block
 *
 * @package         tiptip
 */

namespace hyperlinkGroup;

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function create_hyperlink_group_block_init() {
	register_block_type_from_metadata( __DIR__ );
}
add_action( 'init', __NAMESPACE__ . '\create_hyperlink_group_block_init' );

/**
 * Strip inner anchor elements
 *
 */
function add_button_size_class( $block_content = '', $block = [] ) {
	if ( isset( $block['blockName'] ) && 'tiptip/hyperlink-group-block' === $block['blockName'] ) {
		$stripAnchors = function( $block ) use ( &$stripAnchors, &$html, &$block_content ) {
			foreach( $block as $b){
				if( str_contains( $b['innerHTML'], '<a' ) ) {
					$replace = $b['innerHTML'];
					$b['innerHTML'] = str_replace(
						'<a',
						'<span',
						$b['innerHTML']
					);
					$b['innerHTML'] = str_replace(
						'</a>',
						'</span>',
						$b['innerHTML']
					);
					$block_content = str_replace(
						$replace,
						$b['innerHTML'],
						$block_content
					);
				}
				if( ! empty( $b['innerBlocks'] ) ) {
					$stripAnchors( $b['innerBlocks'] );
				}
			}
		};
		$stripAnchors( $block['innerBlocks'] );

		return $block_content;
	}
	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\add_button_size_class', 10, 2 );
