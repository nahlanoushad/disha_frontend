import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Award,
  Globe,
  Mail,
  Phone,
  Scale,
  Calendar,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

const CollegeDetailsModal = ({ college, onClose, onToggleCompare, isInComparison, onSelectCourse }) => {
  if (!college) return null;

  const locationStr =
    typeof college.location === 'object' && college.location !== null
      ? college.location.address || `${college.district || ''}, ${college.state || ''}`
      : college.location || `${college.district || ''}, ${college.state || ''}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(30, 16, 53, 0.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px -10px rgba(124, 58, 237, 0.25)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1.5px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #cbd5e1',
                flexShrink: 0
              }}
            >
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>
                  {college.type || 'Higher Education'}
                </span>
                {college.naacGrade && (
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                    NAAC Grade {college.naacGrade}
                  </span>
                )}
                {college.ranking && (
                  <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                    {college.ranking}
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {college.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Quick Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              backgroundColor: '#fbfaff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Location / District
              </span>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} color="#1d4ed8" />
                {college.district ? `${college.district}, ${college.state || 'India'}` : locationStr}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Affiliation
              </span>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {college.affiliation || 'Autonomous / Recognized Board'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Established Year
              </span>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {college.establishedYear || 'Information not available'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Verification Status
              </span>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} />
                {college.verificationStatus || 'Verified'}
              </p>
            </div>
          </div>

          {/* Section 1: Overview */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={16} color="#1d4ed8" /> About Institution
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              {college.description || 'Verified premier higher education institution providing recognized undergraduate and postgraduate degrees with modern campus infrastructure.'}
            </p>
            {typeof college.location === 'object' && college.location?.address && (
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                📍 <strong>Address:</strong> {college.location.address}
              </p>
            )}
          </div>

          {/* Section 2: Courses Offered */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} color="#1d4ed8" /> Programs & Courses Offered
            </h3>

            {college.coursesOffered && college.coursesOffered.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {college.coursesOffered.map((crs, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    🎓 {typeof crs === 'object' ? (crs.name || crs.courseName || JSON.stringify(crs)) : crs}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Information not available.</p>
            )}
          </div>

          {/* Section 3: Admission & Eligibility */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                Eligibility Criteria
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                {college.eligibility || 'Candidate must have passed Higher Secondary (10+2) with corresponding stream requirements as specified by the affiliating board.'}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                Admission Procedure
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                {college.admissionProcess || 'Centralized state/national allotment counseling or institutional merit application.'}
              </p>
            </div>
          </div>

          {/* Section 4: Fee Structure */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Fee Structure & Subsidies
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
              {college.feeRange || 'Information not available (Refer to official prospectus)'}
            </p>
          </div>

          {/* Section 5: Campus Facilities */}
          {college.facilities && college.facilities.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
                Campus Facilities & Amenities
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {college.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      backgroundColor: '#f3f4f6',
                      color: '#4b5563',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Official Contact Information */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              alignItems: 'center'
            }}
          >
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#1d4ed8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <Globe size={15} /> Official Website <ExternalLink size={13} />
              </a>
            )}

            {college.contactEmail && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.82rem' }}>
                <Mail size={15} color="#1d4ed8" /> {college.contactEmail}
              </span>
            )}

            {college.contactPhone && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.82rem' }}>
                <Phone size={15} color="#1d4ed8" /> {college.contactPhone}
              </span>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 2rem',
            borderTop: '1.5px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(college)}
              className={isInComparison ? 'btn-secondary' : 'btn-primary'}
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
            >
              {isInComparison ? (
                <>
                  <Check size={16} color="#059669" /> In Comparison List
                </>
              ) : (
                <>
                  <Scale size={16} /> Add to Compare
                </>
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem', marginLeft: 'auto' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailsModal;
