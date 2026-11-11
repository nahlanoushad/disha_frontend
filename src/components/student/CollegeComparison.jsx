import React, { useState } from 'react';
import {
  Scale,
  X,
  Plus,
  Building2,
  MapPin,
  Award,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import CollegeDetailsModal from './CollegeDetailsModal.jsx';

const CollegeComparison = ({
  comparisonList = [],
  onRemoveFromCompare,
  onNavigateToFinder
}) => {
  const [selectedCollegeForModal, setSelectedCollegeForModal] = useState(null);

  if (!comparisonList || comparisonList.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '3rem auto',
          backgroundColor: '#ffffff',
          animation: 'fadeIn 0.35s ease-out'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            border: '1.5px solid #cbd5e1'
          }}
        >
          <Scale size={30} />
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          No Colleges Added to Comparison
        </h2>

        <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '2rem', lineHeight: 1.6 }}>
          Select up to 3 colleges from the College Finder to compare programs, eligibility, fee ranges, and accreditation side-by-side.
        </p>

        <button
          onClick={onNavigateToFinder}
          className="btn-primary"
          style={{ padding: '0.75rem 1.6rem', fontSize: '0.9rem' }}
        >
          Explore Regional Colleges <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const comparisonAttributes = [
    {
      label: 'Institution Type',
      render: (col) => col.type || 'Information not available'
    },
    {
      label: 'State & District',
      render: (col) =>
        col.district && col.state ? `${col.district}, ${col.state}` : col.state || col.district || 'Information not available'
    },
    {
      label: 'Full Address',
      render: (col) =>
        typeof col.location === 'object' && col.location?.address
          ? col.location.address
          : col.location || 'Information not available'
    },
    {
      label: 'NAAC Accreditation',
      render: (col) =>
        col.naacGrade ? (
          <span className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>
            Grade {col.naacGrade}
          </span>
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Information not available</span>
        )
    },
    {
      label: 'Ranking / Category',
      render: (col) =>
        col.ranking ? (
          <span className="badge badge-amber" style={{ fontSize: '0.78rem' }}>
            {col.ranking}
          </span>
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Information not available</span>
        )
    },
    {
      label: 'Affiliating University',
      render: (col) => col.affiliation || 'Autonomous / Central Board'
    },
    {
      label: 'Established Year',
      render: (col) => (col.establishedYear ? String(col.establishedYear) : 'Information not available')
    },
    {
      label: 'Programs & Courses Offered',
      render: (col) =>
        col.coursesOffered && col.coursesOffered.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {col.coursesOffered.map((c, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.72rem',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  border: '1px solid #e2e8f0'
                }}
              >
                {typeof c === 'object' ? (c.name || c.courseName || JSON.stringify(c)) : c}
              </span>
            ))}
          </div>
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Information not available</span>
        )
    },
    {
      label: 'Minimum Eligibility',
      render: (col) => col.eligibility || 'Information not available'
    },
    {
      label: 'Approximate Fee Range',
      render: (col) =>
        col.feeRange ? (
          <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}>
            {col.feeRange}
          </span>
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Information not available</span>
        )
    },
    {
      label: 'Admission Procedure',
      render: (col) => col.admissionProcess || 'Information not available'
    },
    {
      label: 'Campus Facilities',
      render: (col) =>
        col.facilities && col.facilities.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {col.facilities.map((f, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.72rem',
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  fontWeight: 600
                }}
              >
                ✓ {f}
              </span>
            ))}
          </div>
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Information not available</span>
        )
    },
    {
      label: 'Official Website',
      render: (col) =>
        col.website ? (
          <a
            href={col.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#1d4ed8',
              fontWeight: 700,
              fontSize: '0.82rem',
              textDecoration: 'none'
            }}
          >
            Visit Official Portal <ExternalLink size={13} />
          </a>
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Information not available</span>
        )
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            College Comparison Matrix
          </h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>
            Side-by-side factual evaluation of verified academic offerings, fee structures, and campus accreditations.
          </p>
        </div>

        <button
          onClick={onNavigateToFinder}
          className="btn-secondary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> Add More Colleges
        </button>
      </div>

      {/* Comparison Matrix Table */}
      <div
        className="glass-panel"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '2rem'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            minWidth: '700px'
          }}
        >
          {/* Table Header: College Cards */}
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <th
                style={{
                  padding: '1.5rem',
                  width: '220px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Attributes
              </th>

              {comparisonList.map((col) => (
                <th
                  key={col._id}
                  style={{
                    padding: '1.5rem',
                    width: `${Math.floor(75 / comparisonList.length)}%`,
                    verticalAlign: 'top',
                    borderLeft: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                      {col.name}
                    </h3>
                    <button
                      onClick={() => onRemoveFromCompare(col._id)}
                      title="Remove from comparison"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <span className="badge badge-violet" style={{ fontSize: '0.68rem' }}>
                      {col.type || 'Accredited'}
                    </span>
                    {col.naacGrade && (
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                        NAAC {col.naacGrade}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedCollegeForModal(col)}
                    className="btn-secondary"
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.75rem',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    View Details
                  </button>
                </th>
              ))}

              {/* Slot to add 2nd or 3rd college */}
              {comparisonList.length < 3 && (
                <th
                  style={{
                    padding: '1.5rem',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                    borderLeft: '1px dashed #cbd5e1',
                    backgroundColor: '#fbfaff'
                  }}
                >
                  <div
                    onClick={onNavigateToFinder}
                    style={{
                      padding: '2rem 1rem',
                      borderRadius: '12px',
                      border: '1.5px dashed #c4b5fd',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#1d4ed8'
                    }}
                  >
                    <Plus size={24} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Add College</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      ({comparisonList.length}/3 slots used)
                    </span>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body: Attributes */}
          <tbody>
            {comparisonAttributes.map((attr, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfaff'
                }}
              >
                <td
                  style={{
                    padding: '1.15rem 1.5rem',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    color: '#0f172a',
                    verticalAlign: 'top',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  {attr.label}
                </td>

                {comparisonList.map((col) => (
                  <td
                    key={col._id}
                    style={{
                      padding: '1.15rem 1.5rem',
                      fontSize: '0.85rem',
                      color: '#475569',
                      verticalAlign: 'top',
                      borderLeft: '1px solid #e2e8f0',
                      lineHeight: 1.5
                    }}
                  >
                    {attr.render(col)}
                  </td>
                ))}

                {comparisonList.length < 3 && (
                  <td style={{ borderLeft: '1px dashed #e2e8f0', backgroundColor: '#fcfaff' }} />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* College Details Modal */}
      {selectedCollegeForModal && (
        <CollegeDetailsModal
          college={selectedCollegeForModal}
          onClose={() => setSelectedCollegeForModal(null)}
          onToggleCompare={() => onRemoveFromCompare(selectedCollegeForModal._id)}
          isInComparison={true}
        />
      )}

    </div>
  );
};

export default CollegeComparison;
