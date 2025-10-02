// hooks/useArcgisData.ts

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as api from '../services/arcgisApiService';
import { Feature } from '../types';
import { useArcGis } from '../context/ArcGisProvider';

export const useArcgisData = () => {
    const { selectedService, layers } = useArcGis();
    const [filterValue, setFilterValue] = useState('');

    const { data: layerDetailsMap, isLoading: areDetailsLoading } = useQuery<Map<number, any>>({
        queryKey: ['arcgis', 'layerDetails', selectedService, layers.map(l => l.id)],
        queryFn: async () => {
            const detailsPromises = layers.map(layer =>
                api.fetchLayerDetails(selectedService, layer.id).then(details => [layer.id, details])
            );
            const detailsArray = await Promise.all(detailsPromises);
            return new Map(detailsArray as [number, any][]);
        },
        enabled: !!selectedService && layers.length > 0,
        staleTime: Infinity,
    });

    const whereClause = useMemo(() => {
        if (!filterValue.trim() || !layerDetailsMap) {
            return "1=1";
        }
        return `UP3 = '${filterValue.trim().toUpperCase()}'`;
    }, [filterValue, layerDetailsMap]);
    const {
        data: features,
        isPending: isFeaturesLoading,
        error: featuresError
    } = useQuery<Feature[]>({
        queryKey: ['arcgis', 'features', selectedService, whereClause],
        queryFn: async () => {
            if (!selectedService || layers.length === 0) return [];

            const featurePromises = layers.map(layer => {
                const details = layerDetailsMap?.get(layer.id);
                const hasUP3Field = details?.fields.some((f: any) => f.name.toUpperCase() === 'UP3');

                const finalWhere = (filterValue.trim() && hasUP3Field) ? whereClause : "1=1";

                return api.fetchFeatures(selectedService, layer.id, finalWhere);
            });

            const results = await Promise.all(featurePromises);
            return results.flat();
        },
        enabled: !!selectedService && layers.length > 0 && !areDetailsLoading,
    });

    return {
        isFeaturesLoading: areDetailsLoading || isFeaturesLoading,
        features: features ?? [],
        featuresError,
        filterValue,
        setFilterValue,
    };
};