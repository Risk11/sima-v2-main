import { useMemo } from 'react';
import { useArcGis } from '../context/ArcGisProvider';
import { supplementaryLayerData } from '../../config';
import { LayerConfig } from '../../../types';

const BASE_URL = "https://dms.duniacommunica.co.id/gispro3/rest/services";

export function useActiveLayerConfigs(): LayerConfig[] {
    const { selectedService, layers: layersFromApi } = useArcGis();

    return useMemo(() => {
        if (!selectedService || layersFromApi.length === 0) {
            return [];
        }

        return layersFromApi.map(layerFromApi => {
            const extraData = supplementaryLayerData[layerFromApi.name];

            const displayFields = (layerFromApi.fields || [])
                .slice(0, 6)
                .map(field => field.name);

            if (extraData) {
                return {
                    ...extraData,
                    id: String(layerFromApi.id),
                    title: layerFromApi.name,
                    url: `${BASE_URL}/${selectedService}/MapServer/${layerFromApi.id}`,
                    displayFields: displayFields,
                };
            } else {
                const defaultNameField = layerFromApi.fields[1]?.name || 'OBJECTID';
                return {
                    id: String(layerFromApi.id),
                    url: `${BASE_URL}/${selectedService}/MapServer/${layerFromApi.id}`,
                    title: layerFromApi.name,
                    nameField: defaultNameField,
                    displayFields: displayFields,
                    photoField: undefined,
                };
            }
        });
    }, [selectedService, layersFromApi]);
}