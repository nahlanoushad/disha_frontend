import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Search,
  Navigation,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2,
  Info,
  Loader2,
  RefreshCw,
  Globe
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';
import InteractiveLocationMap from './InteractiveLocationMap.jsx';

const POPULAR_HUBS = [
  { name: 'Kozhikode', district: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804, pincode: '673001' },
  { name: 'Ernakulam / Kochi', district: 'Ernakulam', state: 'Kerala', lat: 9.9816, lng: 76.2999, pincode: '682011' },
  { name: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, pincode: '695001' },
  { name: 'Thrissur', district: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144, pincode: '680001' },
  { name: 'Malappuram', district: 'Malappuram', state: 'Kerala', lat: 11.0732, lng: 76.0740, pincode: '676505' },
  { name: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9716, lng: 77.5946, pincode: '560001' }
];

const LocationChangeModal = ({
  isOpen = false,
  onClose = () => {},
  currentLocation = null,
  onSavePermanent = () => {},
  onSelectTemporary = null, // If provided, enables temporary college discovery search
  title = 'Change Preferred Location'
}) => {
  const [selectedLocation, setSelectedLocation] = useState(() => ({
    displayName: currentLocation?.displayName || `${currentLocation?.city || 'Kozhikode'}, ${currentLocation?.state || 'Kerala'}`,
    locality: currentLocation?.locality || '',
    city: currentLocation?.city || 'Kozhikode',
    district: currentLocation?.district || 'Kozhikode',
    state: currentLocation?.state || 'Kerala',
    country: currentLocation?.country || 'India',
    pincode: currentLocation?.pincode || '',
    coordinates: {
      latitude: currentLocation?.coordinates?.latitude ?? 11.2588,
      longitude: currentLocation?.coordinates?.longitude ?? 75.7804
    },
    source: currentLocation?.source || 'saved'
  }));

  // Update selected location when modal opens or prop changes
  useEffect(() => {
    if (currentLocation && isOpen) {
      setSelectedLocation({
        displayName: currentLocation.displayName || `${currentLocation.city || 'Kozhikode'}, ${currentLocation.state || 'Kerala'}`,
        locality: currentLocation.locality || '',
        city: currentLocation.city || 'Kozhikode',
        district: currentLocation.district || 'Kozhikode',
        state: currentLocation.state || 'Kerala',
        country: currentLocation.country || 'India',
        pincode: currentLocation.pincode || '',
        coordinates: {
          latitude: currentLocation.coordinates?.latitude ?? 11.2588,
          longitude: currentLocation.coordinates?.longitude ?? 75.7804
        },
        source: currentLocation.source || 'saved'
      });
    }
  }, [currentLocation, isOpen]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Geo & saving states
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [isSavingPermanent, setIsSavingPermanent] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await studentApi.searchLocation(searchQuery.trim(), 5);
        const results = res.data?.locations || [];
        setSearchResults(results);
        setSearchDropdownOpen(results.length > 0);
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSelectSearchResult = (loc) => {
    setSelectedLocation({
      displayName: loc.displayName || `${loc.city || loc.district}, ${loc.state}`,
      locality: loc.locality || '',
      city: loc.city || loc.district || '',
      district: loc.district || loc.city || '',
      state: loc.state || 'Kerala',
      country: loc.country || 'India',
      pincode: loc.pincode || '',
      coordinates: {
        latitude: loc.coordinates?.latitude || 11.2588,
        longitude: loc.coordinates?.longitude || 75.7804
      },
      source: 'search'
    });
    setSearchQuery('');
    setSearchDropdownOpen(false);
    setGeoError(null);
  };

  const handleMapLocationChange = async (lat, lng, source) => {
    setIsReverseGeocoding(true);
    setGeoError(null);
    try {
      const res = await studentApi.reverseGeocode(lat, lng);
      const rev = res.data?.location;
      if (rev) {
        setSelectedLocation({
          displayName: rev.displayName || `${rev.city || rev.district || 'Selected Location'}, ${rev.state || ''}`.trim(),
          locality: rev.locality || '',
          city: rev.city || rev.district || '',
          district: rev.district || rev.city || '',
          state: rev.state || 'Kerala',
          country: rev.country || 'India',
          pincode: rev.pincode || '',
          coordinates: { latitude: lat, longitude: lng },
          source: source || 'map'
        });
      } else {
        setSelectedLocation(prev => ({
          ...prev,
          coordinates: { latitude: lat, longitude: lng },
          source: source || 'map'
        }));
      }
    } catch (err) {
      console.warn('Reverse geocode error:', err);
      setSelectedLocation(prev => ({
        ...prev,
        coordinates: { latitude: lat, longitude: lng },
        source: source || 'map'
      }));
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setIsLocatingUser(false);
        await handleMapLocationChange(lat, lng, 'geolocation');
      },
      (err) => {
        setIsLocatingUser(false);
        if (err.code === 1) {
          setGeoError('Location permission denied. Please select your location manually or on the map.');
        } else {
          setGeoError('Unable to detect current position. Please select manually.');
        }
      },
      { timeout: 10000 }
    );
  };

  const handleSelectPreset = (hub) => {
    setSelectedLocation({
      displayName: `${hub.name}, ${hub.state}`,
      locality: '',
      city: hub.name.split('/')[0].trim(),
      district: hub.district,
      state: hub.state,
      country: 'India',
      pincode: hub.pincode,
      coordinates: { latitude: hub.lat, longitude: hub.lng },
      source: 'preset'
    });
    setGeoError(null);
  };

  // 1. Save Permanently to MongoDB
  const handleSavePermanently = async () => {
    setIsSavingPermanent(true);
    setStatusMessage(null);
    try {
      const res = await studentApi.updateLocation({
        displayName: selectedLocation.displayName,
        locality: selectedLocation.locality,
        city: selectedLocation.city,
        district: selectedLocation.district,
        state: selectedLocation.state,
        country: selectedLocation.country,
        pincode: selectedLocation.pincode,
        coordinates: selectedLocation.coordinates,
        source: selectedLocation.source
      });

      if (onSavePermanent) {
        await onSavePermanent(res.data?.location || selectedLocation);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update permanent location:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save location' });
    } finally {
      setIsSavingPermanent(false);
    }
  };

  // 2. Select Temporary (For College Finder exploration)
  const handleApplyTemporary = () => {
    if (onSelectTemporary) {
      onSelectTemporary(selectedLocation);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                {title}
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                Search by city, district or click anywhere on the map to reposition.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: '#f1f5f9',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Controls: Search + Geolocation + Presets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'start' }}>
            {/* Search Input Box */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: isSearching ? '#2563eb' : '#94a3b8'
                }}
              >
                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </div>

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setSearchDropdownOpen(true);
                }}
                placeholder="Search city, district, locality, or PIN code..."
                style={{
                  width: '100%',
                  height: '42px',
                  paddingLeft: '38px',
                  paddingRight: '12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />

              {/* Autocomplete Dropdown */}
              {searchDropdownOpen && searchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    border: '1px solid #cbd5e1',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    zIndex: 200
                  }}
                >
                  {searchResults.map((loc, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSearchResult(loc)}
                      style={{
                        padding: '8px 12px',
                        borderBottom: idx < searchResults.length - 1 ? '1px solid #f1f5f9' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <MapPin size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {loc.displayName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {[loc.city, loc.district, loc.state].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Location Button */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocatingUser}
              style={{
                height: '42px',
                padding: '0 1rem',
                borderRadius: '10px',
                border: '1px solid #bfdbfe',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: isLocatingUser ? 'not-allowed' : 'pointer'
              }}
            >
              {isLocatingUser ? <Loader2 size={15} className="animate-spin" /> : <Navigation size={15} />}
              My Location
            </button>
          </div>

          {/* Quick Hub Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Quick Hubs:
            </span>
            {POPULAR_HUBS.map((hub) => (
              <button
                key={hub.name}
                type="button"
                onClick={() => handleSelectPreset(hub)}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  color: '#334155',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {hub.name}
              </button>
            ))}
          </div>

          {geoError && (
            <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.8rem' }}>
              {geoError}
            </div>
          )}

          {/* Interactive Map */}
          <div>
            <InteractiveLocationMap
              latitude={selectedLocation.coordinates?.latitude || 11.2588}
              longitude={selectedLocation.coordinates?.longitude || 75.7804}
              zoom={12}
              locationName={selectedLocation.displayName}
              onLocationChange={handleMapLocationChange}
              isDraggable={true}
              height="300px"
            />
          </div>

          {/* Selected Location Details Strip */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#f8faff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} color="#2563eb" />
                <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedLocation.displayName}
                </span>
                {isReverseGeocoding && (
                  <span style={{ fontSize: '0.72rem', color: '#0284c7' }}>
                    <RefreshCw size={11} className="animate-spin" /> Geocoding...
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                {[selectedLocation.locality, selectedLocation.city, selectedLocation.district, selectedLocation.state, selectedLocation.pincode].filter(Boolean).join(' • ')}
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Lat: {selectedLocation.coordinates?.latitude?.toFixed(4)}, Lng: {selectedLocation.coordinates?.longitude?.toFixed(4)}
            </div>
          </div>

          {statusMessage && (
            <div style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', backgroundColor: statusMessage.type === 'error' ? '#fef2f2' : '#f0fdf4', color: statusMessage.type === 'error' ? '#b91c1c' : '#15803d', fontSize: '0.82rem' }}>
              {statusMessage.text}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          {/* If opened from CollegeFinder, offer Temporary exploration */}
          {onSelectTemporary && (
            <button
              type="button"
              onClick={handleApplyTemporary}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                border: '1.5px solid #2563eb',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Search Here Temporarily
            </button>
          )}

          {/* Primary Save Default Location Button */}
          <button
            type="button"
            onClick={handleSavePermanently}
            disabled={isSavingPermanent}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              backgroundColor: '#1e3a8a',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              border: 'none',
              cursor: isSavingPermanent ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(30, 58, 138, 0.25)'
            }}
          >
            {isSavingPermanent ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} /> Set as My Default Location
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationChangeModal;

