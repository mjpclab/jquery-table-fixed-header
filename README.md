# jQuery table fixed header

## Compatibility
Modern browsers that follows standards and IE7+

## Usage
``` javascript
$("table").tableFixedHeader();
```

``` javascript
$("table").tableFixedHeader({
	headerRows: 2		//if your header have more than 1 row
	/*, other options */
});
```

## Html Structure
The fixed header element will keep the same table group container as original table(such as `thead` or `tbody`).

The fixed header is just cloned from the original table. It follows after the original one to get CSS stylesheet rules applied as much as possible. Inline styles will also be cloned. However, the `id` attribute will be removed from cloned elements to make sure the `id` is unique in the page. If you apply your CSS by id, that would not work for cloned elements.

## Options
`headerRows`  
The number of leading rows from table that will be fixed.

`fixedClass`  
CSS class for fixed header.

`fixedTop`  
Top offset of the fixed header. Can be a number (of pixels) or a function that returns the value. Useful if you already have a fixed page header.

`scrollContainer`(Container version only)  
Determine the parent scroll container. Fixed header will locate based on that container.
