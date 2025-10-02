import React from 'react';
import { Feature } from '../types';

interface Props {
    features: Feature[];
    isLoading: boolean;
}

export const DataTable: React.FC<Props> = ({ features, isLoading }) => {
    if (isLoading) return <div className="aec-message">Memuat data...</div>;
    if (!features.length) return <div className="aec-message">Tidak ada data.</div>;

    const headers = Object.keys(features[0].attributes);

    return (
        <div className="aec-table-wrapper">
            <table>
                <thead>
                    <tr>
                        {headers.map(header => <th key={header}>{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature, index) => (
                        <tr key={index}>
                            {headers.map(header => (
                                <td key={header}>{String(feature.attributes[header])}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};