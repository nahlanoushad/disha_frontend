import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  MapPin,
  Search,
  Navigation,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Building2,
  BookOpen,
  Info,
  Loader2,
  RefreshCw,
  Globe
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';
import InteractiveLocationMap from '../../components/student/InteractiveLocationMap.jsx';

// Popular Kerala & National Education Centers for 1-click convenience
const POPULAR_EDUCATION_HUBS = [
  { name: 'Kozhikode', district: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804, pincode: '673001' },
  { name: 'Ernakulam / Kochi', district: 'Ernakulam', state: 'Kerala', lat: 9.9816, lng: 76.2999, pincode: '682011' },
  { name: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, pincode: '695001' },
  { name: 'Thrissur', district: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144, pincode: '680001' },
  { name: 'Malappuram', district: 'Malappuram', state: 'Kerala', lat: 11.0732, lng: 76.0740, pincode: '676505' },
  { name: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9716, lng: 77.5946, pincode: '560001' }
];

const LocationOnboarding = ({ onComplete }) => {
  // Current chosen location
  const [selectedLocation, setSelectedLocation] = useState({
    displayName: 'Kozhikode, Kerala',
    locality: 'Mananchira',
    city: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    country: 'India',
    pincode: '673001',
    coordinates: {
      latitude: 11.2588,
      longitude: 75.7804
    },
    source: 'preset'
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Geolocation & saving states
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

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

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await studentApi.searchLocation(searchQuery.trim(), 6);
        const results = res.data?.locations || [];
        setSearchResults(results);
        setSearchDropdownOpen(results.length > 0);
      } catch (err) {
        console.warn('Location search error:', err.message);
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle selecting an autocomplete search result
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

  // Handle map click or marker drag
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
      console.warn('Reverse geocode error:', err.message);
      setSelectedLocation(prev => ({
        ...prev,
        coordinates: { latitude: lat, longitude: lng },
        source: source || 'map'
      }));
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Handle explicit "Use My Current Location" button click
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser. Please search or select on the map.');
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
          setGeoError('Location permission was denied. You can search by city or click on the map to choose your location.');
        } else if (err.code === 2) {
          setGeoError('Unable to detect your position. Please use manual search or the interactive map.');
        } else {
          setGeoError('Location request timed out. Please select your location manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Select a quick preset
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

  // Confirm and persist location to backend
  const handleConfirmLocation = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await studentApi.updateLocation({
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

      setSaveSuccess(true);

      // Brief confirmation view before entering student dashboard
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1200);
    } catch (err) {
      console.error('Failed to save preferred location:', err);
      setErrorMessage(err.message || 'Unable to save location. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Header */}
      <header
        style={{
          height: '72px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            <Compass size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              DISHA
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Student Onboarding
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
            Initial Setup
          </span>
          <div
            style={{
              padding: '0.35rem 0.85rem',
              backgroundColor: '#eff6ff',
              borderRadius: '20px',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <MapPin size={14} />
            Step 1: Preferred Location
          </div>
        </div>
      </header>

      {/* Main Onboarding Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '24px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}
          >
            <Sparkles size={15} />
            Personalized Higher Education Guidance
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '0.85rem'
            }}
          >
            Discover Opportunities Around You
          </h1>

          <p
            style={{
              fontSize: '1.08rem',
              color: '#475569',
              lineHeight: 1.6,
              margin: '0 auto'
            }}
          >
            Choose your preferred location to discover colleges, universities and educational opportunities near you.
          </p>
        </div>

        {/* Success Modal / Card if save completed */}
        {saveSuccess ? (
          <div
            style={{
              maxWidth: '540px',
              margin: '3rem auto',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
              border: '1px solid #e2e8f0'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Location Confirmed!
            </h2>
            <p style={{ color: '#475569', fontSize: '0.98rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Your default discovery hub is set to <strong>{selectedLocation.displayName}</strong>. Preparing your personalized student guidance dashboard...
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}>
              <Loader2 size={18} className="animate-spin" />
              Entering DISHA Student Guidance Hub...
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 460px) 1fr',
              gap: '2rem',
              alignItems: 'start'
            }}
          >
            {/* Left Column: Search, Presets & Selected Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Search Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    marginBottom: '0.5rem'
                  }}
                >
                  Search City, Locality, District or PIN code
                </label>

                {/* Search Input Box */}
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isSearching ? '#2563eb' : '#94a3b8',
                      pointerEvents: 'none'
                    }}
                  >
                    {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  </div>

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setSearchDropdownOpen(true);
                    }}
                    placeholder="e.g. Kozhikode, Mananchira, 673001, Ernakulam"
                    style={{
                      width: '100%',
                      height: '48px',
                      paddingLeft: '44px',
                      paddingRight: '14px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                  />

                  {/* Autocomplete Dropdown */}
                  {searchDropdownOpen && searchResults.length > 0 && (
                    <div
                      ref={dropdownRef}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.15)',
                        border: '1px solid #cbd5e1',
                        maxHeight: '260px',
                        overflowY: 'auto',
                        zIndex: 100
                      }}
                    >
                      {searchResults.map((loc, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectSearchResult(loc)}
                          style={{
                            padding: '10px 14px',
                            borderBottom: idx < searchResults.length - 1 ? '1px solid #f1f5f9' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'background-color 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                          <MapPin size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {loc.displayName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {[loc.city, loc.district, loc.state, loc.pincode].filter(Boolean).join(', ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Explicit Browser Current Location Button */}
                <div style={{ marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocatingUser}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #bfdbfe',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: isLocatingUser ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isLocatingUser ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Detecting Current Location...
                      </>
                    ) : (
                      <>
                        <Navigation size={16} />
                        Use My Current Location
                      </>
                    )}
                  </button>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem', textAlign: 'center' }}>
                    Requires browser permission. DISHA never tracks your location silently.
                  </div>
                </div>

                {/* Geo Error Warning if permission was denied */}
                {geoError && (
                  <div
                    style={{
                      marginTop: '0.85rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>{geoError}</div>
                  </div>
                )}
              </div>

              {/* Quick Presets for Popular Hubs */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={15} color="#2563eb" />
                  Popular Education Hubs (Click to Pick)
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {POPULAR_EDUCATION_HUBS.map((hub) => {
                    const isSelected = selectedLocation.city?.toLowerCase().includes(hub.name.split('/')[0].toLowerCase().trim());
                    return (
                      <button
                        key={hub.name}
                        type="button"
                        onClick={() => handleSelectPreset(hub)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                          color: isSelected ? '#1d4ed8' : '#334155',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <MapPin size={13} color={isSelected ? '#2563eb' : '#64748b'} />
                        {hub.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Location Summary Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1.5px solid #bfdbfe',
                  backgroundColor: '#f8faff',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb' }}>
                    Selected Education Location
                  </span>
                  {isReverseGeocoding && (
                    <span style={{ fontSize: '0.75rem', color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <RefreshCw size={12} className="animate-spin" /> Updating...
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                  {selectedLocation.displayName || 'Selected Location'}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.75rem 0' }}>
                  {selectedLocation.city && (
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, color: '#1e293b' }}>
                      City: {selectedLocation.city}
                    </span>
                  )}
                  {selectedLocation.district && (
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, color: '#1e293b' }}>
                      District: {selectedLocation.district}
                    </span>
                  )}
                  {selectedLocation.state && (
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, color: '#1e293b' }}>
                      State: {selectedLocation.state}
                    </span>
                  )}
                  {selectedLocation.pincode && (
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: '#e0f2fe', fontSize: '0.75rem', fontWeight: 600, color: '#0369a1' }}>
                      PIN: {selectedLocation.pincode}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Globe size={13} />
                  Coordinates: {selectedLocation.coordinates?.latitude?.toFixed(4)}, {selectedLocation.coordinates?.longitude?.toFixed(4)}
                </div>

                {/* Privacy & Purpose Notice */}
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.76rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    lineHeight: 1.45
                  }}
                >
                  <Info size={15} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    DISHA uses this general area to prioritize nearby colleges, entrance exam centers, and regional admission alerts. Your exact residential address is never requested or stored.
                  </div>
                </div>

                {errorMessage && (
                  <div
                    style={{
                      marginTop: '0.85rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      fontSize: '0.82rem'
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Confirm Location Button */}
                <button
                  type="button"
                  onClick={handleConfirmLocation}
                  disabled={isSaving}
                  style={{
                    width: '100%',
                    marginTop: '1.25rem',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '12px',
                    backgroundColor: '#1e3a8a',
                    color: '#ffffff',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving Preferred Location...
                    </>
                  ) : (
                    <>
                      Confirm My Location
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Map */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Interactive Map Selection
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0' }}>
                    Click anywhere on the map or drag the pin to refine your location.
                  </p>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    backgroundColor: '#f1f5f9',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#475569'
                  }}
                >
                  <MapPin size={13} color="#2563eb" />
                  Live Geocoding Active
                </div>
              </div>

              {/* Map Canvas */}
              <InteractiveLocationMap
                latitude={selectedLocation.coordinates?.latitude || 11.2588}
                longitude={selectedLocation.coordinates?.longitude || 75.7804}
                zoom={12}
                locationName={selectedLocation.displayName}
                onLocationChange={handleMapLocationChange}
                isDraggable={true}
                height="520px"
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.82rem',
                  color: '#475569'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Info size={15} color="#0284c7" />
                  <span>Moving the map automatically updates your locality and district.</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                  Powered by OpenStreetMap & Photon
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LocationOnboarding;

