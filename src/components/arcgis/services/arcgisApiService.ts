// src/components/arcgis/services/arcgisApiService.ts

import axios from "axios";
import { ServiceInfo, LayerInfo, Feature, LayerDetails } from "../types";

const arcgisApiClient = axios.create({
    baseURL: "https://dms.duniacommunica.co.id/gispro3/rest/services",
});

const handleApiError = (error: any, context: string) => {
    let errorMessage = `Error ${context}`;
    if (axios.isAxiosError(error) && error.response) {
        const arcgisError = error.response.data?.error;
        if (arcgisError) {
            errorMessage = `ArcGIS API Error: ${arcgisError.message || "Unknown error"}`;
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.error(errorMessage, error);
    throw new Error(errorMessage);
};

export const fetchServices = async (): Promise<ServiceInfo[]> => {
    try {
        const response = await arcgisApiClient.get<{ services: ServiceInfo[] }>(`/?f=json`);
        return response.data.services.filter(service => service.type === "MapServer");
    } catch (error) {
        handleApiError(error, "fetching services");
        throw error;
    }
};

export const fetchLayersForService = async (serviceName: string): Promise<LayerInfo[]> => {
    if (!serviceName) return [];
    try {
        const response = await arcgisApiClient.get<{ layers: LayerInfo[] }>(`/${serviceName}/MapServer?f=json`);
        return response.data.layers;
    } catch (error) {
        handleApiError(error, `fetching layers for ${serviceName}`);
        throw error;
    }
};

export const fetchLayerDetails = async (serviceName: string, layerId: number): Promise<LayerDetails> => {
    try {
        const response = await arcgisApiClient.get<LayerDetails>(`/${serviceName}/MapServer/${layerId}?f=json`);
        return response.data;
    } catch (error) {
        handleApiError(error, `fetching details for layer ${layerId}`);
        throw error;
    }
};

export const fetchFeatures = async (
    serviceName: string,
    layerId: number,
    whereClause: string = "1=1"
): Promise<Feature[]> => {
    try {
        const response = await arcgisApiClient.get<{ features: Feature[] }>(`/${serviceName}/MapServer/${layerId}/query`, {
            params: {
                where: whereClause,
                outFields: "*",
                f: "json"
            },
        });
        return response.data.features;
    } catch (error) {
        handleApiError(error, `fetching features for layer ${layerId} with where clause: ${whereClause}`);
        throw error;
    }
};

export const fetchDistinctValues = async (
    serviceName: string,
    layerId: number,
    fieldName: string
): Promise<{ id: string; name: string }[]> => {
    try {
        const response = await arcgisApiClient.get<{ features: { attributes: any }[] }>(
            `/${serviceName}/MapServer/${layerId}/query`,
            {
                params: {
                    where: '1=1',
                    outFields: fieldName,
                    returnDistinctValues: true,
                    f: 'json',
                },
            }
        );
        return (response.data.features || [])
            .map(feature => {
                const value = feature.attributes[fieldName];
                return { id: value, name: value };
            })
            .filter(item => item.id)
            .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        handleApiError(error, `fetching distinct values for field ${fieldName}`);
        throw error;
    }
};

export const fetchAllDistinctUp3s = async (): Promise<{ id: string; name: string }[]> => {
    try {
        const allServices = await fetchServices();
        const promises = allServices.map(service =>
            fetchDistinctValues(service.name, 6, 'UP3').catch(() => [])
        );
        const results = await Promise.all(promises);
        const allUp3Values = results.flat().map(item => item.name);
        const uniqueUp3Names = [...new Set(allUp3Values)];

        return uniqueUp3Names
            .map(name => ({ id: name, name: name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        handleApiError(error, 'fetching all distinct UP3s');
        throw error;
    }
};