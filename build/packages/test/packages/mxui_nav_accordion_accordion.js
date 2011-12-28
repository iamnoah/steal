steal.loading('jquery/lang/vector/vector.js','jquery/event/livehack/livehack.js','jquery/event/drag/drag.js','mxui/nav/accordion/accordion.js');
steal('jquery').then(function($){
	var getSetZero = function(v){ return v !== undefined ? (this.array[0] = v) : this.array[0] },
		getSetOne = function(v){ return v !== undefined ? (this.array[1] = v) : this.array[1] }
/**
 * @class jQuery.Vector
 * @parent jquerymx.lang
 * A vector class
 * @constructor creates a new vector instance from the arguments.  Example:
 * @codestart
 * new jQuery.Vector(1,2)
 * @codeend
 * 
 */
	$.Vector = function() {
		this.update($.makeArray(arguments));
	};
	$.Vector.prototype =
	/* @Prototype*/
	{
		/**
		 * Applys the function to every item in the vector.  Returns the new vector.
		 * @param {Function} f
		 * @return {jQuery.Vector} new vector class.
		 */
		app: function( f ) {
			var i, vec, newArr = [];

			for ( i = 0; i < this.array.length; i++ ) {
				newArr.push(f(this.array[i]));
			}
			vec = new $.Vector();
			return vec.update(newArr);
		},
		/**
		 * Adds two vectors together.  Example:
		 * @codestart
		 * new Vector(1,2).plus(2,3) //-> &lt;3,5>
		 * new Vector(3,5).plus(new Vector(4,5)) //-> &lt;7,10>
		 * @codeend
		 * @return {$.Vector}
		 */
		plus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) + args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Like plus but subtracts 2 vectors
		 * @return {jQuery.Vector}
		 */
		minus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) - args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Returns the current vector if it is equal to the vector passed in.  
		 * False if otherwise.
		 * @return {jQuery.Vector}
		 */
		equals: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				if ( arr[i] != args[i] ) {
					return null;
				}
			}
			return vec.update(arr);
		},
		/**
		 * Returns the first value of the vector
		 * @return {Number}
		 */
		x: getSetZero,
		/**
		 * same as x()
		 * @return {Number}
		 */
		left: getSetZero,
		/**
		 * Returns the first value of the vector
		 * @return {Number}
		 */
		width: getSetZero,
		/**
		 * Returns the 2nd value of the vector
		 * @return {Number}
		 */
		y: getSetOne,
		/**
		 * Same as y()
		 * @return {Number}
		 */
		top: getSetOne,
		/**
		 * Returns the 2nd value of the vector
		 * @return {Number}
		 */
		height: getSetOne,
		/**
		 * returns (x,y)
		 * @return {String}
		 */
		toString: function() {
			return "(" + this.array[0] + "," + this.array[1] + ")";
		},
		/**
		 * Replaces the vectors contents
		 * @param {Object} array
		 */
		update: function( array ) {
			var i;
			if ( this.array ) {
				for ( i = 0; i < this.array.length; i++ ) {
					delete this.array[i];
				}
			}
			this.array = array;
			for ( i = 0; i < array.length; i++ ) {
				this[i] = this.array[i];
			}
			return this;
		}
	};

	$.Event.prototype.vector = function() {
		if ( this.originalEvent.synthetic ) {
			var doc = document.documentElement,
				body = document.body;
			return new $.Vector(this.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0), this.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0));
		} else {
			return new $.Vector(this.pageX, this.pageY);
		}
	};

	$.fn.offsetv = function() {
		if ( this[0] == window ) {
			return new $.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft, window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop);
		} else {
			var offset = this.offset();
			return new $.Vector(offset.left, offset.top);
		}
	};

	$.fn.dimensionsv = function( which ) {
		if ( this[0] == window || !which ) {
			return new $.Vector(this.width(), this.height());
		}
		else {
			return new $.Vector(this[which + "Width"](), this[which + "Height"]());
		}
	};
});
;
steal.loaded('jquery/lang/vector/vector.js');
steal('jquery/event').then(function() {

	var event = jQuery.event,

		//helper that finds handlers by type and calls back a function, this is basically handle
		// events - the events object
		// types - an array of event types to look for
		// callback(type, handlerFunc, selector) - a callback
		// selector - an optional selector to filter with, if there, matches by selector
		//     if null, matches anything, otherwise, matches with no selector
		findHelper = function( events, types, callback, selector ) {
			var t, type, typeHandlers, all, h, handle, 
				namespaces, namespace,
				match;
			for ( t = 0; t < types.length; t++ ) {
				type = types[t];
				all = type.indexOf(".") < 0;
				if (!all ) {
					namespaces = type.split(".");
					type = namespaces.shift();
					namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
				}
				typeHandlers = (events[type] || []).slice(0);

				for ( h = 0; h < typeHandlers.length; h++ ) {
					handle = typeHandlers[h];
					
					match = (all || namespace.test(handle.namespace));
					
					if(match){
						if(selector){
							if (handle.selector === selector  ) {
								callback(type, handle.origHandler || handle.handler);
							}
						} else if (selector === null){
							callback(type, handle.origHandler || handle.handler, handle.selector);
						}
						else if (!handle.selector ) {
							callback(type, handle.origHandler || handle.handler);
							
						} 
					}
					
					
				}
			}
		};

	/**
	 * Finds event handlers of a given type on an element.
	 * @param {HTMLElement} el
	 * @param {Array} types an array of event names
	 * @param {String} [selector] optional selector
	 * @return {Array} an array of event handlers
	 */
	event.find = function( el, types, selector ) {
		var events = ( $._data(el) || {} ).events,
			handlers = [],
			t, liver, live;

		if (!events ) {
			return handlers;
		}
		findHelper(events, types, function( type, handler ) {
			handlers.push(handler);
		}, selector);
		return handlers;
	};
	/**
	 * Finds all events.  Group by selector.
	 * @param {HTMLElement} el the element
	 * @param {Array} types event types
	 */
	event.findBySelector = function( el, types ) {
		var events = $._data(el).events,
			selectors = {},
			//adds a handler for a given selector and event
			add = function( selector, event, handler ) {
				var select = selectors[selector] || (selectors[selector] = {}),
					events = select[event] || (select[event] = []);
				events.push(handler);
			};

		if (!events ) {
			return selectors;
		}
		//first check live:
		/*$.each(events.live || [], function( i, live ) {
			if ( $.inArray(live.origType, types) !== -1 ) {
				add(live.selector, live.origType, live.origHandler || live.handler);
			}
		});*/
		//then check straight binds
		findHelper(events, types, function( type, handler, selector ) {
			add(selector || "", type, handler);
		}, null);

		return selectors;
	};
	event.supportTouch = "ontouchend" in document;
	
	$.fn.respondsTo = function( events ) {
		if (!this.length ) {
			return false;
		} else {
			//add default ?
			return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
		}
	};
	$.fn.triggerHandled = function( event, data ) {
		event = (typeof event == "string" ? $.Event(event) : event);
		this.trigger(event, data);
		return event.handled;
	};
	/**
	 * Only attaches one event handler for all types ...
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call 
	 */
	event.setupHelper = function( types, startingEvent, onFirst ) {
		if (!onFirst ) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function( handleObj ) {

			var bySelector, selector = handleObj.selector || "";
			if ( selector ) {
				bySelector = event.find(this, types, selector);
				if (!bySelector.length ) {
					$(this).delegate(selector, startingEvent, onFirst);
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				if (!event.find(this, types, selector).length ) {
					event.add(this, startingEvent, onFirst, {
						selector: selector,
						delegate: this
					});
				}

			}

		},
			remove = function( handleObj ) {
				var bySelector, selector = handleObj.selector || "";
				if ( selector ) {
					bySelector = event.find(this, types, selector);
					if (!bySelector.length ) {
						$(this).undelegate(selector, startingEvent, onFirst);
					}
				}
				else {
					if (!event.find(this, types, selector).length ) {
						event.remove(this, startingEvent, onFirst, {
							selector: selector,
							delegate: this
						});
					}
				}
			};
		$.each(types, function() {
			event.special[this] = {
				add: add,
				remove: remove,
				setup: function() {},
				teardown: function() {}
			};
		});
	};
});;
steal.loaded('jquery/event/livehack/livehack.js');
steal('jquery/event', 'jquery/lang/vector', 'jquery/event/livehack',function( $ ) {
	//modify live
	//steal the live handler ....
	var bind = function( object, method ) {
		var args = Array.prototype.slice.call(arguments, 2);
		return function() {
			var args2 = [this].concat(args, $.makeArray(arguments));
			return method.apply(object, args2);
		};
	},
		event = $.event,
		clearSelection = window.getSelection ? function(){
				window.getSelection().removeAllRanges()
			} : function(){};
	// var handle = event.handle; //unused
	/**
	 * @class jQuery.Drag
	 * @parent specialevents
	 * @plugin jquery/event/drag
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drag/drag.js
	 * @test jquery/event/drag/qunit.html
	 * Provides drag events as a special events to jQuery.  
	 * A jQuery.Drag instance is created on a drag and passed
	 * as a parameter to the drag event callbacks.  By calling
	 * methods on the drag event, you can alter the drag's
	 * behavior.
	 * ## Drag Events
	 * 
	 * The drag plugin allows you to listen to the following events:
	 * 
	 * <ul>
	 *  <li><code>dragdown</code> - the mouse cursor is pressed down</li>
	 *  <li><code>draginit</code> - the drag motion is started</li>
	 *  <li><code>dragmove</code> - the drag is moved</li>
	 *  <li><code>dragend</code> - the drag has ended</li>
	 *  <li><code>dragover</code> - the drag is over a drop point</li>
	 *  <li><code>dragout</code> - the drag moved out of a drop point</li>
	 * </ul>
	 * 
	 * Just by binding or delegating on one of these events, you make
	 * the element dragable.  You can change the behavior of the drag
	 * by calling methods on the drag object passed to the callback.
	 * 
	 * ### Example
	 * 
	 * Here's a quick example:
	 * 
	 *     //makes the drag vertical
	 *     $(".drags").delegate("draginit", function(event, drag){
	 *       drag.vertical();
	 *     })
	 *     //gets the position of the drag and uses that to set the width
	 *     //of an element
	 *     $(".resize").delegate("dragmove",function(event, drag){
	 *       $(this).width(drag.position.left() - $(this).offset().left   )
	 *     })
	 * 
	 * ## Drag Object
	 * 
	 * <p>The drag object is passed after the event to drag 
	 * event callback functions.  By calling methods
	 * and changing the properties of the drag object,
	 * you can alter how the drag behaves.
	 * </p>
	 * <p>The drag properties and methods:</p>
	 * <ul>
	 *  <li><code>[jQuery.Drag.prototype.cancel cancel]</code> - stops the drag motion from happening</li>
	 *  <li><code>[jQuery.Drag.prototype.ghost ghost]</code> - copys the draggable and drags the cloned element</li>
	 *  <li><code>[jQuery.Drag.prototype.horizontal horizontal]</code> - limits the scroll to horizontal movement</li>
	 *  <li><code>[jQuery.Drag.prototype.location location]</code> - where the drag should be on the screen</li>
	 *  <li><code>[jQuery.Drag.prototype.mouseElementPosition mouseElementPosition]</code> - where the mouse should be on the drag</li>
	 *  <li><code>[jQuery.Drag.prototype.only only]</code> - only have drags, no drops</li>
	 *  <li><code>[jQuery.Drag.prototype.representative representative]</code> - move another element in place of this element</li>
	 *  <li><code>[jQuery.Drag.prototype.revert revert]</code> - animate the drag back to its position</li>
	 *  <li><code>[jQuery.Drag.prototype.vertical vertical]</code> - limit the drag to vertical movement</li>
	 *  <li><code>[jQuery.Drag.prototype.limit limit]</code> - limit the drag within an element (*limit plugin)</li>
	 *  <li><code>[jQuery.Drag.prototype.scrolls scrolls]</code> - scroll scrollable areas when dragging near their boundries (*scroll plugin)</li>
	 * </ul>
	 * <h2>Demo</h2>
	 * Now lets see some examples:
	 * @demo jquery/event/drag/drag.html 1000
	 * @constructor
	 * The constructor is never called directly.
	 */
	$.Drag = function() {};

	/**
	 * @Static
	 */
	$.extend($.Drag, {
		lowerName: "drag",
		current: null,
		distance: 0,
		/**
		 * Called when someone mouses down on a draggable object.
		 * Gathers all callback functions and creates a new Draggable.
		 * @hide
		 */
		mousedown: function( ev, element ) {
			var isLeftButton = ev.button === 0 || ev.button == 1;
			if (!isLeftButton || this.current ) {
				return;
			} //only allows 1 drag at a time, but in future could allow more
			//ev.preventDefault();
			//create Drag
			var drag = new $.Drag(),
				delegate = ev.delegateTarget || element,
				selector = ev.handleObj.selector,
				self = this;
			this.current = drag;

			drag.setup({
				element: element,
				delegate: ev.delegateTarget || element,
				selector: ev.handleObj.selector,
				moved: false,
				_distance: this.distance,
				callbacks: {
					dragdown: event.find(delegate, ["dragdown"], selector),
					draginit: event.find(delegate, ["draginit"], selector),
					dragover: event.find(delegate, ["dragover"], selector),
					dragmove: event.find(delegate, ["dragmove"], selector),
					dragout: event.find(delegate, ["dragout"], selector),
					dragend: event.find(delegate, ["dragend"], selector)
				},
				destroyed: function() {
					self.current = null;
				}
			}, ev);
		}
	});
	
	/**
	 * @Prototype
	 */
	$.extend($.Drag.prototype, {
		setup: function( options, ev ) {
			$.extend(this, options);
			this.element = $(this.element);
			this.event = ev;
			this.moved = false;
			this.allowOtherDrags = false;
			var mousemove = bind(this, this.mousemove),
				mouseup = bind(this, this.mouseup);
			this._mousemove = mousemove;
			this._mouseup = mouseup;
			this._distance = options.distance ? options.distance : 0;
			
			this.mouseStartPosition = ev.vector(); //where the mouse is located
			
			$(document).bind('mousemove', mousemove);
			$(document).bind('mouseup', mouseup);

			if (!this.callEvents('down', this.element, ev) ) {
			    this.noSelection(this.delegate);
				//this is for firefox
				clearSelection();
			}
		},
		/**
		 * Unbinds listeners and allows other drags ...
		 * @hide
		 */
		destroy: function() {
			$(document).unbind('mousemove', this._mousemove);
			$(document).unbind('mouseup', this._mouseup);
			if (!this.moved ) {
				this.event = this.element = null;
			}

            this.selection(this.delegate);
			this.destroyed();
		},
		mousemove: function( docEl, ev ) {
			if (!this.moved ) {
				var dist = Math.sqrt( Math.pow( ev.pageX - this.event.pageX, 2 ) + Math.pow( ev.pageY - this.event.pageY, 2 ));
				if(dist < this._distance){
					return false;
				}
				
				this.init(this.element, ev);
				this.moved = true;
			}

			var pointer = ev.vector();
			if ( this._start_position && this._start_position.equals(pointer) ) {
				return;
			}
			//e.preventDefault();
			this.draw(pointer, ev);
		},
		
		mouseup: function( docEl, event ) {
			//if there is a current, we should call its dragstop
			if ( this.moved ) {
				this.end(event);
			}
			this.destroy();
		},

        /**
         * noSelection method turns off text selection during a drag event.
         * This method is called by default unless a event is listening to the 'dragdown' event.
         *
         *  ## Example
         *
         *      $('div.drag').bind('dragdown', function(elm,event,drag){
         *          drag.noSelection();
         *      });
         *      
         * @param [elm] an element to prevent selection on.  Defaults to the dragable element.
         */
		noSelection: function(elm) {
            elm = elm || this.delegate
            
			document.documentElement.onselectstart = function() {
				return false;
			};
			document.documentElement.unselectable = "on";
			this.selectionDisabled = (this.selectionDisabled ? this.selectionDisabled.add(elm) : $(elm));
			this.selectionDisabled.css('-moz-user-select', '-moz-none');
		},

        /**
         * selection method turns on text selection that was previously turned off during the drag event.
         * This method is called by default in 'destroy' unless a event is listening to the 'dragdown' event.
         * 
         *  ## Example
         *
         *      $('div.drag').bind('dragdown', function(elm,event,drag){
         *          drag.noSelection();
         *      });
         */
		selection: function(elm) {
            if(this.selectionDisabled){
                document.documentElement.onselectstart = function() {};
                document.documentElement.unselectable = "off";
                this.selectionDisabled.css('-moz-user-select', '');
            }
		},

		init: function( element, event ) {
			element = $(element);
			var startElement = (this.movingElement = (this.element = $(element))); //the element that has been clicked on
			//if a mousemove has come after the click
			this._cancelled = false; //if the drag has been cancelled
			this.event = event;
			
			/**
			 * @attribute mouseElementPosition
			 * The position of start of the cursor on the element
			 */
			this.mouseElementPosition = this.mouseStartPosition.minus(this.element.offsetv()); //where the mouse is on the Element
			//this.callStart(element, event);
			this.callEvents('init', element, event);

			//Check what they have set and respond accordingly
			//  if they canceled
			if ( this._cancelled === true ) {
				return;
			}
			//if they set something else as the element
			this.startPosition = startElement != this.movingElement ? this.movingElement.offsetv() : this.currentDelta();

			this.makePositioned(this.movingElement);
			this.oldZIndex = this.movingElement.css('zIndex');
			this.movingElement.css('zIndex', 1000);
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.compile(event, this);
			}
		},
		makePositioned: function( that ) {
			var style, pos = that.css('position');

			if (!pos || pos == 'static' ) {
				style = {
					position: 'relative'
				};

				if ( window.opera ) {
					style.top = '0px';
					style.left = '0px';
				}
				that.css(style);
			}
		},
		callEvents: function( type, element, event, drop ) {
			var i, cbs = this.callbacks[this.constructor.lowerName + type];
			for ( i = 0; i < cbs.length; i++ ) {
				cbs[i].call(element, event, this, drop);
			}
			return cbs.length;
		},
		/**
		 * Returns the position of the movingElement by taking its top and left.
		 * @hide
		 * @return {Vector}
		 */
		currentDelta: function() {
			return new $.Vector(parseInt(this.movingElement.css('left'), 10) || 0, parseInt(this.movingElement.css('top'), 10) || 0);
		},
		//draws the position of the dragmove object
		draw: function( pointer, event ) {
			// only drag if we haven't been cancelled;
			if ( this._cancelled ) {
				return;
			}
			clearSelection();
			/**
			 * @attribute location
			 * The location of where the element should be in the page.  This 
			 * takes into account the start position of the cursor on the element.
			 * 
			 * If the drag is going to be moved to an unacceptable location, you can call preventDefault in
			 * dragmove to prevent it from being moved there.
			 * 
			 *     $('.mover').bind("dragmove", function(ev, drag){
			 *       if(drag.location.top() < 100){
			 *         ev.preventDefault()
			 *       }
			 *     });
			 *     
			 * You can also set the location to where it should be on the page.
			 */
			this.location = pointer.minus(this.mouseElementPosition); // the offset between the mouse pointer and the representative that the user asked for
			// position = mouse - (dragOffset - dragTopLeft) - mousePosition
			
			// call move events
			this.move(event);
			if ( this._cancelled ) {
				return;
			}
			if (!event.isDefaultPrevented() ) {
				this.position(this.location);
			}

			//fill in
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.show(pointer, this, event);
			}
		},
		/**
		 * Sets the position of this drag.  
		 * 
		 * The limit and scroll plugins
		 * overwrite this to make sure the drag follows a particular path.
		 * 
		 * @param {jQuery.Vector} newOffsetv the position of the element (not the mouse)
		 */
		position: function( newOffsetv ) { //should draw it on the page
			var style, dragged_element_css_offset = this.currentDelta(),
				//  the drag element's current left + top css attributes
				dragged_element_position_vector = // the vector between the movingElement's page and css positions
				this.movingElement.offsetv().minus(dragged_element_css_offset); // this can be thought of as the original offset
			this.required_css_position = newOffsetv.minus(dragged_element_position_vector);

			this.offsetv = newOffsetv;
			//dragged_element vector can probably be cached.
			style = this.movingElement[0].style;
			if (!this._cancelled && !this._horizontal ) {
				style.top = this.required_css_position.top() + "px";
			}
			if (!this._cancelled && !this._vertical ) {
				style.left = this.required_css_position.left() + "px";
			}
		},
		move: function( event ) {
			this.callEvents('move', this.element, event);
		},
		over: function( event, drop ) {
			this.callEvents('over', this.element, event, drop);
		},
		out: function( event, drop ) {
			this.callEvents('out', this.element, event, drop);
		},
		/**
		 * Called on drag up
		 * @hide
		 * @param {Event} event a mouseup event signalling drag/drop has completed
		 */
		end: function( event ) {
			if ( this._cancelled ) {
				return;
			}
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.end(event, this);
			}

			this.callEvents('end', this.element, event);

			if ( this._revert ) {
				var self = this;
				this.movingElement.animate({
					top: this.startPosition.top() + "px",
					left: this.startPosition.left() + "px"
				}, function() {
					self.cleanup.apply(self, arguments);
				});
			}
			else {
				this.cleanup();
			}
			this.event = null;
		},
		/**
		 * Cleans up drag element after drag drop.
		 * @hide
		 */
		cleanup: function() {
			this.movingElement.css({
				zIndex: this.oldZIndex
			});
			if ( this.movingElement[0] !== this.element[0] && 
				!this.movingElement.has(this.element[0]).length && 
				!this.element.has(this.movingElement[0]).length ) {
				this.movingElement.css({
					display: 'none'
				});
			}
			if ( this._removeMovingElement ) {
				this.movingElement.remove();
			}

			this.movingElement = this.element = this.event = null;
		},
		/**
		 * Stops drag drop from running.
		 */
		cancel: function() {
			this._cancelled = true;
			//this.end(this.event);
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.clear(this.event.vector(), this, this.event);
			}
			this.destroy();

		},
		/**
		 * Clones the element and uses it as the moving element.
		 * @return {jQuery.fn} the ghost
		 */
		ghost: function( loc ) {
			// create a ghost by cloning the source element and attach the clone to the dom after the source element
			var ghost = this.movingElement.clone().css('position', 'absolute');
			(loc ? $(loc) : this.movingElement).after(ghost);
			ghost.width(this.movingElement.width()).height(this.movingElement.height());
			// put the ghost in the right location ...
			ghost.offset(this.movingElement.offset())
			
			// store the original element and make the ghost the dragged element
			this.movingElement = ghost;
			this.noSelection(ghost)
			this._removeMovingElement = true;
			return ghost;
		},
		/**
		 * Use a representative element, instead of the movingElement.
		 * @param {HTMLElement} element the element you want to actually drag
		 * @param {Number} offsetX the x position where you want your mouse on the object
		 * @param {Number} offsetY the y position where you want your mouse on the object
		 */
		representative: function( element, offsetX, offsetY ) {
			this._offsetX = offsetX || 0;
			this._offsetY = offsetY || 0;

			var p = this.mouseStartPosition;

			this.movingElement = $(element);
			this.movingElement.css({
				top: (p.y() - this._offsetY) + "px",
				left: (p.x() - this._offsetX) + "px",
				display: 'block',
				position: 'absolute'
			}).show();
			this.noSelection(this.movingElement)
			this.mouseElementPosition = new $.Vector(this._offsetX, this._offsetY);
		},
		/**
		 * Makes the movingElement go back to its original position after drop.
		 * @codestart
		 * ".handle dragend" : function( el, ev, drag ) {
		 *    drag.revert()
		 * }
		 * @codeend
		 * @param {Boolean} [val] optional, set to false if you don't want to revert.
		 */
		revert: function( val ) {
			this._revert = val === undefined ? true : val;
			return this;
		},
		/**
		 * Isolates the drag to vertical movement.
		 */
		vertical: function() {
			this._vertical = true;
			return this;
		},
		/**
		 * Isolates the drag to horizontal movement.
		 */
		horizontal: function() {
			this._horizontal = true;
			return true;
		},
		/**
		 * Respondables will not be alerted to this drag.
		 */
		only: function( only ) {
			return (this._only = (only === undefined ? true : only));
		},
		
		/**
		 * Sets the distance from the mouse before the item begins dragging.
		 * @param {Number} val
		 */
		distance:function(val){
			if(val !== undefined){
				this._distance = val;
				return this;
			}else{
				return this._distance
			}
		}
	});

	/**
	 * @add jQuery.event.special
	 */
	event.setupHelper([
	/**
	 * @attribute dragdown
	 * <p>Listens for when a drag movement has started on a mousedown.
	 * If you listen to this, the mousedown's default event (preventing
	 * text selection) is not prevented.  You are responsible for calling it
	 * if you want it (you probably do).  </p>
	 * <p><b>Why might you not want it?</b></p>
	 * <p>You might want it if you want to allow text selection on element
	 * within the drag element.  Typically these are input elements.</p>
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 * @codestart
	 * $(".handles").delegate("dragdown", function(ev, drag){})
	 * @codeend
	 */
	'dragdown',
	/**
	 * @attribute draginit
	 * Called when the drag starts.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'draginit',
	/**
	 * @attribute dragover
	 * Called when the drag is over a drop.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragover',
	/**
	 * @attribute dragmove
	 * Called when the drag is moved.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragmove',
	/**
	 * @attribute dragout
	 * When the drag leaves a drop point.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragout',
	/**
	 * @attribute dragend
	 * Called when the drag is done.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragend'], "mousedown", function( e ) {
		$.Drag.mousedown.call($.Drag, e, this);

	});
});
;
steal.loaded('jquery/event/drag/drag.js');
/**
 * @class Mxui.Nav.Accordion
 */
steal('jquery/controller',
	  'jquery/dom/dimensions',
	  'jquery/event/drag',
	  'jquery/event/resize',
	  function($){

// Future Improvements:
//  - Make work with selectable (after it can use tab).
//  - clickToActivate should check if selectable is on, then use it.
/**
 * @class Mxui.Nav.Accordion
 * @parent Mxui
 * @test mxui/nav/accordion/funcunit.html
 * 
 * Provides basic accordion vertical accordion functionality.
 * 
 * ## Basic Example
 * 
 * If you have the following html:
 * 
 *     <div id='accordion'>
 *       <h3>Baked Goods</h3>
 *       <ul> <li>Cookies</li> ... </ul>
 *       
 *       <h3>Americana</h3>
 *       <ul> <li>Hot Dog</li> ... </ul>
 *       
 *       <h3>Other</h3>
 *       <div>I like Italian ...</div>
 *     </div>
 * 
 * The following will make the list sortable:
 * 
 *     $('#accordion').mxui_nav_accordion()
 * 
 * ## Demo
 * 
 * @demo mxui/nav/accordion/demo.html
 * 
 * ## Events
 * 
 * The accordion trigger 'show' events on content elements when shown.
 * 
 * ## HTML Considerations
 * 
 * The html should alternate between `title` and content 
 * elements.  By default, title elements are `h3` elements and
 * content elements are any other element.
 * 
 * It does support a `title` element followed by another `title` element,
 * but does not support a content element followed by another content element.
 * 
 * ## CSS Considerations
 * 
 * By default, accordion uses Themeroller styles. For content elements, you
 * typically want to add 'overflow:auto' to allow scrolling.
 * 
 * @constructor
 * 
 * @param {HTMLElement} element the element to add the accordion to.
 * @param {Object} options name-value pairs to configure
 * the accordion.  The available options are:
 * 
 *   - title ("h3") - the title element selector
 *   - duration ("fast") - how fast to animate
 *   - activeClassName ("ui-state-active") - the className to add
 *     to the opened title
 *   - hoverClassName ("ui-state-hover") - the className to add on
 *     hovering a title
 *   - activateFirstByDefault (true) - activate the first title
 *   - clickToActivate (true) - use click to activate
 */
$.Controller("Mxui.Nav.Accordion",{
	defaults : {
		title : "h3",
		duration : "fast",
		activeClassName: "ui-state-active",
		hoverClassName: "ui-state-hover",
		activateFirstByDefault: true,
		clickToActivate: true
	},
	listensTo : ["insert","resize"]
},
/**
 * @prototype
 */
{
	init : function()
	{
		// Initially add Title classes for title and hide the content.
		var title = this.options.title,
			children = this.element.children().each(function(){
				var el = $(this);
				if(!el.is(title)){
					el.hide();
				}else{
					el.addClass('ui-helper-reset ui-state-default');
				}
			});
			
		// Select first content element, since children.eq(0) is title, and trigger show and resize height.
		if(this.options.activateFirstByDefault){
			this.activate(children.eq(0));
		}
		
		//- Fixes problems with scrollbars when expanding/collasping elements
		this.element.css('overflow', 'hidden');
	},
	currentContent : function(){
		return this.element.children(':visible').not(this.options.title)
	},
	/**
	 * @hide
	 * Draws the current in the right spot. Triggered 
	 * initially or when resized.
	 * @param {jQuery} [children] - cached children (for performance)
	 */
	setHeight : function(children)
	{
		// Get only titles pre-defined in defaults either from param or current class object.
		var titles = (children || this.element.children() ).filter(this.options.title);
		
		// Initial proposed height for current content area.
		var ul_height = 0,
			content = this.currentContent();
		
		// Set current div height to match parent first.
		//this.element.height($(this.element).parent().height());
		
		// Make sure current height is not fixed to prevent double scroll bar.
		content.height('');
		
		// Calculate the allowed height after subtracting all titles height if not using scrollbar.
		if(titles && titles.length > 0){
			ul_height = this.calculateRemainder(titles);
		}
		// Minimum height for ul area to be 50, if allowed height more than 50, use the allowed height to push remaing titles to the bottom.
		if(ul_height > 50){
			content.outerHeight(ul_height);
		}
	},
	
	/**
	 * Expands the content for the `title` element
	 * without animating.
	 * 
	 *     $('#accordion').mxui_nav_accordion(
	 *       'activate',
	 *       $('#accordion ul:eq(3)')
	 *     )
	 * 
	 * 
	 * @param {jQuery} title the jQuery wrapped title element
	 * @param {Array} [args] optional aditional arguments to pass to show event.
	 */
	activate:function(title, args)
	{
		var next = title.next();
		
		this.current = title;
		if( !next.is(this.options.title) ) {
			next.triggerHandler("show", args)
			next.show();
		}
		
		title.addClass(this.options.activeClassName);
		this.setHeight();
	},
	
	// Occurs when title was clicked.
	"{title} click" : function(elm, event)
	{		
		if(this.options.clickToActivate){
			this.expand.apply(this, arguments);
		}
	},
	
	//  Activate was triggered.  Doing this to standardized the app's event system.
	"{title} activate":function()
	{
		this.expand.apply(this, arguments);
	},
	
	/**
	 * Expand and animate the content of the title that was clicked.
	 * 
	 *     $('#accordion').mxui_nav_accordion(
	 *       'expand',
	 *       $('#accordion ul:eq(3)')
	 *     )
	 * 
	 * 
	 * @param {jQuery} title the jQuery-wrapped title element.
	 */
	expand : function(title)
	{
		var next = title.next();
		// If we don't have one selected by default
		if(!this.current || next.is(this.options.title) ) {
			
			this.current && this.current
				.removeClass(this.options.activeClassName);
			
			this.activate(title, arguments);
			return;
		}
		
		// If proposed content for expansion is already expanded, no need to recalculate.
		if( title[0] === this.current[0] ){
			title.addClass(this.options.activeClassName);
			return;
		}
		
		//we need to 'knock out' the top border / margin / etc proportinally ...
		var newHeight = this.calculateRemainder(null, title),
			oldContent = this.element.children(':visible').not(this.options.title),
			newContent = title.next().show().height(0).trigger("show", arguments),
			oldH3 = this.current;
			
		//- toggle the classes
		newContent.find('.activated').removeClass('activated selected');
		oldH3.removeClass(this.options.activeClassName);
		title.addClass(this.options.activeClassName);
		
		// turn off scrolling ...
		var oldOverflow = oldContent[0].style.overflow,
			newOverflow = newContent[0].style.overflow;
		
		oldContent.css('overflow',"hidden");
		newContent.css('overflow',"hidden");
		
		// Animation closing the existing expanded content and removed class for title, then expand the new one.
		oldContent.stop(true, true).animate({outerHeight: "0px"},{
			complete : function(){
				$(this).hide();
				newContent.outerHeight(newHeight);
				oldContent.css('overflow',oldOverflow);
				newContent.css('overflow',newOverflow);
			},
			step : function(val, ani){
				//- the height will be 0 if there is more accoridans that height available, 
				//- then we just want to do a auto height.
				if(newHeight <= 0){
					newContent.css('height', 'auto')
				} else {
					newContent.outerHeight(newHeight*ani.pos);
				}
			},
			duration : this.options.duration
		});
		
		this.current = title;
	},
	
	/**
	 * @hide
	 * Calculate the allowed height left after subtracting height from all the titles.
	 * @param {Object} titles - title elements
	 * @param {Object} el resizing - element we are going to resize
	 * @return {Number} the size
	 */
	calculateRemainder : function(titles, el)
	{
		var total = this.element.height(),
			options = this.options;
			
		//- find the available space minus the accordian headers.
		(titles || this.element.children(this.options.title) )
				.each(function(){
					total -= $(this).outerHeight(true);
				});
		return total;
	},
	
	/**
	 * Occurs when resize was triggered.
	 * Call when an insert or DOM modification happens.
	 */
	resize : function()
	{
		clearTimeout(this._resizeTimeout);
		var self = this;
		this._resizeTimeout = setTimeout(function(){
			self.setHeight();
		}, 10);
	},
	
	// Call when an insert or dom modification happens
	insert : function()
	{
		this.setHeight();
	},
	
	// Remove hover class on mouse out event.
	"{title} mouseleave" : function(el)
	{
		el.removeClass(this.options.hoverClassName);
	},
	
	// Add hover class on mouse in event.
	"{title} mouseenter" : function(el)
	{
		el.addClass(this.options.hoverClassName);
	},
	
	// Occurs when an item was dropped over a title.
	"{title} dropover" : function(el)
	{
		this._timer = setTimeout(this.callback('titleOver', el),200);
	},
	
	// Occurs when an item was dropped out.
	"{title} dropout" : function(el)
	{
		clearTimeout(this._timer);
	}
});

});;
steal.loaded('mxui/nav/accordion/accordion.js')
