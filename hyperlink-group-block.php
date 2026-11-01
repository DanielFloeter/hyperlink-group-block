<?php
/**
 * Plugin Name:     Hyperlink Group Block
 * Plugin URI:      https://wordpress.org/plugins/hyperlink-group-block/
 * Description:     Combine blocks into a group wrapped with an hyperlink (&lt;a&gt;).
 * Version:         2.0.5
 * Author:          TipTopPress
 * Author URI:      http://tiptoppress.com
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     hyperlink-group-block
 *
 * @package         tiptip
 */

namespace hyperlinkGroup;

// Don't call the file directly
if (!defined('ABSPATH')) {
    exit;
}

function render_block_core( $attributes, $content, $block ) {
	$align_class_name   = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";
	$linkTarget         = ! empty( $attributes['linkTarget'] ) ? 'target="' . esc_attr( $attributes['linkTarget'] ) . '"' : '';
	$rel                = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
	$aria_Label         = ! empty( $attributes['ariaLabel'] ) ? 'aria-label="' . esc_attr( $attributes['ariaLabel'] ) . '"' : '';
	$title         		= ! empty( $attributes['title'] ) ? 'title="' . esc_attr( $attributes['title'] ) . '"' : '';

	$url                = isset( $attributes['url'] ) && $attributes['url'] ? $attributes['url'] : "";
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class_name ) );

	$post_url           = $attributes['queryLoopLink'] ? get_the_permalink( get_the_ID() ) : esc_url($url);
	$post_url           = $post_url !== '' ? 'href="' . $post_url . '"' : '';
	
	$inner_blocks_html  = '';
	foreach ( $block->inner_blocks as $inner_block ) {
		$inner_block_content = $inner_block->render();
		$inner_blocks_html .= $inner_block_content;
	}
	return sprintf(
		'<a %1$s %2$s %3$s %4$s %5$s %6$s>%7$s</a>',
		$post_url,
		$rel,
		$aria_Label,
		$title,
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
		$stripAnchors = function( $block ) use ( &$stripAnchors, &$block_content ) {
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
					$block_content = preg_replace(
						'/\s[a-zA-Z0-9-]*--[a-zA-Z0-9]*/',
						'',
						$block_content
					);
					$block_content = str_replace(
						trim($replace),
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

		return apply_link_colors( $block_content, isset( $block['attrs'] ) ? $block['attrs'] : [] );
	}
	return $block_content;
}

/**
 * Converts a style value (`var:preset|color|slug` or a color) to CSS.
 * Returns '' for values that are not safe inside a style attribute.
 */
function css_color_value( $value ) {
	if ( ! is_string( $value ) || '' === $value ) {
		return '';
	}
	if ( 0 === strpos( $value, 'var:' ) ) {
		$value = 'var(--wp--' . str_replace( '|', '--', substr( $value, 4 ) ) . ')';
	}
	return preg_match( '/^[a-zA-Z0-9#(),.%\s-]+$/', $value ) ? $value : '';
}

/**
 * Adds link/hover colors to the block wrapper (`<a>`).
 *
 * Native `elements.link` styles only target descendant links, so they are
 * exposed as custom properties + classes on the wrapper (see style.scss).
 * Also renders the legacy attributes `colorText`, `colorBkg`, `colorBkgHover`
 * (<= 2.0.5) for content not yet migrated in the editor.
 * Keep in sync with src/link-colors.js.
 */
function apply_link_colors( $block_content, $attrs ) {
	$style   = isset( $attrs['style'] ) && is_array( $attrs['style'] ) ? $attrs['style'] : [];
	$link    = isset( $style['elements']['link'] ) && is_array( $style['elements']['link'] ) ? $style['elements']['link'] : [];
	$hover   = isset( $link[':hover'] ) && is_array( $link[':hover'] ) ? $link[':hover'] : [];

	$link_color       = css_color_value( isset( $link['color']['text'] ) ? $link['color']['text'] : '' );
	$hover_color      = css_color_value( isset( $hover['color']['text'] ) ? $hover['color']['text'] : '' );
	$hover_background = css_color_value( isset( $hover['color']['background'] ) ? $hover['color']['background'] : '' );

	$declarations = [];
	$classes      = [];

	// Legacy attributes, only if no native value is set.
	$legacy_text = css_color_value( isset( $attrs['colorText'] ) ? $attrs['colorText'] : '' );
	$legacy_bkg  = css_color_value( isset( $attrs['colorBkg'] ) ? $attrs['colorBkg'] : '' );
	if ( $legacy_text && empty( $style['color']['text'] ) && empty( $attrs['textColor'] ) ) {
		$declarations[] = 'color:' . $legacy_text;
	}
	if ( $legacy_bkg && empty( $style['color']['background'] ) && empty( $attrs['backgroundColor'] ) ) {
		$declarations[] = 'background-color:' . $legacy_bkg;
	}
	if ( ! $hover_background ) {
		$hover_background = css_color_value( isset( $attrs['colorBkgHover'] ) ? $attrs['colorBkgHover'] : '' );
	}

	if ( $link_color ) {
		$declarations[] = '--hgb-link-color:' . $link_color;
		$classes[]      = 'has-hgb-link-color';
	}
	if ( $hover_color ) {
		$declarations[] = '--hgb-link-hover-color:' . $hover_color;
		$classes[]      = 'has-hgb-link-hover-color';
	}
	if ( $hover_background ) {
		$declarations[] = '--hgb-hover-background:' . $hover_background;
		$classes[]      = 'has-hgb-hover-background';
	}

	if ( ! $declarations ) {
		return $block_content;
	}

	$processor = new \WP_HTML_Tag_Processor( $block_content );
	if ( ! $processor->next_tag( 'a' ) ) {
		return $block_content;
	}
	foreach ( $classes as $class ) {
		$processor->add_class( $class );
	}
	$existing = trim( (string) $processor->get_attribute( 'style' ) );
	$existing = '' === $existing ? '' : rtrim( $existing, ';' ) . ';';
	$processor->set_attribute( 'style', $existing . implode( ';', $declarations ) . ';' );

	return $processor->get_updated_html();
}

add_filter( 'render_block', __NAMESPACE__ . '\add_button_size_class', 10, 2 );
