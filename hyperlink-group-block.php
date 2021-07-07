<?php
/**
 * Plugin Name:     Hyperlink Group Block
 * Plugin URI:      https://wordpress.org/plugins/hyperlink-group/
 * Description:     Combine blocks into a group wrapped with an hyperlink (&lt;a&gt;).
 * Version:         1.0.1
 * Author:          TipTopPress
 * Author URI:      http://tiptoppress.com
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     hyperlink-group-block
 *
 * @package         tiptip
 */

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
add_action( 'init', 'create_hyperlink_group_block_init' );
