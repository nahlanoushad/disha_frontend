import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix Leaflet marker default icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationPickerMap = ({ initialLat, initialLng, initialAddress, onSelectLocation }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Default Kerala center coordinates
  const defaultLat = initialLat ? Number(initialLat) : 10.8505;
  const defaultLng = initialLng ? Number(initialLng) : 76.2711;

  const [selectedCoords, setSelectedCoords] = useState({
    lat: initialLat ? Number(initialLat) : null,
    lng: initialLng ? Number(initialLng) : null
  });

  const [isGeolocating, setIsGeolocating] = useState(false);
  const [addressPreview, setAddressPreview] = useState(initialAddress || '');

  // Reverse geocode via OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'DISHA-Platform/1.0' } }
      );
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setAddressPreview(address);
        onSelectLocation({
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
          address
        });
      }
    } catch (err) {
      console.warn('Geocoding fallback:', err);
      onSelectLocation({
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6))
      });
    }
  };

  // Handle setting marker position
  const updateMarkerPosition = (lat, lng, doGeocode = true) => {
    setSelectedCoords({ lat, lng });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 14);

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
      }
    }

    if (doGeocode) {
      reverseGeocode(lat, lng);
    } else {
      onSelectLocation({
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6))
      });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const zoomLevel = initialLat && initialLng ? 14 : 7;
      const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], zoomLevel);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      if (initialLat && initialLng) {
        markerRef.current = L.marker([Number(initialLat), Number(initialLng)]).addTo(map);
      }

      // Map Click Event
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        updateMarkerPosition(lat, lng, true);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Get User's Current Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        updateMarkerPosition(lat, lng, true);
        setIsGeolocating(false);
      },
      (err) => {
        alert('Could not access location. Please click on the map.');
        setIsGeolocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Top Bar with Current Location Control */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#7c6f93', fontWeight: 500 }}>
          Click anywhere on the map to set location pin & pick coordinates
        </span>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isGeolocating}
          className="btn-secondary"
          title="Use my current GPS position"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
        >
          <Navigation size={13} color="#7c3aed" />
          {isGeolocating ? 'Locating...' : 'Use My GPS Location'}
        </button>
      </div>

      {/* Map Element Container */}
      <div style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1.5px solid #ddd6fe',
        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)'
      }}>
        <div ref={mapContainerRef} style={{ height: '220px', width: '100%', zIndex: 1 }} />

        {/* Map Click Instruction Badge */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          padding: '0.3rem 0.65rem',
          borderRadius: '20px',
          fontSize: '0.72rem',
          color: '#5b5273',
          fontWeight: 600,
          border: '1px solid #ede9fe',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <MapPin size={12} color="#7c3aed" />
          Click to drop pin & set coordinates
        </div>
      </div>

      {/* Coordinates & Selected Address Preview Badge */}
      <div style={{
        padding: '0.6rem 0.85rem',
        borderRadius: '10px',
        backgroundColor: selectedCoords.lat ? '#f5f3ff' : '#f9fafb',
        border: `1px solid ${selectedCoords.lat ? '#ddd6fe' : '#e5e7eb'}`,
        fontSize: '0.78rem',
        color: selectedCoords.lat ? '#1e1035' : '#6b7280',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, color: '#7c3aed' }}>
            Selected Coordinates:
          </span>
          <span>
            {selectedCoords.lat ? (
              <strong>Lat: {selectedCoords.lat}, Lng: {selectedCoords.lng}</strong>
            ) : (
              <em>Click on map to select coordinates</em>
            )}
          </span>
        </div>
        {addressPreview && (
          <div style={{ color: '#5b5273', fontSize: '0.73rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <strong>Picked Address:</strong> {addressPreview}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPickerMap;
