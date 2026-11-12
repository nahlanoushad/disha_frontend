import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG map marker to eliminate missing image assets in Vite production bundles
const createCustomMarkerIcon = (color = '#1e3a8a') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 16 26 16 26s16-15.5 16-26c0-8.837-7.163-16-16-16z" 
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="16" cy="15" r="7" fill="#ffffff"/>
      <circle cx="16" cy="15" r="4" fill="${color}"/>
    </svg>
  `;

  return L.divIcon({
    className: 'disha-map-pin',
    html: svg,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -40]
  });
};

const InteractiveLocationMap = ({
  latitude = 11.2588, // Default: Kozhikode, Kerala
  longitude = 75.7804,
  zoom = 13,
  locationName = 'Selected Location',
  onLocationChange = () => {},
  isDraggable = true,
  height = '380px'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isInternalUpdateRef = useRef(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = latitude && !isNaN(Number(latitude)) ? Number(latitude) : 11.2588;
    const initialLng = longitude && !isNaN(Number(longitude)) ? Number(longitude) : 75.7804;

    // Create Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: zoom,
      zoomControl: false, // We'll add custom position or repositioned controls
      scrollWheelZoom: true
    });

    mapInstanceRef.current = map;

    // Add Zoom Control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // OpenStreetMap standard tile layer with mandatory attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | DISHA Platform'
    }).addTo(map);

    // Create marker
    const icon = createCustomMarkerIcon('#1e3a8a');
    const marker = L.marker([initialLat, initialLng], {
      icon,
      draggable: isDraggable
    }).addTo(map);

    markerRef.current = marker;

    const popupContent = `
      <div style="font-family: inherit; font-size: 13px; padding: 4px; line-height: 1.4;">
        <strong style="color: #0f172a; display: block; font-size: 13.5px; margin-bottom: 2px;">${locationName}</strong>
        <span style="color: #64748b; font-size: 11px;">Lat: ${initialLat.toFixed(4)}, Lng: ${initialLng.toFixed(4)}</span>
        <div style="margin-top: 4px; font-size: 11px; color: #0284c7; font-weight: 500;">
          ${isDraggable ? 'Drag pin or click map to move' : 'Selected Location'}
        </div>
      </div>
    `;
    marker.bindPopup(popupContent);

    // Drag end listener
    if (isDraggable) {
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        isInternalUpdateRef.current = true;
        onLocationChange(lat, lng, 'map_drag');
      });
    }

    // Click map to reposition marker
    map.on('click', (e) => {
      if (!isDraggable) return;
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      isInternalUpdateRef.current = true;
      onLocationChange(lat, lng, 'map_click');
    });

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sync coordinates when prop updates from external search or button click
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) return;

    const lat = Number(latitude);
    const lng = Number(longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    // Update marker position
    markerRef.current.setLatLng([lat, lng]);

    // Update popup
    const popupContent = `
      <div style="font-family: inherit; font-size: 13px; padding: 4px; line-height: 1.4;">
        <strong style="color: #0f172a; display: block; font-size: 13.5px; margin-bottom: 2px;">${locationName || 'Selected Location'}</strong>
        <span style="color: #64748b; font-size: 11px;">Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</span>
        <div style="margin-top: 4px; font-size: 11px; color: #0284c7; font-weight: 500;">
          ${isDraggable ? 'Drag pin or click map to move' : 'Selected Location'}
        </div>
      </div>
    `;
    markerRef.current.setPopupContent(popupContent);

    // If change was not triggered internally by map click/drag, smoothly fly map to new location
    if (!isInternalUpdateRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], Math.max(mapInstanceRef.current.getZoom(), 13), {
        duration: 1.2
      });
    }
    isInternalUpdateRef.current = false;
  }, [latitude, longitude, locationName, isDraggable]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)', border: '1px solid #e2e8f0' }}>
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: height,
          backgroundColor: '#f1f5f9'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(4px)',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#475569',
          fontWeight: 500,
          pointerEvents: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}
      >
        Click anywhere on map or drag pin to adjust
      </div>
    </div>
  );
};

export default InteractiveLocationMap;

