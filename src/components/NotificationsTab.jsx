import React, { useState, useMemo } from 'react';
import {
  Bell,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Tag
} from 'lucide-react';

/* =========================================================
   INITIAL SAMPLE NOTIFICATIONS DATA
   Realistic notifications tailored for DISHA Higher Education
   ========================================================= */
const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-101',
    title: 'KEAM 2026 Phase 1 Option Registration Opened',
    message: 'The Commissioner for Entrance Examinations (CEE) has officially enabled the online option registration window for Engineering, Architecture & Pharmacy admissions.',
    category: 'Entrance Exams',
    targetAudience: 'Engineering Aspirants',
    audienceType: 'Segment',
    date: '2026-11-10T09:30:00Z',
    status: 'Sent',
    readStatus: 'Read',
    priority: 'High',
    deliveredCount: 1420
  },
  {
    id: 'NOTIF-102',
    title: 'NEET UG 2026 Information Bulletin & Syllabus Released',
    message: 'National Testing Agency has released the updated syllabus, revised exam scheme, and eligibility criteria for medical admissions.',
    category: 'Medical Admissions',
    targetAudience: 'Medical Aspirants',
    audienceType: 'Segment',
    date: '2026-11-09T14:15:00Z',
    status: 'Sent',
    readStatus: 'Read',
    priority: 'High',
    deliveredCount: 1180
  },
  {
    id: 'NOTIF-103',
    title: 'AI-Powered Career Aptitude Assessment Now Live',
    message: 'Students can now take the comprehensive 25-question DISHA psychometric aptitude test to discover top 5 matching academic disciplines.',
    category: 'Guidance & Counseling',
    targetAudience: 'All Students',
    audienceType: 'All',
    date: '2026-11-08T11:00:00Z',
    status: 'Sent',
    readStatus: 'Read',
    priority: 'Normal',
    deliveredCount: 3420
  },
  {
    id: 'NOTIF-104',
    title: 'Higher Secondary Model Examination Timetable Published',
    message: 'Directorate of General Education (DHSE) has released the time table for Plus Two model practicals and theory examinations.',
    category: 'Academic Alert',
    targetAudience: 'Plus Two Students',
    audienceType: 'Segment',
    date: '2026-11-07T16:45:00Z',
    status: 'Sent',
    readStatus: 'Unread',
    priority: 'Normal',
    deliveredCount: 2210
  },
  {
    id: 'NOTIF-105',
    title: 'Post-Matric & Central Sector Scholarship Verification Deadline',
    message: 'Reminder for all higher education scholarship applicants to complete institutional e-KYC and bank seeding verification before November 20.',
    category: 'Scholarships',
    targetAudience: 'All Students',
    audienceType: 'All',
    date: '2026-11-06T10:20:00Z',
    status: 'Sent',
    readStatus: 'Unread',
    priority: 'High',
    deliveredCount: 3420
  },
  {
    id: 'NOTIF-106',
    title: 'Autonomous Colleges Seat Matrix & Cutoffs Updated',
    message: 'Seat availability, category-wise NAAC ratings, and historic last-rank cutoffs for premier arts & science colleges have been updated in DISHA.',
    category: 'College Catalog',
    targetAudience: 'Arts & Science Aspirants',
    audienceType: 'Segment',
    date: '2026-11-05T08:00:00Z',
    status: 'Sent',
    readStatus: 'Read',
    priority: 'Normal',
    deliveredCount: 890
  },
  {
    id: 'NOTIF-107',
    title: 'Live Guidance Webinar: Navigating CUET 2027 Admissions',
    message: 'Join premier academicians and counseling experts this Saturday at 6:00 PM for an interactive breakdown of central university entrance tests.',
    category: 'Guidance & Counseling',
    targetAudience: 'All Students',
    audienceType: 'All',
    date: '2026-11-04T12:30:00Z',
    status: 'Sent',
    readStatus: 'Unread',
    priority: 'Low',
    deliveredCount: 3420
  }
];

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 5;

  // Feedback banner state
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  // Modal states
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Send Notification Form State
  const initialFormState = {
    title: '',
    message: '',
    category: 'Entrance Exams',
    targetAudience: 'All Students',
    actionUrl: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to show temporary feedback banner
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: null, message: '' });
    }, 4500);
  };

  // Date formatter matching StudentsTab convention
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = notifications.length;
    const sent = notifications.filter(n => n.status === 'Sent').length;
    const unread = notifications.filter(n => n.readStatus === 'Unread').length;
    return { total, sent, unread };
  }, [notifications]);

  // Categories list for filter
  const categoriesList = useMemo(() => {
    const set = new Set(notifications.map(n => n.category));
    return Array.from(set);
  }, [notifications]);

  // Filtered and searched data
  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query) ||
        item.targetAudience.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === 'all' || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'Sent' && item.status === 'Sent') ||
        (statusFilter === 'Unread' && item.readStatus === 'Unread');

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [notifications, search, categoryFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / limit));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredNotifications.slice(start, start + limit);
  }, [filteredNotifications, page, limit]);

  // Handlers for pagination
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Open & Close View Details Modal
  const handleOpenViewModal = (notification) => {
    setSelectedNotification(notification);
    setIsViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedNotification(null);
  };

  // Open & Close Delete Modal
  const handleOpenDeleteModal = (notification) => {
    setSelectedNotification(notification);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedNotification(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedNotification) {
      setNotifications(prev => prev.filter(n => n.id !== selectedNotification.id));
      showFeedback('success', `Notification "${selectedNotification.title}" deleted successfully.`);
      handleCloseDeleteModal();
    }
  };

  // Handle Send Notification Modal Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      showFeedback('error', 'Please provide both notification title and message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newNotification = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        title: formData.title.trim(),
        message: formData.message.trim(),
        category: formData.category,
        targetAudience: 'All Students',
        audienceType: 'All',
        date: new Date().toISOString(),
        status: 'Sent',
        readStatus: 'Unread',
        deliveredCount: 3420
      };

      setNotifications(prev => [newNotification, ...prev]);
      setIsSubmitting(false);
      setIsSendModalOpen(false);
      setFormData(initialFormState);
      setPage(1);
      showFeedback('success', `Push notification "${newNotification.title}" broadcasted successfully!`);
    }, 600);
  };

  return (
    <div>
      {/* 1. PAGE HEADER & SUBTITLE */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#1e1035',
                letterSpacing: '-0.02em'
              }}
            >
              Notifications
            </h2>
            <span
              className="badge badge-violet"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
            >
              FCM Broadcast
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#7c6f93', marginTop: '0.2rem' }}>
            Manage announcements and student notifications.
          </p>
        </div>

        {/* 4. VIOLET SEND NOTIFICATION BUTTON */}
        <button
          onClick={() => {
            setFormData(initialFormState);
            setIsSendModalOpen(true);
          }}
          className="btn-primary"
          style={{
            padding: '0.65rem 1.25rem',
            fontSize: '0.88rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Send size={16} />
          <span>Send Notification</span>
        </button>
      </div>

      {/* FEEDBACK BANNERS */}
      {feedback.type === 'success' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.8rem 1.2rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#059669',
            fontSize: '0.85rem',
            fontWeight: 500
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedback.message}</span>
        </div>
      )}

      {feedback.type === 'error' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.8rem 1.2rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#e11d48',
            fontSize: '0.85rem',
            fontWeight: 500
          }}
        >
          <AlertCircle size={18} />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 3. THREE SUMMARY CARDS (Total, Sent, Unread) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* CARD 1: Total Notifications */}
        <div
          className="glass-panel glass-panel-hover"
          style={{
            padding: '1.35rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#7c6f93',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              Total Notifications
            </span>
            <div
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#1e1035',
                marginTop: '0.35rem',
                lineHeight: 1.1
              }}
            >
              {summaryMetrics.total}
            </div>
            <p style={{ fontSize: '0.74rem', color: '#7c6f93', marginTop: '0.35rem' }}>
              All broadcasts & system alerts
            </p>
          </div>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#f5f3ff',
              border: '1px solid #ddd6fe',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(124, 58, 237, 0.12)'
            }}
          >
            <Bell size={22} />
          </div>
        </div>

        {/* CARD 2: Sent Notifications */}
        <div
          className="glass-panel glass-panel-hover"
          style={{
            padding: '1.35rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#7c6f93',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              Sent Notifications
            </span>
            <div
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#059669',
                marginTop: '0.35rem',
                lineHeight: 1.1
              }}
            >
              {summaryMetrics.sent}
            </div>
            <p style={{ fontSize: '0.74rem', color: '#059669', marginTop: '0.35rem', fontWeight: 600 }}>
              100% Delivery completion
            </p>
          </div>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(5, 150, 105, 0.12)'
            }}
          >
            <Send size={22} />
          </div>
        </div>

        {/* CARD 3: Unread Notifications */}
        <div
          className="glass-panel glass-panel-hover"
          style={{
            padding: '1.35rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#7c6f93',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              Unread Notifications
            </span>
            <div
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#d97706',
                marginTop: '0.35rem',
                lineHeight: 1.1
              }}
            >
              {summaryMetrics.unread}
            </div>
            <p style={{ fontSize: '0.74rem', color: '#7c6f93', marginTop: '0.35rem' }}>
              Pending student views
            </p>
          </div>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(217, 119, 6, 0.12)'
            }}
          >
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* 5. SEARCH & FILTER TOOLBAR */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        {/* Search Bar */}
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#7c6f93'
            }}
          />
          <input
            type="text"
            placeholder="Search by title, message, category or audience..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              width: '100%',
              padding: '0.62rem 1rem 0.62rem 2.5rem',
              borderRadius: '8px',
              border: '1px solid #ede9fe',
              backgroundColor: '#fbfaff',
              fontSize: '0.85rem',
              color: '#1e1035',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
            onBlur={(e) => (e.target.style.borderColor = '#ede9fe')}
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
              style={{
                position: 'absolute',
                right: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#7c6f93',
                padding: '0.2rem'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tag size={15} style={{ color: '#7c6f93' }} />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '0.62rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #ede9fe',
              backgroundColor: '#fbfaff',
              fontSize: '0.82rem',
              color: '#1e1035',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} style={{ color: '#7c6f93' }} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '0.62rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #ede9fe',
              backgroundColor: '#fbfaff',
              fontSize: '0.82rem',
              color: '#1e1035',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Sent">Sent (Delivered)</option>
            <option value="Unread">Unread by Students</option>
          </select>
        </div>
      </div>

      {/* 6. NOTIFICATION HISTORY TABLE */}
      <div
        className="glass-panel"
        style={{
          overflowX: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {paginatedData.length === 0 ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#7c6f93' }}>
            <Bell size={42} style={{ margin: '0 auto 1rem', opacity: 0.4, color: '#7c3aed' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e1035', marginBottom: '0.35rem' }}>
              No notifications found
            </h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto' }}>
              {search || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'No notifications match your current search query or active filters.'
                : 'No announcements have been broadcasted yet. Click "Send Notification" to create your first broadcast.'}
            </p>
          </div>
        ) : (
          <>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.85rem'
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1.5px solid #ede9fe',
                    color: '#7c6f93',
                    backgroundColor: '#faf5ff'
                  }}
                >
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Title</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, minWidth: '220px' }}>Message</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Target Audience</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #ede9fe',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#faf5ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Title */}
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#1e1035' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: item.readStatus === 'Unread' ? '#d97706' : '#7c3aed',
                            flexShrink: 0
                          }}
                          title={item.readStatus === 'Unread' ? 'Unread by student' : 'Delivered & Seen'}
                        />
                        <span style={{ fontSize: '0.88rem' }}>{item.title}</span>
                      </div>
                    </td>

                    {/* Message */}
                    <td style={{ padding: '0.9rem 1rem', color: '#5b5273' }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.82rem',
                          lineHeight: 1.45,
                          maxWidth: '320px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={item.message}
                      >
                        {item.message}
                      </p>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span className="badge badge-violet" style={{ fontSize: '0.72rem' }}>
                        {item.category}
                      </span>
                    </td>

                    {/* Target Audience */}
                    <td style={{ padding: '0.9rem 1rem', color: '#5b5273', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Users size={13} color="#7c6f93" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                          {item.targetAudience}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td
                      style={{
                        padding: '0.9rem 1rem',
                        color: '#7c6f93',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatDateTime(item.date)}
                    </td>

                    {/* Status Badge (8. DISHA Color System) */}
                    <td style={{ padding: '0.9rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span
                          className={`badge ${item.status === 'Sent' ? 'badge-emerald' : 'badge-amber'
                            }`}
                        >
                          <CheckCircle2 size={11} />
                          {item.status}
                        </span>
                        {item.readStatus === 'Unread' && (
                          <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                            Unread
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <button
                          onClick={() => handleOpenViewModal(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#7c3aed',
                            padding: '0.35rem',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f3ff')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          title="View Full Notification"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleOpenDeleteModal(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#e11d48',
                            padding: '0.35rem',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fff1f2')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          title="Delete Notification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  padding: '1rem',
                  borderTop: '1px solid #ede9fe',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#fbfaff',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <span style={{ fontSize: '0.8rem', color: '#7c6f93' }}>
                  Showing page <strong style={{ color: '#1e1035' }}>{page}</strong> of{' '}
                  <strong style={{ color: '#1e1035' }}>{totalPages}</strong> ({filteredNotifications.length} items)
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '6px',
                      border: '1px solid #ede9fe',
                      backgroundColor: page <= 1 ? '#f3f4f6' : '#ffffff',
                      color: page <= 1 ? '#9ca3af' : '#1e1035',
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '6px',
                      border: '1px solid #ede9fe',
                      backgroundColor: page >= totalPages ? '#f3f4f6' : '#ffffff',
                      color: page >= totalPages ? '#9ca3af' : '#1e1035',
                      cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* =========================================================
          MODAL 1: SEND NOTIFICATION MODAL
          ========================================================= */}
      {isSendModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(30, 16, 53, 0.45)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 20px 45px rgba(124, 58, 237, 0.15)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #ede9fe',
                paddingBottom: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  <Send size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1035' }}>
                    Send Push Notification
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#7c6f93' }}>
                    Broadcast announcement to registered student devices
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSendModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7c6f93',
                  padding: '0.3rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendNotification}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#1e1035',
                    marginBottom: '0.4rem'
                  }}
                >
                  Notification Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. KEAM 2026 Phase 1 Counseling Schedule"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ padding: '0.7rem 0.9rem', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#1e1035',
                    marginBottom: '0.4rem'
                  }}
                >
                  Notification Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Write clear, concise notification content for students..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{
                    padding: '0.7rem 0.9rem',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.2rem'
                }}
              >
                {/* Category Selection */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#1e1035',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ padding: '0.7rem 0.9rem', fontSize: '0.85rem' }}
                  >
                    <option value="Entrance Exams">Entrance Exams</option>
                    <option value="Medical Admissions">Medical Admissions</option>
                    <option value="Guidance & Counseling">Guidance & Counseling</option>
                    <option value="Academic Alert">Academic Alert</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="College Catalog">College Catalog</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#1e1035',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Target Audience
                  </label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ padding: '0.7rem 0.9rem', fontSize: '0.85rem' }}
                  >
                    <option value="All Students">All Students (3,420 Devices)</option>
                  </select>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  borderTop: '1px solid #ede9fe',
                  paddingTop: '1.25rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        className="spinner"
                        style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #ffffff',
                          borderTopColor: 'transparent',
                          borderRadius: '50%'
                        }}
                      />
                      <span>Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Broadcast Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: VIEW NOTIFICATION DETAILS MODAL
          ========================================================= */}
      {isViewModalOpen && selectedNotification && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(30, 16, 53, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #ede9fe',
                paddingBottom: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#f5f3ff',
                    border: '1px solid #ddd6fe',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bell size={22} />
                </div>
                <div>
                  <span
                    className="badge badge-violet"
                    style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}
                  >
                    {selectedNotification.id}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e1035' }}>
                    Notification Details
                  </h3>
                </div>
              </div>

              <button
                onClick={handleCloseViewModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7c6f93',
                  padding: '0.2rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Notification Title & Full Body */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#1e1035',
                  marginBottom: '0.5rem'
                }}
              >
                {selectedNotification.title}
              </h4>
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#fbfaff',
                  border: '1px solid #ede9fe',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  color: '#3b2f54',
                  lineHeight: 1.6
                }}
              >
                {selectedNotification.message}
              </div>
            </div>

            {/* Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.75rem'
              }}
            >
              <div>
                <p style={{ fontSize: '0.74rem', color: '#7c6f93', marginBottom: '0.2rem' }}>
                  Category
                </p>
                <span className="badge badge-violet">{selectedNotification.category}</span>
              </div>

              <div>
                <p style={{ fontSize: '0.74rem', color: '#7c6f93', marginBottom: '0.2rem' }}>
                  Target Audience
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#1e1035'
                  }}
                >
                  <Users size={14} color="#7c3aed" />
                  {selectedNotification.targetAudience}
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.74rem', color: '#7c6f93', marginBottom: '0.2rem' }}>
                  Delivery Status
                </p>
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} />
                  {selectedNotification.status} ({selectedNotification.deliveredCount} devices)
                </span>
              </div>

              <div>
                <p style={{ fontSize: '0.74rem', color: '#7c6f93', marginBottom: '0.2rem' }}>
                  Timestamp
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.82rem',
                    color: '#5b5273'
                  }}
                >
                  <Calendar size={14} color="#7c3aed" />
                  {formatDateTime(selectedNotification.date)}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                borderTop: '1px solid #ede9fe',
                paddingTop: '1rem'
              }}
            >
              <button
                onClick={handleCloseViewModal}
                className="btn-secondary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: DELETE CONFIRMATION MODAL
          ========================================================= */}
      {isDeleteModalOpen && selectedNotification && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(30, 16, 53, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: '#ffffff',
              padding: '1.75rem',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#fff1f2',
                border: '1px solid #fecdd3',
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Trash2 size={22} />
            </div>

            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#1e1035',
                marginBottom: '0.5rem'
              }}
            >
              Delete Notification?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#5b5273', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to remove "<strong>{selectedNotification.title}</strong>" from the history log? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={handleCloseDeleteModal}
                className="btn-secondary"
                style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;
