import "@arcgis/core/assets/esri/themes/light/main.css";

const PetaWebComponent = () => {
    return (
        <arcgis-map
            item-id="4793230052ed498ebf1c7bed9966bd35"
            style={{ width: '100%', height: '100vh' }}
        >
            <arcgis-editor position="top-right"></arcgis-editor>
        </arcgis-map>
    );
};

export default PetaWebComponent;