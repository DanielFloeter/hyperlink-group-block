/**
 * Link colors for the block wrapper.
 *
 * The block itself is the `<a>`, so the native `elements.link` styles
 * (which target descendant `a` elements) don't reach it. These helpers turn
 * `style.elements.link` into CSS custom properties + classes on the wrapper.
 * Keep in sync with `link_color_declarations()` in hyperlink-group-block.php.
 */

/**
 * Converts `var:preset|color|slug` to `var(--wp--preset--color--slug)`.
 *
 * @param {string|undefined} value Raw style value.
 * @return {string|undefined} CSS value.
 */
export function toCssValue( value ) {
	if ( typeof value !== 'string' || value === '' ) {
		return undefined;
	}
	if ( value.startsWith( 'var:' ) ) {
		return `var(--wp--${ value.slice( 4 ).split( '|' ).join( '--' ) })`;
	}
	return value;
}

export function getLinkStyles( style ) {
	const link = style?.elements?.link;
	return {
		color: toCssValue( link?.color?.text ),
		hoverColor: toCssValue( link?.[ ':hover' ]?.color?.text ),
		hoverBackground: toCssValue( link?.[ ':hover' ]?.color?.background ),
	};
}

/**
 * Wrapper classes and custom properties for the link colors.
 *
 * @param {Object} style The block's `style` attribute.
 * @return {{className: Object, style: Object}} Props for useBlockProps.
 */
export function getLinkColorProps( style ) {
	const { color, hoverColor, hoverBackground } = getLinkStyles( style );
	const cssVars = {};
	if ( color ) {
		cssVars[ '--hgb-link-color' ] = color;
	}
	if ( hoverColor ) {
		cssVars[ '--hgb-link-hover-color' ] = hoverColor;
	}
	if ( hoverBackground ) {
		cssVars[ '--hgb-hover-background' ] = hoverBackground;
	}
	return {
		className: {
			'has-hgb-link-color': !! color,
			'has-hgb-link-hover-color': !! hoverColor,
			'has-hgb-hover-background': !! hoverBackground,
		},
		style: cssVars,
	};
}

/**
 * Removes empty objects/undefined values recursively.
 *
 * @param {Object} object Object to clean.
 * @return {Object|undefined} Cleaned object or undefined when empty.
 */
export function cleanEmptyObject( object ) {
	if ( object === null || typeof object !== 'object' || Array.isArray( object ) ) {
		return object;
	}
	const cleaned = Object.fromEntries(
		Object.entries( object )
			.map( ( [ key, value ] ) => [ key, cleanEmptyObject( value ) ] )
			.filter( ( [ , value ] ) => value !== undefined && value !== '' )
	);
	return Object.keys( cleaned ).length ? cleaned : undefined;
}

/**
 * Returns a new style object with the hover background set.
 *
 * @param {Object}           style Current style attribute.
 * @param {string|undefined} value New color.
 * @return {Object|undefined} New style attribute.
 */
export function setHoverBackground( style, value ) {
	const link = style?.elements?.link ?? {};
	const hover = link[ ':hover' ] ?? {};
	return cleanEmptyObject( {
		...style,
		elements: {
			...style?.elements,
			link: {
				...link,
				':hover': {
					...hover,
					color: { ...hover.color, background: value },
				},
			},
		},
	} );
}

/**
 * Maps the legacy attributes `colorText`, `colorBkg`, `colorBkgHover`
 * (plugin <= 2.0.5) to the native `style` attribute.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Migrated attributes.
 */
export function migrateLegacyColors( attributes ) {
	const { colorText, colorBkg, colorBkgHover, ...rest } = attributes;
	if ( ! colorText && ! colorBkg && ! colorBkgHover ) {
		return rest;
	}
	let style = cleanEmptyObject( {
		...rest.style,
		color: {
			...rest.style?.color,
			text: rest.style?.color?.text ?? colorText,
			background: rest.style?.color?.background ?? colorBkg,
		},
	} );
	if ( colorBkgHover ) {
		style = setHoverBackground( style, colorBkgHover );
	}
	return { ...rest, style };
}
