"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as api from '../services/arcgisApiService';
import { ServiceInfo, LayerInfo } from '../types';

interface ArcGisContextType {
    services: ServiceInfo[];
    isServicesLoading: boolean;
    selectedService: string;
    setSelectedService: (serviceName: string) => void;
    layers: LayerInfo[];
    isLoadingLayers: boolean;
}

const ArcGisContext = createContext<ArcGisContextType | undefined>(undefined);

export const ArcGisProvider = ({ children }: { children: ReactNode }) => {
    const [selectedService, setSelectedService] = useState('');

    const { data: services = [], isLoading: isServicesLoading } = useQuery({
        queryKey: ['arcgis', 'services'],
        queryFn: api.fetchServices,
        staleTime: Infinity,
    });

    const { data: layers = [], isLoading: isLoadingLayers } = useQuery({
        queryKey: ['arcgis', 'layersWithDetails', selectedService],
        queryFn: async (): Promise<LayerInfo[]> => {
            if (!selectedService) return [];

            try {
                const baseLayersResponse = await api.fetchLayersForService(selectedService);
                const baseLayers = baseLayersResponse || [];

                const detailPromises = baseLayers.map(layer =>
                    api.fetchLayerDetails(selectedService, layer.id)
                );

                const layersWithDetails = await Promise.all(detailPromises);

                return layersWithDetails;
            } catch (error) {
                console.error("Gagal mengambil detail layer untuk service:", selectedService, error);
                return [];
            }
        },
        enabled: !!selectedService,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (services.length > 0 && !selectedService) {
            setSelectedService(services[0].name);
        }
    }, [services, selectedService, setSelectedService]);

    const value = {
        services,
        isServicesLoading,
        selectedService,
        setSelectedService,
        layers,
        isLoadingLayers,
    };

    return <ArcGisContext.Provider value={value}>{children}</ArcGisContext.Provider>;
};

export const useArcGis = () => {
    const context = useContext(ArcGisContext);
    if (context === undefined) {
        throw new Error('useArcGis must be used within a ArcGisProvider');
    }
    return context;
};