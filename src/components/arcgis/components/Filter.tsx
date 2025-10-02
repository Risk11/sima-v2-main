import React from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    onApply: () => void;
    disabled: boolean;
    isLoading: boolean;
}

export const Filter: React.FC<Props> = ({ value, onChange, onApply, disabled, isLoading }) => (
    <div className="aec-filter-container">
        <input
            type="text"
            placeholder="Filter berdasarkan UP3 (opsional)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
        />
        <button onClick={onApply} disabled={disabled || isLoading}>
            {isLoading ? 'Memuat...' : 'Tampilkan Data'}
        </button>
    </div>
);