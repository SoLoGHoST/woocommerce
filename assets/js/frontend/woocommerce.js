jQuery( function( $ ) {

	// Orderby
	$( '.woocommerce-ordering' ).on( 'change', 'select.orderby', function() {
		if ($(this).val() == "brand")
		{
			if ($(this).next('select.brand').hasClass("hide"))
				$(this).next('select.brand').removeClass("hide");
		}
		else
		{
			if (typeof isBrand === 'undefined')
			{
				var noBrand = false;
			}
			else
			{
				var noBrand = $(this).next("select.brand").is(":visible") && $(this).next("select.brand").val() == "select-brand";
			}

			$(this).next("select.brand").remove();

			if (noBrand)
			{
				var pathArray = window.location.pathname.split( '/' );
				var newPath = '';

				if (pathArray[1] == 'product-category' && pathArray[2] != "")
				{
					var cats = pathArray[2].split('+');
					cats.pop();
					newPath = cats.join("+");
					var newURL = window.location.protocol + "//" + window.location.host + '/product-category/' + newPath + '/?orderby=' + $(this).val();
					window.location.href = newURL;
				}
			}
			else
				$(this).closest('form').submit();
		}
	});

	// We will not submit the form for brands!
	$( '.woocommerce-ordering' ).on( 'change', 'select.brand', function() {
		if ($(this).val() == "select-brand")
			return false;

		
		var pathArray = window.location.pathname.split( '/' );
		var newPath = '';
		if (pathArray[1] == 'product-category' && pathArray[2] != "")
		{
			if (typeof isBrand === 'undefined')
				newPath = pathArray[2];
			else
			{
				var cats = pathArray[2].split('+');
				cats.pop();
				newPath = cats.join("+");
			}

			var newURL = window.location.protocol + "//" + window.location.host + '/product-category/' + newPath + '+' + $(this).val() + '/';
		}
		window.location.href = newURL;
	});

	// Quantity buttons
	$( 'div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)' ).addClass( 'buttons_added' ).append( '<input type="button" value="+" class="plus" />' ).prepend( '<input type="button" value="-" class="minus" />' );

	// Target quantity inputs on product pages
	$( 'input.qty:not(.product-quantity input.qty)' ).each( function() {
		var min = parseFloat( $( this ).attr( 'min' ) );

		if ( min && min > 0 && parseFloat( $( this ).val() ) < min ) {
			$( this ).val( min );
		}
	});

	$( document ).on( 'click', '.plus, .minus', function() {

		// Get values
		var $qty		= $( this ).closest( '.quantity' ).find( '.qty' ),
			currentVal	= parseFloat( $qty.val() ),
			max			= parseFloat( $qty.attr( 'max' ) ),
			min			= parseFloat( $qty.attr( 'min' ) ),
			step		= $qty.attr( 'step' );

		// Format values
		if ( ! currentVal || currentVal === '' || currentVal === 'NaN' ) currentVal = 0;
		if ( max === '' || max === 'NaN' ) max = '';
		if ( min === '' || min === 'NaN' ) min = 0;
		if ( step === 'any' || step === '' || step === undefined || parseFloat( step ) === 'NaN' ) step = 1;

		// Change the value
		if ( $( this ).is( '.plus' ) ) {

			if ( max && ( max == currentVal || currentVal > max ) ) {
				$qty.val( max );
			} else {
				$qty.val( currentVal + parseFloat( step ) );
			}

		} else {

			if ( min && ( min == currentVal || currentVal < min ) ) {
				$qty.val( min );
			} else if ( currentVal > 0 ) {
				$qty.val( currentVal - parseFloat( step ) );
			}

		}

		// Trigger change event
		$qty.trigger( 'change' );
	});
});
