<?php
/**
 * Plugin Name:     Hyperlink Group Block
 * Plugin URI:      https://wordpress.org/plugins/hyperlink-group-block/
 * Description:     Combine blocks into a group wrapped with an hyperlink (&lt;a&gt;).
 * Version:         1.17.5
 * Author:          TipTopPress
 * Author URI:      http://tiptoppress.com
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     hyperlink-group-block
 *
 * @package         tiptip
 */

namespace hyperlinkGroup;

function render_block_core( $attributes, $content, $block ) {
	$align_class_name   = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";
	$linkTarget         = ! empty( $attributes['linkTarget'] ) ? 'target="' . esc_attr( $attributes['linkTarget'] ) . '"' : '';
	$rel                = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
	$aria_Label         = ! empty( $attributes['ariaLabel'] ) ? 'aria-label="' . esc_attr( $attributes['ariaLabel'] ) . '"' : '';

	$url                = isset( $attributes['url'] ) && $attributes['url'] ? $attributes['url'] : "";
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class_name ) );

	$post_url           = $attributes['queryLoopLink'] ? get_the_permalink( get_the_ID() ) : $url;
	$post_url           = $post_url !== '' ? 'href="' . $post_url . '"' : '';
	
	$inner_blocks_html  = '';
	foreach ( $block->inner_blocks as $inner_block ) {
		$inner_block_content = $inner_block->render();
		$inner_blocks_html .= $inner_block_content;
	}
	return sprintf(
		'<a %1$s %2$s %3$s %4$s %5$s>%6$s</a>',
		$post_url,
		$rel,
		$aria_Label,
		$wrapper_attributes,
		$linkTarget,
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
	   'render_callback' => __NAMESPACE__ . '\render_block_core',
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
		$color_text      = (isset( $block['attrs']['colorText'] ) && $block['attrs']['colorText'] !== '') ? '--color-text:' . $block['attrs']['colorText'] . ';' : '';
		$color_bkg       = (isset( $block['attrs']['colorBkg'] ) && $block['attrs']['colorBkg'] !== '') ? $block['attrs']['colorBkg'] : '';
		$color_bkg_hover = (isset( $block['attrs']['colorBkgHover'] ) && $block['attrs']['colorBkgHover'] !== '') ? $block['attrs']['colorBkgHover'] : $color_bkg;
		$color_bkg       = $color_bkg !== '' ? '--color-bkg:' . $color_bkg . ';' : '';
		$color_bkg_hover = $color_bkg_hover !== '' ? '--color-bkg-hover:' . $color_bkg_hover . ';' : '';

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

		$pattern = "/<[^>]+>/";
		preg_match($pattern, $block_content, $matches);
		if( str_contains( $matches[0], 'style="' ) ) {
			$block_content = str_replace(
				'style="',
				'style="' . $color_text . $color_bkg . $color_bkg_hover,
				$block_content
			);
		} else {
			if( $color_text . $color_bkg . $color_bkg_hover ) :
				$block_content = str_replace(
					'<a',
					'<a style="' . $color_text . $color_bkg . $color_bkg_hover . '"',
					$block_content
				);
			endif;
		}

		$content = $block_content;
        return $content;
	}
	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\add_button_size_class', 10, 2 );
