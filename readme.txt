=== Hyperlink Group Block ===
Contributors:      kometschuh
Donate link:       https://www.paypal.com/donate/?hosted_button_id=RSR28JGA4M7JC
Tags:              block, hyperlink, link, gutenberg, anchor
Requires at least: 5.6
Tested up to:      5.9
Stable tag:        1.0.3
Requires PHP:      7.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Combine blocks into a group wrapped with an hyperlink (&lt;a&gt;).

== Description ==

Combine blocks into a group wrapped with an hyperlink (&lt;a&gt;).
After inserting a Hyperlink Group Block, a Block inserter icon will be displayed to allow you to add new Blocks inside that Hyperlink Group Block.

= Tip Top Press =
We're [Tip Top Press](http://tiptoppress.com/) and create Gutenberg Blocks for Wordpress. If you want to know about what we're working on and you are interested in backgrounds then you can read all newes storys on our [blog](http://tiptoppress.com/blog/?utm_source=wp.org&utm_medium=readme.txt&utm_campaign=hyperlink+group+block).

= Grouping Existing Blocks =
It's also possible to group existing Blocks. 
Select the Blocks which should be grouped with a Hyperlink. The Block Toolbar will appear. Click on the Block icon and select the Hyperlink Block to transform the selected Blocks to an Hyperlink Block with some InnerBlocks.

= Advanced =
In the Advanced Tab link [rel attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel) can be set.

= Features =
* Wrap Blocks with a hyperlink
* Transform Blocks into a group wrapped with an HTML anchor tag (&lt;a&gt;)
* Set the link href attribute
* Set rel attributes
* Option open in a new window

= Contribute =
While using this plugin if you find any bug or any conflict, please submit an issue at [Github](https://github.com/DanielFloeter/hyperlink-group-block) (If possible with a pull request).

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/hyperlink-group-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress 


== Frequently Asked Questions ==

= Can I use links within the Hyperlink Group Block? =

No, that is illegal and causes errors in the renderd HTML.

== Screenshots ==

1. Hyperlink Group Block to group Blocks with an hyperlink.
2. Wrap Blocks with a link.
3. Rendered HTML.
4. Advanced Settings for rel attributes.
5. Transform Blocks into a group wrapped with an anchor tag

== Changelog ==

= 1.0.3 - February 04th 2022 =
* Bugfix Disable focus if link picker is open
* Bugfix Set color

= 1.0.2 - February 04th 2022 =
* Bugfix __experimental code deleted in Gutenberg 12.5

= 1.0.1 - July 07th 2021 =
* Transforms

= 0.9.1 - July 06th 2021 =
* Release
