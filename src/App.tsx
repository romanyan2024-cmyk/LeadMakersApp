import React, { useState } from 'react';

// --- الأنواع والواجهات (TypeScript Interfaces) ---
interface WeeklyClass {
  id: string;
  classNumber: 1 | 2 | 3;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
}

interface Servant {
  id: string;
  name: string;
  phone: string;
  role: 'servant' | 'admin';
  groupName: string;
  classes: WeeklyClass[];
}

interface Child {
  id: string;
  name: string;
  groupName: string;
  isPresent: boolean;
}

// --- البيانات الأولية للتجربة ---
const INITIAL_SERVANTS: Servant[] = [
  {
    id: '1',
    name: 'أستاذ روماني',
    phone: '01000000000',
    role: 'admin',
    groupName: 'مجموعة أبطال الغد',
    classes: [
      { id: 'c1', classNumber: 1, day: 'الأحد', startTime: '16:00', endTime: '18:00', location: 'القاعة الرئيسية', notes: 'حصة التفكير الناقد' },
      { id: 'c2', classNumber: 2, day: 'الثلاثاء', startTime: '17:00', endTime: '19:00', location: 'غرفة الأنشطة', notes: 'ورشة المهارات القيادية' },
      { id: 'c3', classNumber: 3, day: 'الخميس', startTime: '16:00', endTime: '18:00', location: 'المسرح', notes: 'فقرة البطل الواعي' },
    ],
  },
  {
    id: '2',
    name: 'خادم المجموعة الثانية',
    phone: '01200000000',
    role: 'servant',
    groupName: 'مجموعة النجوم',
    classes: [
      { id: 'c4', classNumber: 1, day: 'الجمعة', startTime: '10:00', endTime: '12:00', location: 'المبنى الفرعي', notes: 'حصة الألعاب التفاعلية' },
    ],
  },
];

const INITIAL_CHILDREN: Child[] = [
  { id: 'ch1', name: 'كيرلس روماني', groupName: 'مجموعة أبطال الغد', isPresent: true },
  { id: 'ch2', name: 'أنطونيو', groupName: 'مجموعة أبطال الغد', isPresent: true },
  { id: 'ch3', name: 'يوسف مينا', groupName: 'مجموعة أبطال الغد', isPresent: false },
  { id: 'ch4', name: 'مارك بيشوي', groupName: 'مجموعة النجوم', isPresent: true },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'attendance' | 'servants'>('dashboard');
  const [servants, setServants] = useState<Servant[]>(INITIAL_SERVANTS);
  const [childrenList, setChildrenList] = useState<Child[]>(INITIAL_CHILDREN);
  const [selectedServantId, setSelectedServantId] = useState<string>('1');

  // نماذج تعديل وإضافة حصة
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClassNumber, setNewClassNumber] = useState<1 | 2 | 3>(1);
  const [newDay, setNewDay] = useState('الأحد');
  const [newStartTime, setNewStartTime] = useState('16:00');
  const [newEndTime, setNewEndTime] = useState('18:00');
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const currentServant = servants.find((s) => s.id === selectedServantId) || servants[0];

  // تبديل حالة حضور الأطفال
  const toggleAttendance = (childId: string) => {
    setChildrenList((prev) =>
      prev.map((child) => (child.id === childId ? { ...child, isPresent: !child.isPresent } : child))
    );
  };

  // إضافة/تحديث حصة للخادم الحالي
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.trim()) {
      alert('برجاء إدخال مكان الحصة');
      return;
    }

    const updatedClass: WeeklyClass = {
      id: Date.now().toString(),
      classNumber: newClassNumber,
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      location: newLocation,
      notes: newNotes,
    };

    setServants((prev) =>
      prev.map((servant) => {
        if (servant.id === currentServant.id) {
          const filteredClasses = servant.classes.filter((c) => c.classNumber !== newClassNumber);
          return {
            ...servant,
            classes: [...filteredClasses, updatedClass].sort((a, b) => a.classNumber - b.classNumber),
          };
        }
        return servant;
      })
    );

    setIsModalOpen(false);
    setNewNotes('');
    setNewLocation('');
  };

  const totalServants = servants.length;
  const totalChildren = childrenList.length;
  const presentCount = childrenList.filter((c) => c.isPresent).length;
  const attendancePercentage = totalChildren > 0 ? Math.round((presentCount / totalChildren) * 100) : 0;

  return (
    <div dir="rtl" style={styles.container}>
      {/* --- شريط العنوان الرئيسي (Header) --- */}
      <header style={styles.header}>
        <div style={styles.brandContainer}>
          <div style={styles.logoBadge}>👑</div>
          <div>
            <h1 style={styles.appTitle}>صُنّاع القادة</h1>
            <p style={styles.appSubtitle}>خذ بيدي — نظام إدارة مواعيد الحصص والمجموعات</p>
          </div>
        </div>
        <div style={styles.userInfo}>
          <span style={styles.userRoleTag}>{currentServant.role === 'admin' ? 'مسؤول (Admin)' : 'خادم'}</span>
          <span style={styles.userName}>{currentServant.name}</span>
        </div>
      </header>

      {/* --- شريط التبويب والتنقل (Navigation Tabs) --- */}
      <nav style={styles.navBar}>
        <button
          style={activeTab === 'dashboard' ? styles.activeTabBtn : styles.tabBtn}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 الإحصائيات العامة
        </button>
        <button
          style={activeTab === 'schedule' ? styles.activeTabBtn : styles.tabBtn}
          onClick={() => setActiveTab('schedule')}
        >
          📅 مواعيد الحصص الـ 3
        </button>
        <button
          style={activeTab === 'attendance' ? styles.activeTabBtn : styles.tabBtn}
          onClick={() => setActiveTab('attendance')}
        >
          ✅ كشف الحضور
        </button>
        <button
          style={activeTab === 'servants' ? styles.activeTabBtn : styles.tabBtn}
          onClick={() => setActiveTab('servants')}
        >
          👥 دليل الخدام
        </button>
      </nav>

      {/* --- محتوى الصفحة الرئيسي --- */}
      <main style={styles.content}>
        {/* 1. تبويب الإحصائيات */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={styles.sectionTitle}>نظرة عامة على النشاط</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <p style={styles.cardTitle}>إجمالي الخدام</p>
                <p style={styles.cardValue}>{totalServants}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.cardTitle}>إجمالي الأطفال</p>
                <p style={styles.cardValue}>{totalChildren}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.cardTitle}>نسبة الحضور اليوم</p>
                <p style={{ ...styles.cardValue, color: '#16a34a' }}>{attendancePercentage}%</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.cardTitle}>الحصص المسجلة</p>
                <p style={{ ...styles.cardValue, color: '#2563eb' }}>
                  {servants.reduce((acc, s) => acc + s.classes.length, 0)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. تبويب جدول المواعيد */}
        {activeTab === 'schedule' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={styles.sectionTitle}>جدول الحصص الأسبوعية - {currentServant.name}</h2>
                <p style={{ color: '#64748b', margin: 0 }}>المجموعة: {currentServant.groupName}</p>
              </div>
              <button style={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
                ➕ إضافة / تعديل حصة
              </button>
            </div>

            <div style={styles.scheduleGrid}>
              {[1, 2, 3].map((num) => {
                const cls = currentServant.classes.find((c) => c.classNumber === num);
                return (
                  <div key={num} style={styles.classCard}>
                    <div style={styles.classHeader}>
                      <span style={styles.classBadge}>الحصة رقم {num}</span>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {cls ? 'محددة' : 'غير محددة'}
                      </span>
                    </div>
                    {cls ? (
                      <div style={{ marginTop: '1rem' }}>
                        <p><strong>📅 اليوم:</strong> {cls.day}</p>
                        <p><strong>⏰ التوقيت:</strong> {cls.startTime} - {cls.endTime}</p>
                        <p><strong>📍 المكان:</strong> {cls.location}</p>
                        {cls.notes && <p><strong>📝 ملاحظات:</strong> {cls.notes}</p>}
                      </div>
                    ) : (
                      <div style={{ padding: '2rem 0', textAlign: 'center', color: '#94a3b8' }}>
                        لم يتم تسجيل موعد لهذه الحصة بعد
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. تبويب كشف الحضور */}
        {activeTab === 'attendance' && (
          <div>
            <h2 style={styles.sectionTitle}>كشف حضور الأطفال - {currentServant.groupName}</h2>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={styles.th}>اسم الطفل</th>
                    <th style={styles.th}>المجموعة</th>
                    <th style={styles.th}>حالة الحضور</th>
                    <th style={styles.th}>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {childrenList
                    .filter((child) => child.groupName === currentServant.groupName)
                    .map((child) => (
                      <tr key={child.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={styles.td}>{child.name}</td>
                        <td style={styles.td}>{child.groupName}</td>
                        <td style={styles.td}>
                          <span style={child.isPresent ? styles.presentBadge : styles.absentBadge}>
                            {child.isPresent ? 'حاضر ✅' : 'غائب ❌'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button style={styles.secondaryBtn} onClick={() => toggleAttendance(child.id)}>
                            تغيير الحالة
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. تبويب دليل الخدام */}
        {activeTab === 'servants' && (
          <div>
            <h2 style={styles.sectionTitle}>قائمة الخدام والمجموعات</h2>
            <div style={styles.scheduleGrid}>
              {servants.map((servant) => (
                <div
                  key={servant.id}
                  style={{
                    ...styles.classCard,
                    borderColor: servant.id === selectedServantId ? '#2563eb' : '#e2e8f0',
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{servant.name}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>📱 الهاتف: {servant.phone}</p>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>🚩 المجموعة: {servant.groupName}</p>
                  <p style={{ margin: '0 0 1rem 0', color: '#64748b' }}>
                    👑 الدور: {servant.role === 'admin' ? 'مسؤول' : 'خادم'}
                  </p>
                  <button style={styles.primaryBtn} onClick={() => setSelectedServantId(servant.id)}>
                    {servant.id === selectedServantId ? 'المستخدم الحالي' : 'تبديل العرض لهذا الخادم'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- النافذة المنبثقة (Modal) لإضافة/تعديل الحصص --- */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ marginTop: 0 }}>تحديد موعد حصة</h3>
            <form onSubmit={handleSaveClass}>
              <div style={styles.formGroup}>
                <label style={styles.label}>رقم الحصة:</label>
                <select
                  style={styles.input}
                  value={newClassNumber}
                  onChange={(e) => setNewClassNumber(Number(e.target.value) as 1 | 2 | 3)}
                >
                  <option value={1}>الحصة الأولى</option>
                  <option value={2}>الحصة الثانية</option>
                  <option value={3}>الحصة الثالثة</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>اليوم:</label>
                <select style={styles.input} value={newDay} onChange={(e) => setNewDay(e.target.value)}>
                  <option value="الأحد">الأحد</option>
                  <option value="الإثنين">الإثنين</option>
                  <option value="الثلاثاء">الثلاثاء</option>
                  <option value="الأربعاء">الأربعاء</option>
                  <option value="الخميس">الخميس</option>
                  <option value="الجمعة">الجمعة</option>
                  <option value="السبت">السبت</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>من الساعة:</label>
                  <input
                    type="time"
                    style={styles.input}
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>إلى الساعة:</label>
                  <input
                    type="time"
                    style={styles.input}
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>المكان / القاعة:</label>
                <input
                  type="text"
                  placeholder="مثال: القاعة الرئيسية"
                  style={styles.input}
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>ملاحظات أو عنوان الحصة:</label>
                <input
                  type="text"
                  placeholder="مثال: ورشة التفكير الناقد"
                  style={styles.input}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button type="submit" style={styles.primaryBtn}>
                  حفظ الموعد
                </button>
                <button
                  type="button"
                  style={{ ...styles.secondaryBtn, background: '#e2e8f0', color: '#334155' }}
                  onClick={() => setIsModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#1e293b' },
  header: { backgroundColor: '#0f172a', color: '#ffffff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brandContainer: { display: 'flex', alignItems: 'center', gap: '1rem' },
  logoBadge: { fontSize: '1.8rem', background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.6rem', borderRadius: '10px' },
  appTitle: { margin: 0, fontSize: '1.4rem', fontWeight: 'bold' },
  appSubtitle: { margin: 0, fontSize: '0.85rem', color: '#94a3b8' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  userRoleTag: { backgroundColor: '#2563eb', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
  userName: { fontWeight: 'bold' },
  navBar: { backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', padding: '0.5rem 2rem' },
  tabBtn: { padding: '0.6rem 1.2rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.95rem', color: '#64748b' },
  activeTabBtn: { padding: '0.6rem 1.2rem', border: 'none', backgroundColor: '#eff6ff', cursor: 'pointer', fontSize: '0.95rem', color: '#2563eb', fontWeight: 'bold', borderBottom: '2px solid #2563eb' },
  content: { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  sectionTitle: { marginTop: 0, fontSize: '1.25rem', color: '#0f172a', marginBottom: '1rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  statCard: { backgroundColor: 'white', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' },
  cardTitle: { margin: 0, color: '#64748b', fontSize: '0.85rem' },
  cardValue: { margin: '0.5rem 0 0 0', fontSize: '1.8rem', fontWeight: 'bold' },
  scheduleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' },
  classCard: { backgroundColor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1.25rem' },
  classHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' },
  classBadge: { backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' },
  primaryBtn: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: '#f1f5f9', color: '#334155', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
  th: { padding: '0.75rem 1rem', color: '#475569', fontSize: '0.9rem' },
  td: { padding: '0.75rem 1rem', fontSize: '0.9rem' },
  presentBadge: { backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' },
  absentBadge: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', width: '420px', maxWidth: '90%' },
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: '#475569' },
  input: { width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' },
};
