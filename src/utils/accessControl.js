export const REGISTRATION_REQUEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

export const USER_ACCOUNT_STATUS = {
    ACTIVE: 'Aktif',
    SUSPENDED: 'Ditangguhkan'
};

export const REGISTRATION_CANDIDATE_STATUS = {
    READY: 'Siap Registrasi',
    PENDING: 'Menunggu Persetujuan',
    ACTIVE: 'Aktif'
};

export const SUPER_ADMIN_EMAIL = 'superadmin@arsiphotel.com';
export const SUPER_ADMIN_EMPLOYEE_ID = 'ADM-001';

export const normalizeEmail = (email = '') => email.trim().toLowerCase();
export const normalizeDivisionName = (division = '') => division.trim().toLowerCase();

export const getEmailDomain = (email = '') => {
    const normalizedEmail = normalizeEmail(email);
    const [, domain = ''] = normalizedEmail.split('@');
    return domain;
};

export const isUserAccountActive = (profile) => {
    const currentStatus = profile?.accountStatus || USER_ACCOUNT_STATUS.ACTIVE;
    return currentStatus === USER_ACCOUNT_STATUS.ACTIVE;
};

export const isSuperAdminProfile = (profile) => {
    if (profile?.role !== 'Admin') return false;

    const normalizedEmail = normalizeEmail(profile?.email || '');
    const normalizedEmployeeId = (profile?.employeeId || '').trim().toUpperCase();

    return normalizedEmail === SUPER_ADMIN_EMAIL || normalizedEmployeeId === SUPER_ADMIN_EMPLOYEE_ID;
};

export const getUserDivisionScope = (profile) => profile?.division || '';

export const canAccessDivision = (targetDivision, profile) => {
    if (profile?.role === 'Admin') return true;
    if (!targetDivision) return false;

    return normalizeDivisionName(targetDivision) === normalizeDivisionName(getUserDivisionScope(profile));
};

export const getAccessibleDivisions = (divisions = [], profile) => {
    if (profile?.role === 'Admin') return divisions;

    const userDivision = getUserDivisionScope(profile);
    return divisions.filter((division) => normalizeDivisionName(division.name) === normalizeDivisionName(userDivision));
};

export const resolveActivityDivisionScope = ({ archiveDivision = '', selectedDivision = '', profile = null }) => {
    if (selectedDivision) return selectedDivision;
    if (archiveDivision) return archiveDivision;
    return getUserDivisionScope(profile) || 'Umum';
};

export const timestampToMillis = (timestamp) => {
    if (!timestamp) return 0;
    if (typeof timestamp?.toDate === 'function') return timestamp.toDate().getTime();

    const parsedDate = new Date(timestamp);
    if (Number.isNaN(parsedDate.getTime())) return 0;
    return parsedDate.getTime();
};

export const formatRequestDate = (timestamp) => {
    if (!timestamp) return '-';

    if (typeof timestamp?.toDate === 'function') {
        return timestamp.toDate().toLocaleString('id-ID');
    }

    const parsedDate = new Date(timestamp);
    if (Number.isNaN(parsedDate.getTime())) return '-';

    return parsedDate.toLocaleString('id-ID');
};
