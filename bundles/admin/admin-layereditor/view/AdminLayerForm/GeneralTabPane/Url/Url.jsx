import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { CesiumIon } from './CesiumIon';
import { StyledComponent } from '../../StyledFormComponents';
import { AdminUrlInput } from '../../../AdminUrlInput';

const { CESIUM_ION } = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const Url = ({ layer, propertyFields, controller }) => (
    <Fragment>
        <Message messageKey='interfaceAddress' />
        <StyledComponent>
            <AdminUrlInput layer={layer} controller={controller} propertyFields={propertyFields} />
            { propertyFields.includes(CESIUM_ION) &&
                <CesiumIon layer={layer} controller={controller} />
            }
        </StyledComponent>
    </Fragment>
);
Url.propTypes = {
    layer: PropTypes.object.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
