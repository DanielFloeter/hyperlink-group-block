import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useCallback, useState, useRef } from '@wordpress/element';
import {
	KeyboardShortcuts,
	TextControl,
	ToolbarButton,
	Popover,
	ToggleControl,
	PanelBody,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import { 
	InnerBlocks,
	useBlockProps,
	InspectorAdvancedControls,
	__experimentalUseInnerBlocksProps,
	useInnerBlocksProps as stableUseInnerBlocksProps,
	__experimentalLinkControl,
	LinkControl as stableLinkControl,
	store as blockEditorStore,
	BlockControls,
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { rawShortcut, displayShortcut } from '@wordpress/keycodes';
import {
	link,
	linkOff,
	reset,
	formatUnderline,
	formatStrikethrough,
} from '@wordpress/icons';
import { useEntityProp } from '@wordpress/core-data';

import {
	getLinkColorProps,
	setHoverBackground,
	setHoverTextDecoration,
} from './link-colors';

export const useInnerBlocksProps = __experimentalUseInnerBlocksProps || stableUseInnerBlocksProps; // WP +5.9
export const LinkControl         = __experimentalLinkControl || stableLinkControl; // WP +5.9

const NEW_TAB_REL = 'noreferrer noopener';

export default function Edit({ attributes, setAttributes, isSelected, clientId, context: { postType, postId, queryId } }) {
	const {
		linkTarget,
		ariaLabel,
		rel,
		title,
		url,
		queryLoopLink,
		style,
		// Added by the `allowedBlocks` block support (Advanced panel).
		allowedBlocks,
	} = attributes;
	const [ queryLoopUrl ] = useEntityProp( 'postType', postType, 'link', postId );
	const { hasInnerBlocks } = useSelect(
		( select ) => {
			const { getBlock, getSettings } = select( blockEditorStore );
			const block = getBlock( clientId );
			return {
				hasInnerBlocks: !! ( block && block.innerBlocks.length ),
				themeSupportsLayout: getSettings()?.supportsLayout,
			};
		},
		[ clientId ]
	);
	const ref = useRef();
	const linkColorProps = getLinkColorProps( style );
	const blockProps = useBlockProps( {
		ref,
		className: clsx( linkColorProps.className ),
		style: linkColorProps.style,
	} );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const hoverTextDecoration = style?.elements?.link?.[ ':hover' ]?.typography?.textDecoration;
	// Core strings, so the label is translated by WordPress ("Dekoration (Hover)").
	const hoverDecorationLabel = `${ __( 'Decoration' ) } (${ __( 'Hover' ) })`;
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender
	} );
	const onQueryLoopLink = useCallback(
		( value ) => {
			setAttributes( { queryLoopLink: value } );
		},
		[ setAttributes ]
	);
	const onSetAriaLabel = useCallback(
		( value ) => {
			setAttributes( { ariaLabel: value } );
		},
		[ setAttributes ]
	);
	const onSetTabName = useCallback(
		( value ) => {
			const updatedRel = value !== '_blank' ? undefined : rel;

			setAttributes( { 
				linkTarget: value,
				rel: updatedRel
			} );
		},
		[ setAttributes ]
	);
	const onSetLinkRel = useCallback(
		( value ) => {
			setAttributes( { rel: value } );
		},
		[ setAttributes ]
	);
	const onSetLinkTitle = useCallback(
		( value ) => {
			setAttributes( { title: value } );
		},
		[ setAttributes ]
	);
	const onToggleOpenInNewTab = useCallback(
		( value ) => {
			const newLinkTarget = value ? '_blank' : undefined;

			let updatedRel = rel;
			if ( newLinkTarget && ! rel ) {
				updatedRel = NEW_TAB_REL;
			} else if ( ! newLinkTarget && rel === NEW_TAB_REL ) {
				updatedRel = undefined;
			}

			setAttributes( {
				linkTarget: newLinkTarget,
				rel: updatedRel,
			} );
		},
		[ rel, setAttributes ]
	);

	function URLPicker( {
		isSelected,
		url,
		setAttributes,
		opensInNewTab,
		onToggleOpenInNewTab,
		anchorRef,
	} ) {
		url = queryLoopLink ? queryLoopUrl : url;
		const [ isURLPickerOpen, setIsURLPickerOpen ] = useState( false );
		const urlIsSet = !! url;
		const urlIsSetandSelected = urlIsSet && isSelected;
		const openLinkControl = () => {
			setIsURLPickerOpen( true );
			return false; // prevents default behaviour for event
		};
		const unlinkButton = () => {
			setAttributes( {
				url: undefined,
				linkTarget: undefined,
				rel: undefined,
			} );
			setIsURLPickerOpen( false );
		};
		const linkControl = ( isURLPickerOpen || urlIsSetandSelected ) && (
			<Popover
				focusOnMount={ false }
				position="bottom center"
				onClose={ () => setIsURLPickerOpen( false ) }
				anchorRef={ anchorRef?.current }
			>
				<LinkControl
					className="wp-block-navigation-link__inline-link-input"
					value={ { url, opensInNewTab } }
					onChange={ ( {
						url: newURL = '',
						opensInNewTab: newOpensInNewTab,
					} ) => {
						setAttributes( { url: newURL } );
	
						if ( opensInNewTab !== newOpensInNewTab ) {
							onToggleOpenInNewTab( newOpensInNewTab );
						}
					} }
				/>
			</Popover>
		);
		return (
			<>
				<BlockControls group="block">
					{ ! urlIsSet && (
						<ToolbarButton
							name="link"
							icon={ link }
							title={ __( 'Link' ) }
							shortcut={ displayShortcut.primary( 'k' ) }
							onClick={ openLinkControl }
						/>
					) }
					{ urlIsSetandSelected && (
						<ToolbarButton
							name="link"
							icon={ linkOff }
							title={ __( 'Unlink' ) }
							shortcut={ displayShortcut.primaryShift( 'k' ) }
							onClick={ unlinkButton }
							isActive={ true }
						/>
					) }
				</BlockControls>
				{ isSelected && (
					<KeyboardShortcuts
						bindGlobal
						shortcuts={ {
							[ rawShortcut.primary( 'k' ) ]: openLinkControl,
							[ rawShortcut.primaryShift( 'k' ) ]: unlinkButton,
						} }
					/>
				) }
				{ linkControl }
			</>
		);
	}

	return (
		<>
				<URLPicker
					url={ url }
					setAttributes={ setAttributes }
					isSelected={ isSelected }
					opensInNewTab={ linkTarget }
					onToggleOpenInNewTab={ onToggleOpenInNewTab }
					anchorRef={ ref }
				/>
				<InspectorControls>
					<PanelBody title={ __( 'Link settings' ) }>
						<ToggleControl
							label="Use link from Query Loop Block"
							help={
								'Link to the current post when using inside a Query Loop Block.'
							}
							checked={ queryLoopLink }
							onChange={ onQueryLoopLink }
						/>
					</PanelBody>
				</InspectorControls>
				<InspectorAdvancedControls>
					<TextControl
						help={ __( 'Use same tabname as target to open in same tabs' ) }
						label={ __( 'Tab name' ) }
						value={ linkTarget || '' }
						onChange={ onSetTabName }
					/>
					<TextControl
						label={ __( 'Link rel' ) }
						value={ rel || '' }
						onChange={ onSetLinkRel }
					/>
					<TextControl
						label={ __( 'Aria-Label' ) }
						value={ ariaLabel || '' }
						onChange={ onSetAriaLabel }
					/>
					<TextControl
						label={ __( 'Link title' ) }
						value={ title || '' }
						onChange={ onSetLinkTitle }
					/>
				</InspectorAdvancedControls>
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						__experimentalIsRenderedInSidebar
						settings={ [
							{
								colorValue: style?.elements?.link?.[ ':hover' ]?.color?.background,
								label: __( 'Background hover', 'hyperlink-group-block' ),
								onColorChange: ( value ) =>
									setAttributes( { style: setHoverBackground( style, value ) } ),
								isShownByDefault: true,
								enableAlpha: true,
								clearable: true,
								resetAllFilter: ( attrs ) => ( {
									...attrs,
									style: setHoverBackground( attrs.style, undefined ),
								} ),
							},
						] }
						panelId={ clientId }
						{ ...colorGradientSettings }
						gradients={ [] }
						disableCustomGradients
					/>
				</InspectorControls>
				<InspectorControls group="typography">
					<ToolsPanelItem
						label={ hoverDecorationLabel }
						hasValue={ () => !! hoverTextDecoration }
						onDeselect={ () =>
							setAttributes( { style: setHoverTextDecoration( style, undefined ) } )
						}
						resetAllFilter={ ( attrs ) => ( {
							...attrs,
							style: setHoverTextDecoration( attrs.style, undefined ),
						} ) }
						panelId={ clientId }
					>
						<ToggleGroupControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							isDeselectable
							label={ hoverDecorationLabel }
							value={ hoverTextDecoration }
							onChange={ ( value ) =>
								setAttributes( {
									style: setHoverTextDecoration( style, value ),
								} )
							}
						>
							<ToggleGroupControlOptionIcon value="none" icon={ reset } label={ __( 'None' ) } />
							<ToggleGroupControlOptionIcon value="underline" icon={ formatUnderline } label={ __( 'Underline' ) } />
							<ToggleGroupControlOptionIcon value="line-through" icon={ formatStrikethrough } label={ __( 'Strikethrough' ) } />
						</ToggleGroupControl>
					</ToolsPanelItem>
				</InspectorControls>
				<a { ...innerBlocksProps } />
		</>
	);
}