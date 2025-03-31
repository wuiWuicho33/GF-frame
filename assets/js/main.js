/*=========
COMPONENTES
=========*/
/* # Upload image
---------------------------------------------- */
  document.getElementById("subirImagenBtn").addEventListener("click", function() {
	document.getElementById("inputImagen").click();
  });

  document.getElementById("inputImagen").addEventListener("change", function(event) {
	const archivo = event.target.files[0];
	if (archivo) {
	  alert(`Archivo seleccionado: ${archivo.name}`);
	}
  });

/* # Range selector
---------------------------------------------- */
var el, newPoint, newPlace, offset;
 
$('input[type=range]').on('input', function () {
    $(this).trigger('change');
});
// Select all range inputs, watch for change
$("input[type='range']").change(function() {

 // Cache this for efficiency
 el = $(this);
 
 // Measure width of range input
 width = el.width();
 
 // Figure out placement percentage between left and right of input
 newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
  
  offset = -1;

 // Prevent bubble from going beyond left or right (unsupported browsers)
 if (newPoint < 0) { newPlace = 0; }
 else if (newPoint > 1) { newPlace = width; }
 else { newPlace = width * newPoint + offset; offset -= newPoint; }
 
 // Move bubble
 el
   .next("output")
   .css({
     left: newPlace,
     marginLeft: offset + "%"
   })
     .text(el.val());
 })
 // Fake a change to position bubble at page load
 .trigger('change');



// JavaScript para cambiar la imagen destacada cuando se selecciona un "radio button"
document.addEventListener("DOMContentLoaded", function () {
  // Seleccionamos todas las galerías
  const galleries = document.querySelectorAll(".gallery-section");

  galleries.forEach(gallery => {
    const thumbnails = gallery.querySelectorAll(".thumbnail");
    const imagenDestacada = gallery.querySelector(".gallery-body #imagenDestacada");

    // Seleccionamos el primer thumbnail por defecto y le damos la clase 'selected'
    const firstThumbnail = thumbnails[0];
    firstThumbnail.classList.add("selected");
    imagenDestacada.src = firstThumbnail.dataset.img; // Establecer la imagen destacada al valor del primer thumbnail

    // Añadimos el evento click para cada thumbnail dentro de la galería
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener("click", function () {
        // Cambiar la imagen destacada a la imagen seleccionada
        imagenDestacada.src = this.dataset.img;
        
        // Eliminar el borde de todas las miniaturas y quitar la clase 'selected'
        thumbnails.forEach(th => th.classList.remove("selected"));
        
        // Agregar el borde a la imagen seleccionada y añadir la clase 'selected'
        this.classList.add("selected");
      });
    });
  });
});


/*===========================
Date group
===========================*/
// Elementos de la fecha de inicio
const startTextInput = document.getElementById('start-text-input');
const startDateInput = document.getElementById('start-date-input');

// Elementos de la fecha final
const endTextInput = document.getElementById('end-text-input');
const endDateInput = document.getElementById('end-date-input');

// Función para manejar el cambio de estado de los campos
function handleFieldInteraction(textInput, dateInput) {
    textInput.addEventListener('click', () => {
        textInput.style.display = 'none';
        dateInput.style.display = 'block';
        dateInput.focus();
    });

    dateInput.addEventListener('change', () => {
        if (dateInput.value) {
            textInput.style.display = 'block';
            textInput.value = dateInput.value;
            dateInput.style.display = 'none';
        }
    });

    dateInput.addEventListener('blur', () => {
        if (!dateInput.value) {
            textInput.style.display = 'block';
            dateInput.style.display = 'none';
        }
    });
}

// Aplicar la función a ambos pares de campos
handleFieldInteraction(startTextInput, startDateInput);
handleFieldInteraction(endTextInput, endDateInput);


/*===========================
Invertir contenido
===========================*/
// Seleccionamos el contenedor y el ícono
const ordenContainer = document.getElementById('ordenContainer');
const ordenIcon = document.getElementById('ordenIcon');

// Añadimos un evento de clic para alternar el ícono
ordenContainer.addEventListener('click', function() {
    // Comprobamos si el ícono actual es "fa-arrow-up-a-z"
    if (ordenIcon.classList.contains('fa-arrow-up-a-z')) {
        // Cambiamos el ícono a "fa-arrow-down-z-a"
        ordenIcon.classList.remove('fa-arrow-up-a-z');
        ordenIcon.classList.add('fa-arrow-down-z-a');
    } else {
        // Si no es "fa-arrow-up-a-z", lo cambiamos a "fa-arrow-up-a-z"
        ordenIcon.classList.remove('fa-arrow-down-z-a');
        ordenIcon.classList.add('fa-arrow-up-a-z');
    }
});

/* # Multiple select
---------------------------------------------- */
// helper function to check if the click was outside the element
function isOutsideNodeAndChildren($node, e) {
	// if the target of the click isn't the container...
	// nor a descendant of the container
	if (!$node.is(e.target) && $node.has(e.target).length === 0) {
		return true;
	} else {
		return false;
	}
}

// constructor definition
function MultiSelect($select) {
	this.$select = $select;
	this.$outer;
	this.$field;
	this.$optionList;
	this.$options;

	this.isActive = false;

	// function to create the individual options in the multi-select dropdown
	this.createMultiSelectOption = function(optionText, fieldName) {

		var option = document.createElement('div');
		var checkbox = document.createElement('input');
		var label = document.createElement('label');

		option.className = 'multi-select_option';
		option.tabIndex = -1;

		checkbox.className = 'multi-select_checkbox';
		checkbox.type = "checkbox";
		checkbox.tabIndex = '-1';
		checkbox.name = fieldName;

		label.className = 'multi-select_label';
		label.htmlFor = fieldName;
		label.textContent = optionText
		label.value = optionText

		option.appendChild(checkbox);
		option.appendChild(label);

		return option;
	}

	// function to toggle the selection state of options
	this.toggleSelected = function($option, e) {
		var $allCheckedOptions;
		var numChecked;
		var checkBox = $option.find('.multi-select_checkbox')[0];
		var $field = $option.parents('.multi-select').find('.multi-select_field');

		if (e.target.type !== 'checkbox') {
			if (checkBox.checked) checkBox.checked = false;
			else checkBox.checked = true;
		}

		$allCheckedOptions = $option.parent().find('.multi-select_option').has(':checked');
		numChecked = $allCheckedOptions.length;

		if (numChecked) {
			$field.removeClass('is-empty');

			// Si hay exactamente dos opciones seleccionadas
			if (numChecked === 2) {
				var selectedText = $allCheckedOptions.map(function() {
					return $(this).find('.multi-select_label').text();
				}).get().join(', ');  // Combina los textos con coma
				$field.text(selectedText);
			} 
			// Si hay tres o más opciones seleccionadas
			else if (numChecked > 2) {
				$field.text(numChecked + ' seleccionados');
			} 
			// Si solo hay una opción seleccionada
			else {
				$field.text($allCheckedOptions.find('.multi-select_label').text());
			}

		} else {
			$field.addClass('is-empty');
			$field.text('Haz una selección');
		}
	}

	// function to open the dropdown and attach click event to close on outside click
	this.activate = function(that) {
		this.$outer.addClass('is-active');
		this.$optionList.addClass('is-open');
		this.isActive = true;

		// make any click outside of the active multiselect close it
		$(document).on('click.closeMulti', function(e) {
			if (isOutsideNodeAndChildren(that.$outer, e)) {
				that.deactivate();
			}
		});
	}

	// function to close the dropdown
	this.deactivate = function() {
		// reset scroll position to top when opened again
		this.$optionList.scrollTop(0);

		this.$outer.removeClass('is-active');
		this.$optionList.removeClass('is-open');
		this.isActive = false;

		$(document).off('.closeMulti');
	}

	// function to attach the click event to the select field and options
	this.attachClickEvents = function(that) {
		this.$field.on('click', function(e) {
			// If the dropdown is active, close it
			if (that.isActive) {
				that.deactivate();
			} else {
				// If the dropdown is not active, open it
				that.activate(that);
			}
		});

		this.$options.on('click', function(e) {
			that.toggleSelected($(this), e);
		});
	}

	// function to handle keyboard events (tab, enter, arrow keys)
	this.attachKeyboardEvents = function(that) {
		// enforce blur on tab when any part of multi is focused.
		this.$field.on('keydown', function(e) {

			if (e.keyCode === 9) {
				that.deactivate();
				return;
			}

			if (e.keyCode === 40) {
				that.activate(that);
				that.$options.first().focus();

				// prevent scrolling the options list, let the focus handle it.
				e.preventDefault();
				return;
			}
		});

		this.$options.on('keydown', function(e) {
			switch (e.keyCode) {
				case 9:
					that.deactivate();
					break;
				case 13:
					that.toggleSelected($(this), e);
					break;
				case 40:
					$(this).next().focus();

					// prevent scrolling the options list, let the focus handle it.
					e.preventDefault();
					break;
				case 38:
					$(this).prev().focus();

					// prevent scrolling the options list, let the focus handle it.
					e.preventDefault();
					break;
				default:
					// do nothing;
					break;
			}
		});
	}

	// function to initialize the multi-select and replace the original select element
	this.init = function() {
		var that = this;

		var $options = this.$select.find('option');
		var fieldName = this.$select.attr('name');

		var multiSelect = document.createElement('div');
		var field = document.createElement('div');
		var optionsList = document.createElement('div');

		multiSelect.className = 'multi-select';
		field.className = 'multi-select_field is-empty';
		field.tabIndex = 0;
		field.textContent = 'Haz una selección';
		optionsList.className = 'multi-select_options';

		$options.each(function() {
			// if option is empty don't include it in the multi-select list
			if (!this.textContent) return;

			var o = that.createMultiSelectOption(this.textContent, fieldName);
			optionsList.appendChild(o);
		});

		multiSelect.appendChild(field);
		multiSelect.appendChild(optionsList);

		// replace regular dropdown with multi-select dropdown
		$(multiSelect).insertBefore(this.$select);
		this.$select.remove();
        this.$select = null;

		// cache multiSelect selectors
		this.$outer = $(multiSelect);
		this.$field = this.$outer.find('.multi-select_field');
		this.$optionList = this.$outer.find('.multi-select_options');
		this.$options = this.$outer.find('.multi-select_option');

		// attach multiSelect event handlers
		this.attachClickEvents(this);
		this.attachKeyboardEvents(this);
	}

}

// selectToMultiSelect plugin definition
$.fn.selectToMultiSelect = function(settings) {
	var m = new MultiSelect($(this));
	m.init();
}

// Initialize the plugin on the element with class "js-multi-select"
$('.js-multi-select').selectToMultiSelect();



