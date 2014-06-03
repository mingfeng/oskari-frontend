/**
 * @class Oskari.mapframework.bundle.routesearch.Flyout
 *
 * Renders the "route search" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.routesearch.Flyout',
    function() {
        this.fields = ['from', 'to'];
        this.state = {};
        this.services = [];
        this._templates = {};
        this._templates.main =
            '<div>' +
            '</div>' +
            '<div>' + // Hidden at start (no results yet)
        '    <strong></strong>' +
            '    <ul></ul>' +
            '</div>' +
            '<div></div>';
        this.mapEl = this.instance.sandbox.findRegisteredModuleInstance(
            'MainMapModule').getMapEl();
    }, {
        getName: function() {
            return 'Oskari.mapframework.bundle.routesearch.Flyout';
        },

        _getSearchSuggestions: function(field, request, response) {
            var me = this,
                i,
                location,
                fieldName = field.attr('name');

            me.state[fieldName] = {
                "name": request.term
            };
            if (request.term && request.term.length > 2) {
                me.service.doSearch(
                    request.term,
                    function(data) {
                        // onSuccess
                        if (data && data.totalCount) {
                            response(data.locations);
                        } else {
                            response([]);
                        }
                    },
                    function(data) {}
                );
            }
        },

        _setSearchLocation: function(field, event, ui) {
            var fieldName = field.attr('name'),
                tmp = jQuery('<a>');
            this.state[fieldName] = ui.item;
            // We have to unescape the text somehow... ;)
            tmp.html(ui.item.name + ', ' + ui.item.village);
            field.val(tmp.text());
        },

        _reverseGeoCode: function(field, lonLat) {
            // FIXME
        },

        disableMapClick: function() {
            delete this.state.field;
            this.mapEl.removeClass("cursor-crosshair");
            this.instance.unregisterMapClickHandler();
        },

        onMapClick: function(lonLat) {
            var me = this;
            if (me.state.field) {
                me._reverseGeoCode(me.state.field, lonLat);
                me.disableMapClick();
            }
        },

        _fromMapButtonHandler: function(field, event) {
            var me = this;
            if (me.state.field === field) {
                // Deselect target on second click
                me.disableMapClick();
            } else {
                me.state.field = field;
                me.instance.registerMapClickHandler();
                me.mapEl.addClass("cursor-crosshair");
            }
        },

        _searchButtonHandler: function(event) {

        },

        /**
         * @method startPlugin
         * called by host to start flyout operations
         */
        startPlugin: function() {
            var me = this,
                ajaxUrl = null,
                el = me.getEl().addClass('routesearch'),
                contents = jQuery(me._templates.main),
                i,
                field,
                fields = me.fields,
                tmp;
            /*
                cancelBtn =
                    Oskari.clazz.create(
                        'Oskari.userinterface.component.buttons.CancelButton'),
                searchBtn =
                    Oskari.clazz.create(
                        'Oskari.userinterface.component.Button');*/

            if (me.instance.conf && me.instance.conf.url) {
                ajaxUrl = me.instance.conf.url;
            } else {
                ajaxUrl =
                    me.getSandbox().getAjaxUrl() +
                    'action_route=GetSearchResult';
            }
            // FIXME temp
            ajaxUrl =
                "http://localhost:8080/web/fi/kartta?" +
                "p_p_id=Portti2Map_WAR_portti2mapportlet&" +
                "p_p_lifecycle=2&" +
                "action_route=GetSearchResult";
            me.service = Oskari.clazz.create(
                'Oskari.mapframework.bundle.search.service.SearchService',
                ajaxUrl
            );

            contents.eq(1).find('strong').html(me.locale.routingService);

            for (i = 0; i < fields.length; i++) {
                field = fields[i];
                tmp = Oskari.clazz.create(
                    'Oskari.userinterface.component.FormInput', field);
                tmp.addClearButton();
                tmp.setLabel(me.locale[field]);
                /* jshint ignore:start */
                tmp.getField().find('input[type=text]').autocomplete({
                    delay: 300,
                    minLength: 2,
                    select: function(event, ui) {
                        event.preventDefault();
                        me._setSearchLocation($(this), event, ui);
                    },
                    source: function(request, response) {
                        me._getSearchSuggestions($(this), request, response);
                    }
                }).data("autocomplete")._renderItem = function(ul, item) {
                    var li = jQuery("<li>"),
                        a = jQuery('<a href="#">');
                    a.html(item.name + ", " + item.village);
                    li.append(a);
                    ul.append(li);
                    return li;
                };
                /* jshint ignore:end */
                contents.eq(0).append(tmp.getField());
                tmp = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button');
                tmp.setTitle(me.locale.fromMap);
                /* jshint ignore:start */
                tmp.setHandler(function(event) {
                    me._fromMapButtonHandler(field, event);
                });
                /* jshint ignore:end */
                // FIXME ucomment when reverse geocode works
                //tmp.insertTo(contents.eq(0).find('.oskarifield:eq(' + i + ')'));

                // Suggestions list
                contents.eq(2).append(
                    '<ol id="' + field + 'Suggestions' + '"></ol>');
            }
            /* I'll prolly remove the buttons
            cancelBtn.setHandler(function (event) {
                me.instance.sandbox.postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [me.instance, 'close']
                );
            });
            searchBtn.setTitle(me.locale.fetchRoute);
            searchBtn.setHandler(me._searchButtonHandler);
            searchBtn.setPrimary(true);
            searchBtn.insertTo(contents.eq(2));
            cancelBtn.insertTo(contents.eq(2));*/

            el.append(contents);
            me._initRoutingServices();
            me._updateRoutingLinks();
        },

        _initRoutingServices: function() {
            var matka = {},
                google = {},
                here = {};

            matka.baseUrl = "http://www.matka.fi/fi/?";
            google.baseUrl = "http://www.google.fi/maps/dir/";

            var me = this;

            me.services.push(
                me._routingService(
                    'Matka.fi',
                    '#2651A6',
                    function(fromLoc, toLoc) {
                        var url = 'http://www.matka.fi/fi/?keya=';
                        url += encodeURIComponent(fromLoc.name);
                        if (fromLoc.village) {
                            url += '%2C+' + encodeURIComponent(fromLoc.village);
                        }
                        url += '&keyb=' + encodeURIComponent(toLoc.name);
                        if (toLoc.village) {
                            url += '%2C+' + encodeURIComponent(toLoc.village);
                        }
                        return url;
                    }
                )
            );

            me.services.push(
                me._routingService(
                    'Google Maps',
                    '#A5D275',
                    function(fromLoc, toLoc) {
                        var url = 'http://www.google.fi/maps/dir/';
                        url += encodeURIComponent(fromLoc.name);
                        if (fromLoc.village) {
                            url += ',+' + encodeURIComponent(fromLoc.village);
                        }
                        url += ',+Finland';
                        url += '/' + encodeURIComponent(toLoc.name);
                        if (toLoc.village) {
                            url += ',+' + encodeURIComponent(toLoc.village);
                        }
                        url += ',+Finland';
                        return url;
                    }
                )
            );

            me.services.push(
                me._routingService(
                    'HERE',
                    '#124191',
                    function(fromLoc, toLoc) {
                        var url = 'http://here.com/directions/drive/';
                        url += encodeURIComponent(
                            fromLoc.name.replace(' ', '_')
                        );
                        if (fromLoc.village) {
                            url += ',_' +
                                encodeURIComponent(
                                    fromLoc.village.replace(' ', '_')
                            );
                        }
                        url += ',_Finland';
                        url += '/' + encodeURIComponent(
                            toLoc.name.replace(' ', '_')
                        );
                        if (toLoc.village) {
                            url += ',_' + encodeURIComponent(
                                toLoc.village.replace(' ', '_')
                            );
                        }
                        url += ',_Finland';
                        return url;
                    }
                )
            );
        },

        _routingService: function(name, color, urlBuilder) {
            var ret = {
                name: name,
                color: color,
                urlBuilder: urlBuilder,
                getButton: function(fromLoc, toLoc) {
                    var me = this,
                        el;

                    if (!this.el) {
                        el = jQuery('<a>' + me.name + '</a>');
                        this.el = el;
                    }
                    if (fromLoc && fromLoc.name && toLoc && toLoc.name) {
                        el.attr('href', me.urlBuilder(fromLoc, toLoc));
                        el.attr('target', '_blank');
                        el.removeClass('disabled');
                        el.css('background-color', me.color);
                        el.unbind('click');
                    } else {
                        el.attr('href', '#');
                        el.removeAttr('target');
                        el.addClass('disabled');
                        el.css('background-color', '');
                        el.click(
                            function(event) {
                                event.preventDefault();
                                return false;
                            }
                        );
                    }
                    return el;
                }
            };
            return ret;
        },

        _updateRoutingLinks: function(createButtons) {
            var me = this,
                buttons = [],
                locations = [],
                routingService,
                i;

            for (i = 0; i < me.fields.length; i++) {
                locations.push(me.state[me.fields[i]]);
            }

            for (i = 0; i < me.services.length; i++) {
                routingService = me.services[i];
                console.log(routingService);
                button = routingService.getButton.apply(
                    routingService,
                    locations
                );
                if (createButtons) {
                    var ulli = me.getEl().find('ul'),
                        lilli = jQuery('<li>');
                    console.log("ul", ulli);
                    lilli.append(button);
                    ulli.append(lilli);
                }
            }
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    }
);
