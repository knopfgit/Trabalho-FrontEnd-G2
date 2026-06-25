import { useEffect, useContext, useState } from "react";
import { Navbar } from "../components";
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -28.2620,
  lng: -52.4083,
};

const shelterIcon = {
  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
};

export const Map = () => {
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const data = await getPoints(token);
        setMarkers(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchMarkers();
  }, [token]);

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const descricao = prompt("Nome do abrigo ou ponto de apoio:");
    if (!descricao) return;

    const newPoint = { latitude: lat, longitude: lng, descricao };
    try {
      const savedPoint = await postPoint(token, newPoint);
      const savedMarker = {
        id: savedPoint.id,
        title: savedPoint.descricao,
        position: { lat: savedPoint.latitude, lng: savedPoint.longitude },
      };
      setMarkers((prev) => [...prev, savedMarker]);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      {/* Alerta de risco */}
      <div className="bg-red-600 text-white px-4 py-2 flex items-center gap-2 text-sm font-medium">
        <span>⚠</span>
        <span>Risco de enchente — procure um abrigo seguro</span>
        <span className="ml-auto text-xs opacity-80">Nível do rio: 8,2 m ↑</span>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-xs text-blue-700 flex items-center gap-1">
        <span>📍</span>
        <span>Clique no mapa para adicionar um ponto de abrigo ou apoio</span>
      </div>

      {/* Mapa */}
      <div className="flex-1">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onClick={handleMapClick}
          >
            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                icon={shelterIcon}
                onClick={() => setSelected(marker)}
              />
            ))}
            {selected && (
              <InfoWindow
                position={selected.position}
                onCloseClick={() => setSelected(null)}
              >
                <div className="p-1">
                  <p className="font-semibold text-gray-800">🏠 {selected.title}</p>
                  <p className="text-xs text-green-600 mt-1">✓ Ponto de abrigo</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Carregando mapa...
          </div>
        )}
      </div>

      {/* Contagem de abrigos */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm">
        <span className="text-gray-600">🏠 <strong>{markers.length}</strong> abrigos mapeados</span>
        <span className="text-blue-600 font-medium">AlertaRS — Defesa Civil</span>
      </div>
    </div>
  );
};