<?php
/**
 * Plugin Name:     Hyperlink Group Block
 * Plugin URI:      https://wordpress.org/plugins/hyperlink-group-block/
 * Description:     Combine blocks into a group wrapped with an hyperlink (&lt;a&gt;).
 * Version:         1.0.9
 * Author:          TipTopPress
 * Author URI:      http://tiptoppress.com
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     hyperlink-group-block
 *
 * @package         tiptip
 */

namespace hyperlinkGroup;

function render_block_core_post_title( $attributes, $content, $block ) {
	if ( ! get_the_ID() ) {
		return '';
	}

	$post_ID = get_the_ID();
	$title   = get_the_title();

	if ( ! $title ) {
		return '';
	}

	$align_class_name  = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";
	$linkTarget        = ! empty( $attributes['linkTarget'] ) ? 'target="' . esc_attr( $attributes['linkTarget'] ) . '"' : '';
	$rel               = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class_name ) );

	$post_url = $attributes['queryLoopLink'] ? get_the_permalink( $post_ID ) : $attributes['url'];
	
	$inner_blocks_html = '';
	foreach ( $block->inner_blocks as $inner_block ) {
		$inner_block_content = $inner_block->render();
		$inner_blocks_html .= $inner_block_content;
	}
	return sprintf(
		'<a href="%1$s" %2$s %3$s %4$s>%5$s</a>',
		$post_url,
		$wrapper_attributes,
		$linkTarget,
		$rel,
		$inner_blocks_html
	);
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function create_hyperlink_group_block_init() {
	register_block_type_from_metadata( __DIR__ ,
	array(
	   'render_callback' => __NAMESPACE__ . '\render_block_core_post_title',
   )
);
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
