import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Scale,
  Award,
  ChevronRight,
  RefreshCw,
  X,
  AlertCircle,
  Check,
  ArrowRight,
  Globe,
  Navigation,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext.jsx';
import studentApi from '../../services/studentApi.js';
import CollegeDetailsModal from './CollegeDetailsModal.jsx';
import LocationChangeModal from './LocationChangeModal.jsx';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod'
];

const COLLEGE_TYPES = [
  'Government',
  'Aided / Autonomous',
  'Govt. Controlled Self-Financing',
  'Institute of National Importance',
  'State University',
  'Private'
];

const POPULAR_COURSES = [
  'B.Tech Computer Science and Engineering',
  'BCA',
  'B.Sc Computer Science',
  'MBBS',
  'B.Pharm',
  'BBA',
  'B.Com',
  'B.Arch'
];

const CollegeFinder = ({
  comparisonList = [],
  onToggleCompare,
  onNavigateToCompare,
  initialSelectedCollege = null
}) => {
  const { student, refreshProfile } = useStudentAuth();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Student's saved location as baseline
  const savedLocationBaseline = student?.location?.displayName
    ? student.location
    : {
        displayName: `${student?.location?.city || 'Kozhikode'}, ${student?.location?.state || 'Kerala'}`,
        city: student?.location?.city || 'Kozhikode',
        district: student?.location?.district || 'Kozhikode',
        state: student?.location?.state || 'Kerala',
        coordinates: {
          latitude: student?.location?.coordinates?.latitude ?? 11.2588,
          longitude: student?.location?.coordinates?.longitude ?? 75.7804
        }
      };

  // Active search location (can be temporary exploration or saved default)
  const [searchLocation, setSearchLocation] = useState(savedLocationBaseline);
  const [isTemporaryLocation, setIsTemporaryLocation] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [maxDistance, setMaxDistance] = useState('all');
  const [isSavingDefault, setIsSavingDefault] = useState(false);

  // Sync baseline if student profile changes externally
  useEffect(() => {
    if (student?.location && !isTemporaryLocation) {
      setSearchLocation({
        displayName: student.location.displayName || `${student.location.city || 'Kozhikode'}, ${student.location.state || 'Kerala'}`,
        city: student.location.city || 'Kozhikode',
        district: student.location.district || 'Kozhikode',
        state: student.location.state || 'Kerala',
        coordinates: {
          latitude: student.location.coordinates?.latitude ?? 11.2588,
          longitude: student.location.coordinates?.longitude ?? 75.7804
        }
      });
    }
  }, [student?.location, isTemporaryLocation]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedSort, setSelectedSort] = useState('distance'); // Default to proximity sorting when coordinates available

  // Selected college for modal view
  const [selectedCollege, setSelectedCollege] = useState(initialSelectedCollege);

  const fetchColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        format: 'envelope'
      };
      if (search.trim()) params.search = search.trim();
      if (selectedState !== 'all') params.state = selectedState;
      if (selectedDistrict !== 'all') params.district = selectedDistrict;
      if (selectedType !== 'all') params.type = selectedType;
      if (selectedCourse !== 'all') params.course = selectedCourse;
      if (selectedSort !== 'default') params.sort = selectedSort;

      // Pass geographical coordinates & reference for proximity calculation
      if (searchLocation?.coordinates?.latitude) {
        params.lat = searchLocation.coordinates.latitude;
        params.lng = searchLocation.coordinates.longitude;
      }
      if (searchLocation?.city) params.studentCity = searchLocation.city;
      if (searchLocation?.district) params.studentDistrict = searchLocation.district;
      if (searchLocation?.state) params.studentState = searchLocation.state;
      if (maxDistance !== 'all') params.maxDistance = maxDistance;

      const res = await studentApi.getColleges(params);
      if (res?.data?.colleges) {
        setColleges(res.data.colleges);
      } else if (Array.isArray(res)) {
        setColleges(res);
      } else {
        setColleges([]);
      }
    } catch (err) {
      console.error('Failed to fetch colleges:', err);
      setError('Could not retrieve colleges list. Please try again.');
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchColleges();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedState, selectedDistrict, selectedType, selectedCourse, selectedSort, searchLocation, maxDistance]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedState('all');
    setSelectedDistrict('all');
    setSelectedType('all');
    setSelectedCourse('all');
    setSelectedSort('distance');
    setMaxDistance('all');
  };

  // Switch search location temporarily (does NOT overwrite saved default in MongoDB)
  const handleSelectTemporaryLocation = (newLoc) => {
    setSearchLocation(newLoc);
    setIsTemporaryLocation(true);
    // If new location has specific state/district, we can align state filter or keep all
  };

  // Reset search location back to student's saved default
  const handleResetToSavedDefault = () => {
    if (student?.location) {
      setSearchLocation({
        displayName: student.location.displayName || `${student.location.city || 'Kozhikode'}, ${student.location.state || 'Kerala'}`,
        city: student.location.city || 'Kozhikode',
        district: student.location.district || 'Kozhikode',
        state: student.location.state || 'Kerala',
        coordinates: {
          latitude: student.location.coordinates?.latitude ?? 11.2588,
          longitude: student.location.coordinates?.longitude ?? 75.7804
        }
      });
    }
    setIsTemporaryLocation(false);
  };

  // Explicitly promote the temporary search location to student's permanent saved default in MongoDB
  const handleSetAsPermanentDefault = async () => {
    setIsSavingDefault(true);
    try {
      await studentApi.updateLocation({
        displayName: searchLocation.displayName,
        locality: searchLocation.locality || '',
        city: searchLocation.city || '',
        district: searchLocation.district || '',
        state: searchLocation.state || '',
        country: searchLocation.country || 'India',
        pincode: searchLocation.pincode || '',
        coordinates: searchLocation.coordinates,
        source: 'promoted_from_search'
      });
      setIsTemporaryLocation(false);
      await refreshProfile();
    } catch (err) {
      console.error('Failed to set default location:', err);
    } finally {
      setIsSavingDefault(false);
    }
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedState !== 'all' ||
    selectedDistrict !== 'all' ||
    selectedType !== 'all' ||
    selectedCourse !== 'all' ||
    selectedSort !== 'distance' ||
    maxDistance !== 'all' ||
    isTemporaryLocation;

  const isCollegeInComparison = (collegeId) => {
    return comparisonList.some((c) => c._id === collegeId);
  };

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out', position: 'relative' }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Regional College Finder
        </h1>
        <p style={{ color: '#475569', fontSize: '0.9rem' }}>
          Explore verified government, autonomous, and accredited institutions by district, courses, and affiliation.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.15rem',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Geographical Reference Banner */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: isTemporaryLocation ? '#fffbeb' : '#f0fdf4',
            border: isTemporaryLocation ? '1.5px solid #fde68a' : '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: isTemporaryLocation ? '#fef3c7' : '#dcfce7',
                color: isTemporaryLocation ? '#d97706' : '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <MapPin size={18} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  Showing colleges near <span style={{ color: '#1d4ed8' }}>{searchLocation.displayName}</span>
                </span>
                {isTemporaryLocation && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      fontWeight: 700,
                      border: '1px solid #fde68a'
                    }}
                  >
                    Temporary Search Location
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                Proximity sorting active. Institutions are prioritized by distance from your reference coordinates.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {isTemporaryLocation && (
              <>
                <button
                  type="button"
                  onClick={handleResetToSavedDefault}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Reset to Saved Default
                </button>

                <button
                  type="button"
                  onClick={handleSetAsPermanentDefault}
                  disabled={isSavingDefault}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: isSavingDefault ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <CheckCircle2 size={13} />
                  {isSavingDefault ? 'Saving...' : 'Set as My Default Location'}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Navigation size={13} />
              Change Location
            </button>
          </div>
        </div>

        {/* Search Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by college name, city, district..."
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.75rem', paddingRight: search ? '2.5rem' : '1rem' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Distance Filter Selector */}
          <div style={{ flex: '0 1 180px' }}>
            <select
              className="form-input"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
            >
              <option value="all">Distance: All Distances</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
              <option value="100">Within 100 km</option>
              <option value="200">Within 200 km</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ flex: '0 1 180px' }}>
            <select
              className="form-input"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              <option value="distance">Sort: Nearest First (Proximity)</option>
              <option value="default">Sort: Default</option>
              <option value="name_asc">Name (A to Z)</option>
              <option value="name_desc">Name (Z to A)</option>
              <option value="ranking">Ranking / Tier</option>
            </select>
          </div>
        </div>

        {/* Region & Criteria Filter Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          
          {/* State Filter */}
          <div>
            <select
              className="form-input"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="all">All States</option>
              <option value="Kerala">Kerala</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              className="form-input"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="all">All Districts</option>
              {KERALA_DISTRICTS.map((dst) => (
                <option key={dst} value={dst}>{dst}</option>
              ))}
            </select>
          </div>

          {/* College Type Filter */}
          <div>
            <select
              className="form-input"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="all">All College Types</option>
              {COLLEGE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Course Offered Filter */}
          <div>
            <select
              className="form-input"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="all">All Courses Offered</option>
              {POPULAR_COURSES.map((crs) => (
                <option key={crs} value={crs}>{crs}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Clear Filters Action */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={handleClearFilters}
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
            >
              <X size={14} /> Clear Active Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
          {loading ? (
            'Searching directory...'
          ) : (
            `Showing ${colleges.length} ${colleges.length === 1 ? 'institution' : 'institutions'} found`
          )}
        </p>

        <button
          onClick={fetchColleges}
          title="Refresh directory"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#1d4ed8',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <RefreshCw size={14} className={loading ? 'spinner' : ''} /> Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            borderRadius: '12px',
            border: '1px solid #fee2e2',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="glass-panel"
              style={{
                height: '260px',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ height: '22px', width: '70%', backgroundColor: '#f3f4f6', borderRadius: '6px' }} />
              <div style={{ height: '14px', width: '45%', backgroundColor: '#f3f4f6', borderRadius: '6px' }} />
              <div style={{ height: '36px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '6px' }} />
              <div style={{ height: '40px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '8px' }} />
            </div>
          ))}
        </div>
      )}

      {/* College Grid */}
      {!loading && colleges.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {colleges.map((college) => {
            const locStr =
              typeof college.location === 'object' && college.location !== null
                ? college.location.address || `${college.district || ''}, ${college.state || ''}`
                : college.location || `${college.district || ''}, ${college.state || ''}`;

            const inCompare = isCollegeInComparison(college._id);

            return (
              <div
                key={college._id}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  border: inCompare ? '2px solid #1d4ed8' : '1px solid #e2e8f0'
                }}
              >
                <div>
                  {/* Type, NAAC, Distance & Proximity Tier */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-violet" style={{ fontSize: '0.68rem' }}>
                        {college.type || 'Higher Education'}
                      </span>
                      {college.naacGrade && (
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                          NAAC {college.naacGrade}
                        </span>
                      )}
                    </div>

                    {/* Proximity Distance & Tier Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {college.distanceKm !== null && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <MapPin size={11} /> {college.distanceKm} km away
                        </span>
                      )}
                      {college.proximityTier === 'nearby' && (
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                          Nearby Hub
                        </span>
                      )}
                      {college.proximityTier === 'district' && (
                        <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                          In-District
                        </span>
                      )}
                      {college.proximityTier === 'state' && (
                        <span style={{ padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.68rem', fontWeight: 600 }}>
                          In-State
                        </span>
                      )}
                    </div>
                  </div>

                  {/* College Name */}
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                    {college.name}
                  </h3>

                  {/* Location with Pin */}
                  <p style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.65rem' }}>
                    <MapPin size={13} color="#1d4ed8" />
                    {locStr}
                  </p>

                  {/* Short Description */}
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                    {college.description || `Accredited ${college.type || ''} institution offering recognized degree programs.`}
                  </p>

                  {/* Courses Offered Preview */}
                  {college.coursesOffered && college.coursesOffered.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                      {college.coursesOffered.slice(0, 3).map((crs, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            fontWeight: 600,
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          {crs}
                        </span>
                      ))}
                      {college.coursesOffered.length > 3 && (
                        <span style={{ fontSize: '0.7rem', color: '#64748b', alignSelf: 'center' }}>
                          +{college.coursesOffered.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => setSelectedCollege(college)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    View Details
                  </button>

                  {onToggleCompare && (
                    <button
                      onClick={() => onToggleCompare(college)}
                      className={inCompare ? 'btn-primary' : 'btn-secondary'}
                      style={{
                        padding: '0.55rem 0.85rem',
                        fontSize: '0.8rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: inCompare ? '#1d4ed8' : '#ffffff'
                      }}
                      title={inCompare ? 'Remove from compare' : 'Add to compare'}
                    >
                      {inCompare ? <Check size={14} /> : <Scale size={14} />}
                      {inCompare ? 'Comparing' : 'Compare'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && colleges.length === 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            maxWidth: '560px',
            margin: '2rem auto',
            backgroundColor: '#ffffff'
          }}
        >
          <Building2 size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            No colleges match your current proximity or filter
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {maxDistance !== 'all'
              ? `There are no verified colleges within ${maxDistance} km of ${searchLocation.displayName}. You can expand your search distance, explore nearby districts, or search all of India.`
              : `No institutions match your selected search criteria around ${searchLocation.displayName}. Try clearing your filters or changing your search location.`}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {maxDistance !== 'all' && (
              <button
                onClick={() => setMaxDistance('all')}
                className="btn-secondary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
              >
                Expand to All Distances
              </button>
            )}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Navigation size={14} /> Change Search Location
            </button>
            <button
              onClick={handleClearFilters}
              className="btn-primary"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Location Change Modal */}
      <LocationChangeModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={searchLocation}
        onSelectTemporary={handleSelectTemporaryLocation}
        onSavePermanent={async (newLoc) => {
          setSearchLocation(newLoc);
          setIsTemporaryLocation(false);
          await refreshProfile();
        }}
        title="Explore Colleges in Another Location"
      />

      {/* Sticky Bottom Comparison Floating Bar (Appears when 1-3 colleges are selected) */}
      {comparisonList.length > 0 && onNavigateToCompare && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: '0 8px 30px rgba(30, 16, 53, 0.35)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Scale size={18} color="#c4b5fd" />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              {comparisonList.length} {comparisonList.length === 1 ? 'College' : 'Colleges'} Selected (Max 3)
            </span>
          </div>

          <button
            onClick={onNavigateToCompare}
            className="btn-primary"
            style={{
              padding: '0.45rem 1.1rem',
              fontSize: '0.82rem',
              backgroundColor: '#1d4ed8',
              borderRadius: '9999px'
            }}
          >
            Compare Now <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* College Details Modal */}
      {selectedCollege && (
        <CollegeDetailsModal
          college={selectedCollege}
          onClose={() => setSelectedCollege(null)}
          onToggleCompare={onToggleCompare}
          isInComparison={isCollegeInComparison(selectedCollege._id)}
        />
      )}

    </div>
  );
};

export default CollegeFinder;

