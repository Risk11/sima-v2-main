declare namespace JSX {
    interface IntrinsicElements {
        'arcgis-map': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            'item-id'?: string;
            position?: string;
        };
        'arcgis-editor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            position?: string;
        };
    }
}