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
  ArrowRight
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';
import CollegeDetailsModal from './CollegeDetailsModal.jsx';

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
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedSort, setSelectedSort] = useState('default');

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
  }, [search, selectedState, selectedDistrict, selectedType, selectedCourse, selectedSort]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedState('all');
    setSelectedDistrict('all');
    setSelectedType('all');
    setSelectedCourse('all');
    setSelectedSort('default');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedState !== 'all' ||
    selectedDistrict !== 'all' ||
    selectedType !== 'all' ||
    selectedCourse !== 'all' ||
    selectedSort !== 'default';

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
          gap: '1rem',
          backgroundColor: '#ffffff'
        }}
      >
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

          {/* Sort Selector */}
          <div style={{ flex: '0 1 180px' }}>
            <select
              className="form-input"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
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
                  {/* Type, NAAC & Rank */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-violet" style={{ fontSize: '0.68rem' }}>
                      {college.type || 'Higher Education'}
                    </span>
                    {college.naacGrade && (
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                        NAAC {college.naacGrade}
                      </span>
                    )}
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
            maxWidth: '520px',
            margin: '2rem auto',
            backgroundColor: '#ffffff'
          }}
        >
          <Building2 size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            No colleges found for this filter
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            No institutions match your selected location or criteria. Try clearing filters or expanding to all districts.
          </p>
          <button
            onClick={handleClearFilters}
            className="btn-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
          >
            Clear All Filters
          </button>
        </div>
      )}

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

