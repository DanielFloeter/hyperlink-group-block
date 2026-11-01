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
	// The wrapper is an <a>, nested links would be invalid HTML.
	$inner_blocks_html  = strip_anchors( $inner_blocks_html );
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
 * Tag processor which can rename the tag name of the current tag.
 */
class Anchor_Stripper extends \WP_HTML_Tag_Processor {
	/**
	 * Replaces the tag name of the current tag (opener or closer).
	 */
	public function rename_current_tag( $new_name ) {
		if ( ! $this->set_bookmark( 'hgb-current' ) ) {
			return false;
		}
		$span = $this->bookmarks['hgb-current'];
		$this->release_bookmark( 'hgb-current' );

		// `<a` or `</a`: the tag name begins after `<` or `</`.
		$name_starts_at          = $span->start + ( $this->is_tag_closer() ? 2 : 1 );
		$this->lexical_updates[] = new \WP_HTML_Text_Replacement( $name_starts_at, strlen( $this->get_tag() ), $new_name );
		return true;
	}
}

/**
 * Turns every <a> in the given HTML into a <span> and removes link-only
 * attributes, so the inner blocks can be wrapped by the block's <a>.
 */
function strip_anchors( $html ) {
	if ( '' === $html || false === stripos( $html, '<a' ) ) {
		return $html;
	}
	$link_attributes = [ 'href', 'target', 'rel', 'download', 'hreflang', 'ping', 'referrerpolicy', 'type' ];

	$processor = new Anchor_Stripper( $html );
	while ( $processor->next_tag( [ 'tag_name' => 'a', 'tag_closers' => 'visit' ] ) ) {
		if ( ! $processor->is_tag_closer() ) {
			foreach ( $link_attributes as $attribute ) {
				$processor->remove_attribute( $attribute );
			}
		}
		$processor->rename_current_tag( 'span' );
	}
	return $processor->get_updated_html();
}

/**
 * Adds link colors to the rendered block.
 */
function render_link_colors( $block_content = '', $block = [] ) {
	if ( isset( $block['blockName'] ) && 'tiptip/hyperlink-group-block' === $block['blockName'] ) {
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

	$hover_decoration = isset( $hover['typography']['textDecoration'] ) ? $hover['typography']['textDecoration'] : '';
	$hover_decoration = in_array( $hover_decoration, [ 'none', 'underline', 'overline', 'line-through' ], true ) ? $hover_decoration : '';

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

	if ( $hover_decoration ) {
		$declarations[] = '--hgb-hover-text-decoration:' . $hover_decoration;
		$classes[]      = 'has-hgb-hover-text-decoration';
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

add_filter( 'render_block', __NAMESPACE__ . '\render_link_colors', 10, 2 );
