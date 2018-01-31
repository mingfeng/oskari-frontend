/**
 * @class Oskari.admin.bundle.admin.HierarchicalLayerListBundleInstance
 *
 * Hierarchical layerlist bundle for admins. This extends hierarchical-layerlist bundle.
 */
Oskari.clazz.define("Oskari.admin.bundle.admin.HierarchicalLayerListBundleInstance",
    function() {
        this.locale = this.getLocalization();
        this.sandbox = Oskari.getSandbox();
        this.service = this.sandbox.getService('Oskari.framework.bundle.hierarchical-layerlist.LayerlistExtenderService');
        this.layerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        this.group = Oskari.clazz.create('Oskari.admin.hierarchical-layerlist.Group', this.sandbox, this.locale);
        this.layer = Oskari.clazz.create('Oskari.admin.hierarchical-layerlist.Layer', this, this.sandbox, this.locale);
    }, {
        /*******************************************************************************************************************************
        /* PRIVATE METHODS
        *******************************************************************************************************************************/
        /**
         * Add main tools
         * @method  _addMainTools
         * @private
         */
        _addMainTools: function() {
            var me = this;
            // Add new tool to adding groups
            me.service.addMainTool('add-group', function(tool) {
                var popupConf = me.group.getGroupAddingPopupConf(tool, null, null, {
                    type: 'group'
                });
                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.addMainGroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'add-group',
                tooltip: me.locale('tooltips.addMainGroup')
            });
        },
        /**
         * Add group tools
         * @method  _addGroupTools
         * @private
         */
        _addGroupTools: function() {
            var me = this;

            // Add layer add tools
            me.service.addGroupTool('add-layer', function(tool, groupId, layerId) {
                var options = {};
                me.layer.showLayerAddPopup(tool, layerId, groupId, options);
            }, {
                cls: 'add-layer',
                tooltip: me.locale('tooltips.addLayer')
            });

            // Add edit tool to adding groups
            me.service.addGroupTool('edit-group', function(tool, groupId) {
                var group = me.layerService.getAllLayerGroups(groupId);
                var options = {
                    locale: group.name,
                    selectable: group.selectable
                };
                options.type = 'group';

                var popupConf = me.group.getGroupAddingPopupConf(tool, groupId, null, options);
                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.editMainGroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'edit-group',
                tooltip: me.locale('tooltips.editMainGroup')
            });

            // Add new tool to adding sub-groups
            me.service.addGroupTool('add-subgroup', function(tool, parentId) {
                var popupConf = me.group.getGroupAddingPopupConf(tool, null, parentId, {
                    type: 'subgroup'
                });

                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.addSubgroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'add-subgroup',
                tooltip: me.locale('tooltips.addSubgroup')
            });


        },
        /**
         * Add subgroup tools
         * @method  _addSubgroupTools
         * @private
         */
        _addSubgroupTools: function() {
            var me = this;
            // Add edit tool to adding groups
            me.service.addSubgroupTool('edit-subgroup', function(tool, groupId, parentId) {
                var group = me.layerService.getAllLayerGroups(groupId);
                var options = {
                    locale: group.name,
                    selectable: group.selectable
                };
                options.type = 'subgroup';

                var popupConf = me.group.getGroupAddingPopupConf(tool, groupId, parentId, options);
                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.editSubgroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'edit-subgroup',
                tooltip: me.locale('tooltips.editSubgroup')
            });

            // Add new tool to adding sub-groups
            me.service.addSubgroupTool('add-subgroup-subgroup', function(tool, parentId) {
                var popupConf = me.group.getGroupAddingPopupConf(tool, null, parentId, {
                    type: 'subgroup-subgroup'
                });

                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.addSubgroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'add-subgroup-subgroup',
                tooltip: me.locale('tooltips.addSubgroup')
            });
        },

        /**
         * Add subgroup  subgroup tools
         * @method  _addSubgroupSubgroupTools
         * @private
         */
        _addSubgroupSubgroupTools: function() {
            var me = this;
            // Add edit tool to adding groups
            me.service.addSubgroupSubgroupTool('edit-subgroup-subgroup', function(tool, groupId, parentId) {
                var group = me.layerService.getAllLayerGroups(groupId);
                var options = {
                    locale: group.name,
                    selectable: group.selectable
                };
                options.type = 'subgroup-subgroup';

                var popupConf = me.group.getGroupAddingPopupConf(tool, groupId, parentId, options);
                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.editSubgroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'edit-subgroup-subgroup',
                tooltip: me.locale('tooltips.editSubgroup')
            });
        },
        /**
         * Add layertree options
         * @method  _addOptions
         * @private
         */
        _addOptions: function() {
            var me = this;

            // Add Drag & drop plugin
            me.service.addLayerlistOption('plugins', ['checkbox', 'changed', 'wholerow', 'types', 'search', 'state', 'conditionalselect', 'dnd'], false);
            me.service.addLayerlistOption('dnd', {
                use_html5: true,
                inside_pos: 'last'
            });
        },


        /*******************************************************************************************************************************
        /* PUBLIC METHODS
        *******************************************************************************************************************************/
        getLocalization: function(key) {
            if (!this.locale) {
                this.locale = Oskari.getMsg.bind(null, this.getName());
            }
            if (key) {
                return this.locale(key);
            }
            return this.locale;
        },
        getName: function() {
            return "AdminHierarchicalLayerList";
        },
        start: function() {
            var me = this;
            if (!me.service) {
                return;
            }
            me.sandbox.register(this);
            // set admin configured
            me.service.setAdmin(true);
            me._addMainTools();
            me._addGroupTools();
            me._addSubgroupTools();
            me._addSubgroupSubgroupTools();
            me._addOptions();
            me._addEventHandlers();
        },
        /**
         * Assigns event handlers to the admin hierarchical layer list.
         */
        _addEventHandlers: function() {
            var me = this;
            jQuery(document).on("dnd_stop.vakata", function(event, data) {
                //If the drag target group is not open, we have to open it.
                //Otherwise we can't get the necessary information of the drag operation.
                var targetGroup = data.data.origin.get_node(jQuery(data.event.target).prop("id").split("_")[0]);
                if (!data.data.origin.is_open(targetGroup)) {
                    data.data.origin.open_node(targetGroup);
                }
                var draggedNode = data.data.origin.get_node(data.element);
                var originalParentNode = data.data.origin.get_node(draggedNode.original.parent);
                var parentNode = data.data.origin.get_node(draggedNode.parent);
                var draggedNodeId = me._findJSTreeNodeActualId(draggedNode.id);
                var draggedNodeNewParentId = me._findJSTreeNodeActualId(parentNode.id);
                var draggedNodeOldParentId = me._findJSTreeNodeActualId(originalParentNode.id);
                //Get the new index inside the group's children
                var draggedNodeNewIndex = _.indexOf(_.values(parentNode.children), draggedNode.id);
                var ajaxData = {};
                ajaxData.type = me._findJSTreeNodeActualType(draggedNode.type);
                ajaxData.nodeId = draggedNodeId;
                ajaxData.nodeIndex = draggedNodeNewIndex;
                ajaxData.oldGroupId = draggedNodeOldParentId;
                ajaxData.targetGroupId = draggedNodeNewParentId;
                me._saveOrder(ajaxData);
            });
        },
        /**
         * Find the nodes actual type which can be either layer or group (includes subgroups and subgroup-subgroups)
         * @param  {String} type The node type in the tree
         * @return {String}      The node actual type - layer or group.
         */
        _findJSTreeNodeActualType: function(type) {
            var actualType;
            if(type.indexOf('group') >= 0) {
                actualType = 'group';
            } else {
                actualType = 'layer';
            }
            return actualType;
        },
        /**
         * Find the nodes actual id which we are interested in.
         * @param  {String} nodeId The node id string
         * @return {Integer}        The node id integer
         */
        _findJSTreeNodeActualId: function(nodeId) {
            return nodeId.replace(/[^0-9]/g, '');
        },

        /**
         * Save group or list ordering and grouping.
         * @method  _saveOrder
         * @param   {Object}   data  data for saving
         * @param   {Oskari.userinterface.component.Popup}   popup group adding/editing popup
         * @param   {String}   type  jstree type
         * @private
         */
        _saveOrder: function(data) {
            var me = this;
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                url: me.sandbox.getAjaxUrl('LayerAndGroupOrder'),
                data: JSON.stringify(data),
                error: function(response) {
                    var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    errorDialog.show(me.locale('errors.nodeDropSave.title'), me.locale('errors.nodeDropSave.message'));
                    errorDialog.fadeout();
                },
                success: function(response) {
                    var successDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    successDialog.show(me.locale('succeeses.nodeDropSave.title'), me.locale('succeeses.nodeDropSave.message'));
                    successDialog.fadeout();
                }
            });
        },
        // module boilerplate methods
        init: function() {

        },
        stop: function() {

        },
        update: function() {

        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    });