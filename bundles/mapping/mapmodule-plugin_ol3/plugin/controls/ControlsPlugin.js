/**
 * @class Oskari.mapframework.mapmodule.ControlsPlugin
 *
 * Adds mouse and keyboard controls to the map and adds tools controls
 * for zoombox and measurement (line/area). Also adds request handling for
 * ToolSelectionRequest, EnableMapKeyboardMovementRequest, DisableMapKeyboardMovementRequest,
 * EnableMapMouseMovementRequest and DisableMapMouseMovementRequest.
 * Overrides OpenLayers keyboard/mouse controls with PorttiKeyboard and PorttiMouse.
 *
 * default configuration for mouse as of 2012-12-05:
 *
 *
    {
               "id":"Oskari.mapframework.mapmodule.ControlsPlugin",
               "config" : {
                    "mouse" : {
                        "useCenterMapInWheelZoom" : false,
                        "useCenterMapInDblClickZoom": false
                    }
               }
     }
 *
 */

//-----------ol.control --> zoom, scaleLine, mousePosition
//----> toteuta measurementit drawPluginissa: http://openlayers.org/en/v3.6.0/examples/measure.html, http://openlayers.org/en/v3.1.0/examples/measure.js
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.ControlsPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.mapmodule.ControlsPlugin';
        me._name = 'ControlsPlugin';
    }, {
    /** @static @property __name plugin name */
    __name : 'ControlsPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method hasUI
     * @return {Boolean} true
     * This plugin has an UI so always returns true
     */
    hasUI : function() {
        return true;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {

        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if (mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
            this._createMapControls();
        }
    },
    /**
     * @method register
     * Interface method for the module protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     * Interface method for the module protocol
     */
    unregister : function() {

    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var me = this;

        var mapMovementHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMovementControlsRequestHandler', me.getMapModule());
        this.requestHandlers = {
            'ToolSelectionRequest' : Oskari.clazz.create('Oskari.mapframework.mapmodule.ToolSelectionHandler', sandbox, me),
            'EnableMapKeyboardMovementRequest' : mapMovementHandler,
            'DisableMapKeyboardMovementRequest' : mapMovementHandler,
            'EnableMapMouseMovementRequest' : mapMovementHandler,
            'DisableMapMouseMovementRequest' : mapMovementHandler
        };
    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);

        for(var reqName in this.requestHandlers ) {
            sandbox.addRequestHandler(reqName, this.requestHandlers[reqName]);
        }

        for(var p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        /*
        for(var reqName in this.requestHandlers ) {
            sandbox.removeRequestHandler(reqName, this.requestHandlers[reqName]);
        }
        */

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },

    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        /**
         * @method Toolbar.ToolSelectedEvent
         * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
         */
       'Toolbar.ToolSelectedEvent' : function(event) {
            // changed tool -> cancel any current tool
            /*
            if(this.conf.zoomBox !== false) {
                this._zoomBoxTool.deactivate();
            }
            if(this.conf.measureControls !== false) {
                this._measureControls.line.deactivate();
                this._measureControls.area.deactivate();
            }
            */
       }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },

    /**
     * @private @method _createMapControls
     * Constructs/initializes necessary controls for the map. After this they can be added to the map
     * with _addMapControls().
     *
     */
    _createMapControls: function () {
        var me = this,
            //conf = me.getConfig(),
            map = me.getMapModule().getMap(),
            //geodesic = conf.geodesic === undefined ? true : conf.geodesic,
            sandbox = me.getMapModule().getSandbox(),
            key;

        //Mouse Position
        var mousePositionControl = new ol.control.MousePosition({
          coordinateFormat:ol.coordinate.createStringXY(4), //This is the format we want the coordinate in.
          //The number arguement in createStringXY is the number of decimal places.
          projection:"EPSG:3067", //This is the actual projection of the coordinates.
          //Luckily, if our map is not native to the projection here, the coordinates will be transformed to the appropriate projection.
          className:"custom-mouse-position",
          target:undefined, //define a target if you have a div you want to insert into already,
          undefinedHTML: '&nbsp;' //what openlayers will use if the map returns undefined for a map coordinate.
        });
        map.addControl(mousePositionControl);

        //Full Screen
        var fullScreenControl = new ol.control.FullScreen();
        map.addControl(fullScreenControl);

        //ScaleLine
        var scaleLine = new ol.control.ScaleLine();
        map.addControl(scaleLine);

    }
}, {
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
