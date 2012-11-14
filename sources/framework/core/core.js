/**
 * @class Oskari.mapframework.core.Core
 * 
 * This is the Oskari core. Bundles can register modules and services here for other bundles to reference.
 * Requests and events are forwarded through the core to handlers.
 * TODO: Move handlers (and events as well as requests) to handler bundles with
 * registrable handlers
 */
Oskari.clazz.define('Oskari.mapframework.core.Core',

/**
 * @method create called automatically on construction
 * @static
 */
function() {

    // Currently selected layers, array of MapLayer objects
    this._selectedLayers = new Array();

    // Currently Highlighted maplayers
    this._mapLayersHighlighted = new Array();

    // map domain object
    this._map

    // Sandbox that handles communication
    this._sandbox = Oskari.clazz.create('Oskari.mapframework.sandbox.Sandbox', this);
    Oskari.$("sandbox", this._sandbox);

    // array of services available
    this._services = [];
    this._servicesByQName = {};

    // Are we currently printing debug (as of 2012-09-24 debug by default false)
    this._debug = false;

    // whether to sniff usage or not
    this._doSniffing = false;

    // is Ctrl key down
    this._ctrlKeyDown = false;

    // Allow multiple highlight layers
    this._allowMultipleHighlightLayers = false;

    /*
     * If published map is started using id in url, it is stored
     * here. Later it is used in sniffer.
     */
    this._mapIdFromUrl;

    this._availableRequestsByName = {};
    this._availableEventsByName = {};
},
{

    /**
     * @method init
     * Inits Oskari core so bundles can reference components/services through sandbox
     *
     * @param {Oskari.mapframework.service.Service[]} services
     *            array of services that are available
     * @param {Oskari.mapframework.enhancement.Enhancement[]} enhancements
     *            array of enhancements that should be executed before starting map
     */
    init : function(services, enhancements) {
        this.printDebug("Initializing core...");

        var sandbox = this._sandbox;

        // Store variables for later use
        this._services = services;
        // Register services
        if (services) {
            for (var s = 0; s < services.length; s++) {
                this.registerService(services[s]);
            }
        }

        // build up domain
        this.printDebug("Sandbox ready, building up domain...");
        this._map = Oskari.clazz.create('Oskari.mapframework.domain.Map');

        // run all enhancements
        this.enhancements = enhancements;
        var me = this;
        me._start();
    },
    /**
     * @method start
     * Starts the core and runs all registered enhancements. This is called by init.
     * @private
     */
    _start : function() {

        this.doEnhancements(this.enhancements);

        // Check for network sniffing
        if (this._doSniffing) {
            // Find map id from url and use that later for log requests
            this._mapIdFromUrl = this.getRequestParameter("id");

            this.printDebug("Application configured for sniffing. Starting sniffer.");
            var snifferService = this.getService('Oskari.mapframework.service.UsageSnifferService');
            if (snifferService) {
                snifferService.startSniffing();
            }
        }
        this.printDebug("Modules started. Core ready.");
    },

    /**
     * @method dispatch
     * Dispatches given event to sandbox
     *
     * @param {Oskari.mapframework.event.Event}
     *            event - event to dispatch
     */
    dispatch : function(event) {
        this._sandbox.notifyAll(event);
    },

    /**
     * @property defaultRequestHandlers
     * @static
     * Default Request handlers
     * Core still handles some Requests sent by bundles. 
     * TODO: Request handling should be moved to apropriate bundles.
     * NOTE: only one request handler can be registered/request
     */
    defaultRequestHandlers : {
        'AddMapLayerRequest' : function(request) {
            this.handleAddMapLayerRequest(request);
            return true;
        },
        'ManageFeaturesRequest' : function(request) {
            this.handleManageFeaturesRequest(request);
            return true;
        },
        'RemoveMapLayerRequest' : function(request) {
            this.handleRemoveMapLayerRequest(request);
            return true;
        },
        'SearchRequest' : function(request) {
            this.handleSearchRequest(request);
            return true;
        },
        'ShowMapLayerInfoRequest' : function(request) {
            this.handleShowMapLayerInfoRequest(request);
            return true;
        },
        'RearrangeSelectedMapLayerRequest' : function(request) {
            this.handleRearrangeSelectedMapLayerRequest(request);
            return true;
        },
        'ChangeMapLayerOpacityRequest' : function(request) {
            this.handleChangeMapLayerOpacityRequest(request);
            return true;
        },
        'ChangeMapLayerStyleRequest' : function(request) {
            this.handleChangeMapLayerStyleRequest(request);
            return true;
        },
        'DrawPolygonRequest' : function(request) {
            this.handleDrawPolygonRequest(request);
            return true;
        },
        'DrawSelectedPolygonRequest' : function(request) {
            this.handleDrawSelectedPolygonRequest(request);
            return true;
        },
        'SelectPolygonRequest' : function(request) {
            this.handleSelectPolygonRequest(request);
            return true;
        },
        'ErasePolygonRequest' : function(request) {
            this.handleErasePolygonRequest(request);
            return true;
        },
        'UpdateHiddenValueRequest' : function(request) {
            this.handleUpdateHiddenValueRequest(request);
            return true;
        },
        'DeactivateAllOpenlayersMapControlsButNotMeasureToolsRequest' : function(request) {
            this.handleDeactivateAllOpenlayersMapControlsButNotMeasureToolsRequest(request);
            return true;
        },
        'DeactivateAllOpenlayersMapControlsRequest' : function(request) {
            this.handleDeactivateAllOpenlayersMapControlsRequest(request);
            return true;
        },
        'HighlightMapLayerRequest' : function(request) {
            this.handleHighlightMapLayerRequest(request);
            return true;
        },
        'HighlightWFSFeatureRequest' : function(request) {
            this.handleHighlightWFSFeatureRequest(request);
            return true;
        },
        'RemovePolygonRequest' : function(request) {
            this.handleRemovePolygonRequest(request);
            return true;
        },
        'HideWizardRequest' : function(request) {
            this.handleHideWizardRequest(request);
            return true;
        },
        'ShowWizardRequest' : function(request) {
            this.handleShowWizardRequest(request);
            return true;
        },
        'ShowNetServiceCentreRequest' : function(request) {
            this.handleShowNetServiceCentreRequest(request);
            return true;
        },
        'HideNetServiceCentreRequest' : function(request) {
            this.handleHideNetServiceCentreRequest(request);
            return true;
        },
        'NetServiceCenterRequest' : function(request) {
            this.handleNetServiceCenterRequest(request);
            return true;
        },
        'HideMapMarkerRequest' : function(request) {
            this.handleHideMapMarkerRequest(request);
            return true;
        },
        'UpdateNetServiceCentreRequest' : function(request) {
            this.handleUpdateNetServiceCentreRequest(request);
            return true;
        },
        'ActionStartRequest' : function(request) {
            this.handleActionStartRequest(request);
            return true;
        },
        'ActionReadyRequest' : function(request) {
            this.handleActionReadyRequest(request);
            return true;
        },
        'DimMapLayerRequest' : function(request) {
            this.handleDimMapLayerRequest(request);
            return true;
        },
        'CtrlKeyDownRequest' : function(request) {
            this.handleCtrlKeyDownRequest(request);
            return true;
        },
        'CtrlKeyUpRequest' : function(request) {
            this.handleCtrlKeyUpRequest(request);
            return true;
        },
        '__default' : function(request) {

            this.printWarn("!!!");
            this.printWarn("  There is no handler for");
            this.printWarn("  '" + request.getName() + "'");
            return false;
        }
    },

    /**
     * @method processRequest
     * Forwards requests to corresponding request handlers. 
     * @param {Oskari.mapframework.request.Request} request to forward
     * @return {Boolean} Returns true, if request was handled, false otherwise
     */
    processRequest : function(request) {

        var requestName = request.getName();
        var handlerFunc = this.defaultRequestHandlers[requestName];
        if (handlerFunc) {
            rv = handlerFunc.apply(this, [request]);
        } else {
            var handlerClsInstance = this.externalHandlerCls[requestName];
            if (handlerClsInstance) {
                 // protocol: Oskari.mapframework.core.RequestHandler.handleRequest(core)
                rv = handlerClsInstance.handleRequest(this, request);
            } else {
                handlerFunc = this.defaultRequestHandlers['__default'];
                rv = handlerFunc.apply(this, [request]);
            }

        }
        delete request;

        return rv;
    },

    /**
     * @property externalHandlerCls
     * @static
     * External Request handlers that bundles have registered are stored here
     * NOTE: only one request handler can be registered/request
     */
    externalHandlerCls : {

    },

    /**
     * @method addRequestHandler
     * Registers a request handler for requests with the given name 
     * NOTE: only one request handler can be registered/request
     * @param {String} requestName - name of the request
     * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
     */
    addRequestHandler : function(requestName, handlerClsInstance) {
        this.externalHandlerCls[requestName] = handlerClsInstance;
    },

    /**
     * @method removeRequestHandler
     * Unregisters a request handler for requests with the given name 
     * NOTE: only one request handler can be registered/request
     * @param {String} requestName - name of the request
     * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
     */
    removeRequestHandler : function(requestName, handlerInstance) {
        if (this.externalHandlerCls[requestName] === handlerInstance)
            this.externalHandlerCls[requestName] = null;
    },

    /**
     * @method _getQNameForRequest
     * Maps the request name to the corresponding request class name
     * @param {String} name - name of the request
     * @return {String} request class name matching the given request name
     * @private
     */
    _getQNameForRequest : function(name) {
        var qname = this._availableRequestsByName[name];
        if (!qname) {
            this.printDebug("#!#!# ! Updating request metadata...");
            var allRequests = Oskari.clazz.protocol('Oskari.mapframework.request.Request');
            for (p in allRequests) {
                var pdefsp = allRequests[p];
                var reqname = pdefsp._class.prototype.getName();
                this._availableRequestsByName[reqname] = p;
            }
            this.printDebug("#!#!# ! Finished Updating request metadata...");
            qname = this._availableRequestsByName[name];
        }

        return qname;
    },

    /**
     * @method getRequestBuilder
     * Gets a builder method for the request by request name
     * @param {String} name - name of the request
     * @return {Function} builder method for given request name or undefined if not found
     */
    getRequestBuilder : function(requestName) {
        var qname = this._getQNameForRequest(requestName);
        if (!qname) {
            return undefined;
        }
        return Oskari.clazz.builder(qname);
    },

    /**
     * @method _getQNameForEvent
     * Maps the event name to the corresponding event class name
     * @param {String} name - name of the event
     * @return {String} event class name matching the given event name
     * @private
     */
    _getQNameForEvent : function(name) {
        var qname = this._availableEventsByName[name];
        if (!qname) {
            this.printDebug("#!#!# ! Updating event metadata...");

            var allRequests = Oskari.clazz.protocol('Oskari.mapframework.event.Event');

            for (p in allRequests) {
                var pdefsp = allRequests[p];
                var reqname = pdefsp._class.prototype.getName();
                this._availableEventsByName[reqname] = p;
            }
            this.printDebug("#!#!# ! Finished Updating event metadata...");
            qname = this._availableEventsByName[name];
        }

        return qname;
    },

    /**
     * @method getEventBuilder
     * Gets a builder method for the event by event name
     * @param {String} eventName - name of the event
     * @return {Function} builder method for given event name or undefined if not found
     */
    getEventBuilder : function(eventName) {
        var qname = this._getQNameForEvent(eventName);
        if (!qname) {
            return undefined;
        }
        return Oskari.clazz.builder(qname);
    },

    /**
     * @method disableDebug
     * Disables debug logging
     */
    disableDebug : function() {
        this._debug = false;
    },
    
     /**
     * @method enableDebug
     * Enables debug logging
     */
    enableDebug : function() {
        this._debug = true;
    },

    /**
     * @method enableMapMovementLogging
     * Enables map movement logging
     */
    enableMapMovementLogging : function() {
        this._doSniffing = true;
    },

    /**
     * @method printDebug
     * Prints given text to browser console
     *
     * @param {String} text message
     */
    printDebug : function(text) {
        if (this._debug && window.console != null) {
            if (window.console.debug != null) {
                console.debug(text);
            } else if (window.console.log != null) {
                console.log(text);
            }
        }
    },

    /**
     * Prints given warn text to browser console
     *
     * @param {String} text
     */
    printWarn : function(text) {
        if (window.console != null) {
            console.warn(text);
        }
    },

    /**
     * @method registerService
     * Registers given service to Oskari so bundles can get reference to it from sandbox
     *
     * @param {Oskari.mapframework.service.Service}
     *            service service to register
     */
    registerService : function(service) {
        this._servicesByQName[service.getQName()] = service;
        //this.registerFrameworkComponentToRuntimeEnvironment(service, service.getName());
    },

    /**
     * @method getService
     * Returns a registered service with given name
     *
     * @param {String} name
     * @return {Oskari.mapframework.service.Service}
     *            service or undefined if not found
     */
    getService : function(type) {
        return this._servicesByQName[type];
    },

    /**
     * @method getMap
     * Returns map domain object
     *
     * @return {Oskari.mapframework.domain.Map}
     */
    getMap : function() {
        return this._map;
    },

    /**
     * @method getSandbox
     * Returns reference to sandbox
     *
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this._sandbox;
    },

    /**
     * @method getRequestParameter
     * Returns a request parameter from query string
     * http://javablog.info/2008/04/17/url-request-parameters-using-javascript/
     * @param {String} name - parameter name
     * @return {String} value for the parameter or null if not found
     */
    getRequestParameter : function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1];
        }
    },

    /**
     * @method getObjectName
     * Returns Oskari event/request name from the event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @return {String} name
     */
    getObjectName : function(obj) {
        return obj["__name"];
    },
    /**
     * @method getObjectCreator
     * Returns Oskari event/request creator from the event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @return {String} creator
     */
    getObjectCreator : function(obj) {
        return obj["_creator"];
    },
    /**
     * @method setObjectCreator
     * Sets a creator to Oskari event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @param {String} creator
     */
    setObjectCreator : function(obj, creator) {
        obj["_creator"] = creator;
    },
    /**
     * @method copyObjectCreatorToFrom
     * Copies creator from objFrom to objTo
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objTo
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objFrom
     */
    copyObjectCreatorToFrom : function(objTo, objFrom) {
        objTo["_creator"] = objFrom["_creator"];
    }
});
