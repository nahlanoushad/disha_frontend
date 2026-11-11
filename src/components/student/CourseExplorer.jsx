import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  X,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import studentApi from '../../services/studentApi.js';
import CourseDetailsModal from './CourseDetailsModal.jsx';

const CourseExplorer = ({ onSelectCollege }) => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');

  // Selected course for detail modal
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Load categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await studentApi.getCategories();
        if (res?.data?.categories) {
          setCategories(res.data.categories);
        } else if (Array.isArray(res)) {
          setCategories(res);
        }
      } catch (err) {
        console.warn('Could not load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch courses with debounce on search
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedDuration !== 'all') params.duration = selectedDuration;

      const res = await studentApi.getCourses(params);
      if (res?.data?.courses) {
        setCourses(res.data.courses);
      } else if (Array.isArray(res)) {
        setCourses(res);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Could not retrieve courses from catalog. Please try again.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedDuration]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedDuration('all');
  };

  const hasActiveFilters = search.trim() !== '' || selectedCategory !== 'all' || selectedDuration !== 'all';

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Undergraduate Course Explorer
        </h1>
        <p style={{ color: '#475569', fontSize: '0.9rem' }}>
          Discover verified degree programs, eligibility criteria, career opportunities, and offering colleges.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by course name, eligibility, career..."
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

        {/* Stream / Category Filter */}
        <div style={{ flex: '0 1 220px' }}>
          <select
            className="form-input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            <option value="all">All Academic Streams</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div style={{ flex: '0 1 170px' }}>
          <select
            className="form-input"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            <option value="all">All Durations</option>
            <option value="3 Years">3 Years</option>
            <option value="4 Years">4 Years</option>
            <option value="5 Years">5 Years</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="btn-secondary"
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
          >
            <X size={15} /> Clear Filters
          </button>
        )}
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
          {loading ? (
            'Searching catalog...'
          ) : (
            `Showing ${courses.length} ${courses.length === 1 ? 'course' : 'courses'} found`
          )}
        </p>

        <button
          onClick={fetchCourses}
          title="Refresh catalog"
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

      {/* Error Notice */}
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
                height: '240px',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ height: '20px', width: '60%', backgroundColor: '#f3f4f6', borderRadius: '6px' }} />
              <div style={{ height: '14px', width: '90%', backgroundColor: '#f3f4f6', borderRadius: '6px' }} />
              <div style={{ height: '14px', width: '75%', backgroundColor: '#f3f4f6', borderRadius: '6px' }} />
              <div style={{ height: '36px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '8px' }} />
            </div>
          ))}
        </div>
      )}

      {/* Course Grid */}
      {!loading && courses.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {courses.map((course) => (
            <div
              key={course._id}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                {/* Category & Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>
                    {course.category?.name || 'General'}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                    ⏳ {course.duration || '3-4 Years'}
                  </span>
                </div>

                {/* Course Name */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {course.name}
                </h3>

                {/* Eligibility */}
                <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  <strong>Eligibility:</strong> {course.eligibility || '10+2 from recognized board'}
                </p>

                {/* Fee Range preview if available */}
                {course.feeStructure && (
                  <p style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, marginBottom: '0.75rem' }}>
                    💰 {course.feeStructure}
                  </p>
                )}

                {/* Career Opportunities Preview Tags */}
                {course.careerOpportunities && course.careerOpportunities.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {course.careerOpportunities.slice(0, 2).map((opp, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: '#f8fafc',
                          color: '#1d4ed8',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: 600,
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        {opp}
                      </span>
                    ))}
                    {course.careerOpportunities.length > 2 && (
                      <span style={{ fontSize: '0.7rem', color: '#64748b', alignSelf: 'center' }}>
                        +{course.careerOpportunities.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedCourse(course)}
                className="btn-secondary"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  marginTop: '0.5rem'
                }}
              >
                View Full Details <ChevronRight size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && courses.length === 0 && (
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
          <BookOpen size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            No courses match your search
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Try adjusting your keyword or clearing selected stream/duration filters to view all courses.
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

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onSelectCollege={onSelectCollege}
        />
      )}

    </div>
  );
};

export default CourseExplorer;

