=== Hyperlink Group Block ===
Contributors:      kometschuh
Donate link:       https://www.paypal.com/donate/?hosted_button_id=RSR28JGA4M7JC
Tags:              clickable, hyperlink, link, card, anchor
Requires at least: 6.6
Tested up to:      7.1
Stable tag:        2.1.0
Requires PHP:      7.2
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Make a group of blocks clickable: wrap a card, teaser or post tile with one link (&lt;a&gt;).

== Description ==

The Hyperlink Group Block wraps any blocks, like an image, heading and text, with a single link. The whole area becomes clickable, perfect for cards, teasers and call-to-action boxes.

Inside a Query Loop, the block can link to the current post, so every post tile becomes clickable.

= Grouping Existing Blocks =
Select the blocks, click the block icon in the toolbar and choose Hyperlink Group Block. A Group Block can be transformed into a Hyperlink Group Block and back.

= Features =
* Wrap blocks with a link
* Use the link from the Query Loop Block
* Transform blocks or a Group Block into a Hyperlink Group Block and back
* Set rel, title, aria-label and target (open in a new tab or a named tab)
* Native block supports: colors, link and link hover color, typography, spacing, border, shadow, background image
* Hover background color and hover text decoration
* Inner links stay clickable (stretched link)

= Tip Top Press =
We're [Tip Top Press](https://tiptoppress.com/) and create Gutenberg blocks for WordPress. Read news and background stories on our [blog](https://tiptoppress.com/blog/).

= Contribute =
While using this plugin if you find any bug or any conflict, please submit an issue at [Github](https://github.com/DanielFloeter/hyperlink-group-block) (If possible with a pull request).

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/hyperlink-group-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress 


== Frequently Asked Questions ==

= WPML support (translate the anchor) =

There are two kinds for WPML translation.

Translate with "WordPress Editor", not with "WPML Translation Editor":
WPML > Settings > Translation Editor > Classic Translation Editor
or
Your site in admin / gutenberg mode > right sidebar / Page > language > Translations > WordPress Editor

Other option but there is a bug, it doesn't work for us?
[wpml.org/faq](https://wpml.org/faq/) / FAQ > How-To > "How can I translate links and HTML attributes in the Advanced Translation Editor?"
Search content: "http" [YouTube](https://wpml.org/announcements/2020/02/translating-links-with-advanced-translation-editor/)

= Can I use links within the Hyperlink Group Block? =

Yes. Inner links stay clickable, the group is then rendered as `<div>` with a stretched link covering the whole block.

= Can I change the text decoration on hover? =

Yes. In the block sidebar open Styles > Typography, click the options menu (⋮) and enable "Decoration (Hover)". Choose Underline.

= Can I set the link color and link hover color? =

Yes. The block uses the native WordPress block supports. In the block sidebar open Styles > Color > Link to set the link color and the hover color. There you can also set text, background, heading and "Background hover" colors.

== Screenshots ==

1. Hyperlink Group Block in the editor with the native style settings: typography, background hover color, background image and layout.
2. Set the link URL and open it in a new tab.
3. Rendered HTML.
4. Advanced Settings for link target, rel, title and aria-label attributes.
5. Transform Blocks into a group wrapped with an anchor tag

== Changelog ==

= 2.1.0 - Nov 1st 2026 =
* Native block support, like text, heading or "Link hover color"
* Hover text decoration (block option)
* Transform: Group to Hyperlink Group and back (replace instead of wrap)
* Inner links stay clickable with stretched links

= 2.0.5 - Feb 18th 2026 =
* Set tab name to open link in the same tab

= 2.0.4 - August 05th 2025 =
* Update block.json's API version

= 2.0.3 - June 20th 2025 =
* Replace classnames with clsx

= 2.0.2 - May 11th 2025 =
* Bugfix Escaping data

= 2.0.1 - Jan 13th 2025 =
* Support disable Force page reload with Query Loop

= 2.0.0 - Nov 05th 2024 =
* Title attribute

= 1.17.6 - Oct 24th 2024 =
* Bugfix Nested anchors
* Escape output

= 1.17.5 - April 5th 2024 =
* Bugfix Extra quotes

= 1.17.4 - April 3rd 2024 =
* Bugfix Don't render unless HTML

= 1.17.3 - April 2nd 2024 =
* Bugfix Delete deprecated

= 1.17.2 - April 1st 2024 =
* Aria-label

= 1.17.1 - April 25th 2023 =
* Bugfix No content

= 1.1.6 - April 23th 2023 =
* Bugfix Deprecated

= 1.1.5 - April 19th 2023 =
* Bugfix Styles don't work

= 1.1.4 - April 12th 2023 =
* Bugfix Selector priority

= 1.1.3 - April 12th 2023 =
* Bugfix No CSS class

= 1.1.2 - April 10th 2023 =
* Bugfix Delete test code

= 1.1.1 - April 06th 2023 =
* Option Background Color onhover

= 1.0.9 - March 24th 2023 =
* Use link from Query Loop Block

= 1.0.8 - August 20th 2022 =
* Render CSS classes

= 1.0.7 - August 20th 2022 =
* No saving when adding CSS classes

= 1.0.6 - March 07th 2022 =
* Markup migration code

= 1.0.5 - March 06th 2022 =
* Backward compatible experimental flag usage

= 1.0.4 - February 13th 2022 =
* Delete inner anchor elements

= 1.0.3 - February 04th 2022 =
* Bugfix Disable focus if link picker is open
* Bugfix Set color

= 1.0.2 - February 04th 2022 =
* Bugfix __experimental code deleted in Gutenberg 12.5

= 1.0.1 - July 07th 2021 =
* Transforms

= 0.9.1 - July 06th 2021 =
* Release
