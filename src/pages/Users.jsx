// ============================================
// FILE: Users.jsx
// FUNGSI: Halaman Manajemen Pengguna/Karyawan
// FITUR: Kelola akun aktif dan siapkan akun yang bisa diaktivasi user
// ============================================

import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatistikPengguna from '../components/dashboard/pengguna/StatistikPengguna';
import TabelPengguna from '../components/dashboard/pengguna/TabelPengguna';
import { useFirestore } from '../contexts/FirestoreContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useAuth } from '../contexts/AuthContext';
import {
    isSuperAdminProfile,
    normalizeEmail,
    REGISTRATION_REQUEST_STATUS,
    REGISTRATION_CANDIDATE_STATUS,
    USER_ACCOUNT_STATUS
} from '../utils/accessControl';

const Users = () => {
    const {
        subscribeToCollection,
        addDocument,
        updateDocument,
        deleteDocument,
        getDocuments,
        setDocument,
    } = useFirestore();
    const { signUpByAdmin } = useAuth();
    const { isSuperAdmin, userProfile } = useUserProfile();

    const [users, setUsers] = useState([]);
    const [registrationCandidates, setRegistrationCandidates] = useState([]);
    const [registrationRequests, setRegistrationRequests] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('Semua');
    const [candidateSearchTerm, setCandidateSearchTerm] = useState('');

    const [showUserModal, setShowUserModal] = useState(false);
    const [showCandidateModal, setShowCandidateModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentCandidateId, setCurrentCandidateId] = useState(null);

    const [userFormData, setUserFormData] = useState({
        name: '',
        email: '',
        employeeId: '',
        division: '',
        role: 'Staf',
        accountStatus: USER_ACCOUNT_STATUS.ACTIVE
    });

    const [candidateFormData, setCandidateFormData] = useState({
        name: '',
        email: '',
        employeeId: '',
        division: ''
    });

    const [adminFormData, setAdminFormData] = useState({
        name: '',
        email: '',
        employeeId: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const unsubscribeUsers = subscribeToCollection('users', (data) => {
            setUsers(data || []);
            setLoading(false);
        });

        const unsubscribeCandidates = subscribeToCollection('registrationCandidates', (data) => {
            setRegistrationCandidates(data || []);
        });

        const unsubscribeRequests = subscribeToCollection('registrationRequests', (data) => {
            setRegistrationRequests(data || []);
        });

        const fetchDivisions = async () => {
            const result = await getDocuments('divisions');
            if (result.success) {
                setDivisions(result.data);
            }
        };

        fetchDivisions();

        return () => {
            if (unsubscribeUsers) unsubscribeUsers();
            if (unsubscribeCandidates) unsubscribeCandidates();
            if (unsubscribeRequests) unsubscribeRequests();
        };
    }, [getDocuments, subscribeToCollection]);

    const isProtectedSuperAdmin = (record) => isSuperAdminProfile(record);

    const canManageUserRecord = (user) => {
        if (user.role !== 'Admin') return true;
        return isSuperAdmin() && !isProtectedSuperAdmin(user);
    };

    const resetUserForm = () => {
        setCurrentUserId(null);
        setUserFormData({
            name: '',
            email: '',
            employeeId: '',
            division: '',
            role: 'Staf',
            accountStatus: USER_ACCOUNT_STATUS.ACTIVE
        });
    };

    const resetCandidateForm = () => {
        setCurrentCandidateId(null);
        setCandidateFormData({
            name: '',
            email: '',
            employeeId: '',
            division: ''
        });
    };

    const resetAdminForm = () => {
        setAdminFormData({
            name: '',
            email: '',
            employeeId: '',
            password: '',
            confirmPassword: ''
        });
    };

    const handleOpenUserModal = (user) => {
        if (!canManageUserRecord(user)) {
            alert('Akun admin hanya bisa dikelola oleh Super Admin.');
            return;
        }

        setCurrentUserId(user.id);
        setUserFormData({
            name: user.name || '',
            email: user.email || '',
            employeeId: user.employeeId || '',
            division: user.division || '',
            role: user.role || 'Staf',
            accountStatus: user.accountStatus || USER_ACCOUNT_STATUS.ACTIVE
        });
        setShowUserModal(true);
    };

    const handleCloseUserModal = () => {
        setShowUserModal(false);
        resetUserForm();
    };

    const handleOpenCandidateModal = (candidate = null) => {
        if (candidate) {
            setCurrentCandidateId(candidate.id);
            setCandidateFormData({
                name: candidate.name || '',
                email: candidate.email || '',
                employeeId: candidate.employeeId || '',
                division: candidate.division || ''
            });
        } else {
            setCurrentCandidateId(null);
            setCandidateFormData({
                name: '',
                email: '',
                employeeId: '',
                division: ''
            });
        }
        setShowCandidateModal(true);
    };

    const handleCloseCandidateModal = () => {
        setShowCandidateModal(false);
        resetCandidateForm();
    };

    const handleOpenAdminModal = () => {
        if (!isSuperAdmin()) {
            alert('Hanya Super Admin yang bisa menambah admin baru.');
            return;
        }

        resetAdminForm();
        setShowAdminModal(true);
    };

    const handleCloseAdminModal = () => {
        setShowAdminModal(false);
        resetAdminForm();
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();

        const currentUser = users.find((user) => user.id === currentUserId);
        if (currentUser?.role === 'Admin' && !canManageUserRecord(currentUser)) {
            alert('Akun admin hanya bisa dikelola oleh Super Admin.');
            return;
        }

        if (userFormData.role === 'Admin' && !isSuperAdmin()) {
            alert('Hanya Super Admin yang bisa menetapkan role Admin.');
            return;
        }

        if (currentUser && isProtectedSuperAdmin(currentUser) && userFormData.role !== 'Admin') {
            alert('Role Super Admin tidak bisa diubah.');
            return;
        }

        const payload = {
            ...userFormData,
            email: normalizeEmail(userFormData.email)
        };

        if (currentUser?.role === 'Admin' || userFormData.role === 'Admin') {
            payload.role = 'Admin';
            payload.division = 'Umum';
        }

        const result = await updateDocument('users', currentUserId, {
            ...payload
        });

        if (result.success) {
            alert('Data pengguna berhasil diperbarui!');
            handleCloseUserModal();
        } else {
            alert('Gagal memperbarui: ' + result.error);
        }
    };

    const handleDeleteUser = async (user) => {
        if (!canManageUserRecord(user)) {
            alert('Akun admin hanya bisa dihapus oleh Super Admin.');
            return;
        }

        if (window.confirm(`Hapus pengguna ${user.name} dari database?`)) {
            const result = await deleteDocument('users', user.id);
            if (result.success) alert('Pengguna berhasil dihapus!');
            else alert('Gagal menghapus: ' + result.error);
        }
    };

    const handleCandidateSubmit = async (e) => {
        e.preventDefault();

        const normalizedEmail = normalizeEmail(candidateFormData.email);
        const duplicateActiveUser = users.some((user) => normalizeEmail(user.email) === normalizedEmail);
        const duplicateCandidate = registrationCandidates.some((candidate) => (
            candidate.id !== currentCandidateId && normalizeEmail(candidate.email) === normalizedEmail
        ));

        if (duplicateActiveUser || duplicateCandidate) {
            alert('Email sudah dipakai di akun aktif atau calon akun lain.');
            return;
        }

        const currentCandidate = registrationCandidates.find((candidate) => candidate.id === currentCandidateId);
        const payload = {
            name: candidateFormData.name.trim(),
            email: normalizedEmail,
            employeeId: candidateFormData.employeeId.trim(),
            division: candidateFormData.division,
            role: 'Staf',
            registrationStatus: currentCandidate?.registrationStatus || 'Siap Registrasi'
        };

        const result = currentCandidateId
            ? await updateDocument('registrationCandidates', currentCandidateId, payload)
            : await addDocument('registrationCandidates', payload);

        if (result.success) {
            alert(currentCandidateId ? 'Data calon akun berhasil diperbarui.' : 'Calon akun berhasil disiapkan untuk registrasi.');
            handleCloseCandidateModal();
        } else {
            alert('Gagal menyimpan calon akun: ' + result.error);
        }
    };

    const handleDeleteCandidate = async (candidate) => {
        if (candidate.registrationStatus !== REGISTRATION_CANDIDATE_STATUS.READY) {
            alert('Akun yang sedang menunggu persetujuan atau sudah aktif tidak bisa dihapus dari daftar calon akun.');
            return;
        }

        if (window.confirm(`Hapus data calon akun ${candidate.name}?`)) {
            const result = await deleteDocument('registrationCandidates', candidate.id);
            if (result.success) alert('Calon akun berhasil dihapus.');
            else alert('Gagal menghapus: ' + result.error);
        }
    };

    const handleApproveRegistrationRequest = async (request) => {
        if (!window.confirm(`Setujui permintaan aktivasi untuk ${request.name}?`)) {
            return;
        }

        const currentCandidate = registrationCandidates.find((candidate) => candidate.id === request.candidateId);
        if (!currentCandidate) {
            alert('Data calon akun tidak ditemukan lagi.');
            return;
        }

        if (request.status !== REGISTRATION_REQUEST_STATUS.PENDING) {
            alert('Permintaan ini sudah diproses sebelumnya.');
            return;
        }

        const duplicateUser = users.some((user) => normalizeEmail(user.email) === normalizeEmail(request.email));
        if (duplicateUser) {
            alert('Email ini sudah aktif di akun pengguna lain.');
            return;
        }

        const authResult = await signUpByAdmin(
            normalizeEmail(request.email),
            request.password,
            request.name.trim()
        );

        if (!authResult.success) {
            alert(authResult.error);
            return;
        }

        const userResult = await setDocument('users', authResult.uid, {
            uid: authResult.uid,
            name: request.name,
            email: normalizeEmail(request.email),
            division: request.division,
            role: request.role || 'Staf',
            employeeId: request.employeeId || '',
            accountStatus: USER_ACCOUNT_STATUS.ACTIVE,
            registrationCandidateId: request.candidateId
        });

        if (!userResult.success) {
            alert('Akun auth berhasil dibuat, tapi profil user gagal disimpan: ' + userResult.error);
            return;
        }

        const candidateResult = await updateDocument('registrationCandidates', request.candidateId, {
            registrationStatus: REGISTRATION_CANDIDATE_STATUS.ACTIVE,
            activatedUserId: authResult.uid,
            activatedEmail: normalizeEmail(request.email)
        });

        if (!candidateResult.success) {
            alert('Profil user berhasil dibuat, tapi status calon akun gagal diperbarui: ' + candidateResult.error);
            return;
        }

        const requestResult = await updateDocument('registrationRequests', request.id, {
            status: REGISTRATION_REQUEST_STATUS.APPROVED,
            approvedBy: userProfile?.name || userProfile?.email || 'Admin',
            approvedById: userProfile?.id || '',
            approvedAt: new Date().toISOString(),
            activatedUserId: authResult.uid,
            password: null
        });

        if (!requestResult.success) {
            alert('Akun sudah aktif, tapi status permintaan gagal diperbarui: ' + requestResult.error);
            return;
        }

        alert('Permintaan aktivasi berhasil disetujui.');
    };

    const handleRejectRegistrationRequest = async (request) => {
        if (!window.confirm(`Tolak permintaan aktivasi untuk ${request.name}?`)) {
            return;
        }

        if (request.status !== REGISTRATION_REQUEST_STATUS.PENDING) {
            alert('Permintaan ini sudah diproses sebelumnya.');
            return;
        }

        const requestResult = await updateDocument('registrationRequests', request.id, {
            status: REGISTRATION_REQUEST_STATUS.REJECTED,
            rejectedBy: userProfile?.name || userProfile?.email || 'Admin',
            rejectedById: userProfile?.id || '',
            rejectedAt: new Date().toISOString(),
            password: null
        });

        if (!requestResult.success) {
            alert('Gagal menolak permintaan: ' + requestResult.error);
            return;
        }

        const candidateResult = await updateDocument('registrationCandidates', request.candidateId, {
            registrationStatus: REGISTRATION_CANDIDATE_STATUS.READY,
            latestRequestId: request.id
        });

        if (!candidateResult.success) {
            alert('Permintaan ditolak, tapi status calon akun gagal dikembalikan: ' + candidateResult.error);
            return;
        }

        alert('Permintaan aktivasi berhasil ditolak.');
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();

        if (!isSuperAdmin()) {
            alert('Hanya Super Admin yang bisa menambah admin baru.');
            return;
        }

        const normalizedEmail = normalizeEmail(adminFormData.email);
        const duplicateUser = users.some((user) => normalizeEmail(user.email) === normalizedEmail);
        const duplicateCandidate = registrationCandidates.some((candidate) => normalizeEmail(candidate.email) === normalizedEmail);

        if (duplicateUser || duplicateCandidate) {
            alert('Email admin sudah dipakai akun lain.');
            return;
        }

        if (adminFormData.password !== adminFormData.confirmPassword) {
            alert('Password dan konfirmasi password harus sama.');
            return;
        }

        if (adminFormData.password.length < 6) {
            alert('Password admin minimal 6 karakter.');
            return;
        }

        const authResult = await signUpByAdmin(
            normalizedEmail,
            adminFormData.password,
            adminFormData.name.trim()
        );

        if (!authResult.success) {
            alert(authResult.error);
            return;
        }

        const result = await setDocument('users', authResult.uid, {
            uid: authResult.uid,
            name: adminFormData.name.trim(),
            email: normalizedEmail,
            employeeId: adminFormData.employeeId.trim(),
            division: 'Umum',
            role: 'Admin',
            accountStatus: USER_ACCOUNT_STATUS.ACTIVE
        });

        if (result.success) {
            alert('Akun admin berhasil dibuat.');
            handleCloseAdminModal();
        } else {
            alert('Akun auth sudah dibuat, tapi profil admin gagal disimpan: ' + result.error);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.division?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.accountStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'Semua' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const adminUsers = users.filter((user) => user.role === 'Admin');
    const staffCandidates = registrationCandidates.filter((candidate) => candidate.role !== 'Admin');
    const pendingRegistrationRequests = registrationRequests.filter((request) => (
        request.status === REGISTRATION_REQUEST_STATUS.PENDING
    ));

    const matchesCandidateSearch = (candidate) => (
        candidate.name?.toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
        candidate.division?.toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
        candidate.employeeId?.toLowerCase().includes(candidateSearchTerm.toLowerCase())
    );

    const filteredCandidates = staffCandidates.filter(matchesCandidateSearch);
    const showAdminSection = isSuperAdmin() && roleFilter !== 'Staf';
    const showStaffSection = roleFilter !== 'Admin';
    const visibleUsersForStats = filteredUsers;

    return (
        <Layout title="Manajemen Pengguna" hideFAB={true}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Manajemen Pengguna</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                            Monitoring akun aktif, siapkan registrasi staf, dan {isSuperAdmin() ? 'kelola akun admin untuk operasional hotel.' : 'kelola akun karyawan sesuai wewenang admin.'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                            {['Semua', 'Admin', 'Staf'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${roleFilter === role
                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">search</span>
                            <input
                                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="Cari nama, email..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {showAdminSection && (
                            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Manajemen Admin</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Super Admin bisa menambah, mengubah, dan menghapus akun admin lain dari sini.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleOpenAdminModal}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-sm shadow-sm hover:opacity-90 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                                        Tambah Admin
                                    </button>
                                </div>

                                <div className="px-6 py-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {adminUsers.map((admin) => (
                                            <div key={admin.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{admin.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{admin.email}</p>
                                                    </div>
                                                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0 ${isProtectedSuperAdmin(admin)
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                        }`}>
                                                        {isProtectedSuperAdmin(admin) ? 'Super Admin' : 'Admin'}
                                                    </span>
                                                </div>
                                                <div className="mt-4 space-y-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                    <p>ID Karyawan: <span className="text-slate-700 dark:text-slate-200">{admin.employeeId || '-'}</span></p>
                                                    <p>Divisi: <span className="text-slate-700 dark:text-slate-200">{admin.division || 'Umum'}</span></p>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenUserModal(admin)}
                                                        disabled={!canManageUserRecord(admin)}
                                                        className="flex-1 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(admin)}
                                                        disabled={!canManageUserRecord(admin)}
                                                        className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {showStaffSection && (
                            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Daftar Akun Staf Siap Registrasi</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Admin menyiapkan identitas karyawan di sini. User hanya bisa mengirim permintaan aktivasi untuk akun yang sudah ada di daftar ini.
                                        </p>
                                    </div>

                                    <div className="relative w-full lg:w-72">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">search</span>
                                        <input
                                            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                                            placeholder="Cari calon akun..."
                                            type="text"
                                            value={candidateSearchTerm}
                                            onChange={(e) => setCandidateSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                        <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Permintaan Aktivasi Menunggu Persetujuan</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Staff mengisi password dari halaman register, lalu admin memutuskan approve atau reject dari sini.
                                            </p>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[920px] text-left">
                                                <thead className="bg-slate-50/60 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                                    <tr>
                                                        <th className="px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama</th>
                                                        <th className="px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</th>
                                                        <th className="px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Divisi</th>
                                                        <th className="px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Karyawan</th>
                                                        <th className="px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                                        <th className="px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {pendingRegistrationRequests.length > 0 ? pendingRegistrationRequests.map((request) => (
                                                        <tr key={request.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                                            <td className="px-5 py-4 text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{request.name}</td>
                                                            <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-300">{request.email}</td>
                                                            <td className="px-5 py-4 text-sm font-bold text-slate-600 dark:text-slate-300">{request.division || '-'}</td>
                                                            <td className="px-5 py-4 text-sm font-bold text-slate-600 dark:text-slate-300">{request.employeeId || '-'}</td>
                                                            <td className="px-5 py-4">
                                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                                                                    <span className="size-1.5 rounded-full bg-amber-500"></span>
                                                                    Menunggu Persetujuan
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button
                                                                        onClick={() => handleApproveRegistrationRequest(request)}
                                                                        className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-all"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRejectRegistrationRequest(request)}
                                                                        className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs transition-all"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan="6" className="px-5 py-10 text-center text-sm font-medium text-slate-400">
                                                                Belum ada permintaan aktivasi yang menunggu persetujuan admin.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[920px] text-left">
                                        <thead className="bg-slate-50/60 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <tr>
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama</th>
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</th>
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Divisi</th>
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Karyawan</th>
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {filteredCandidates.length > 0 ? filteredCandidates.map((candidate) => (
                                                <tr key={candidate.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                                    <td className="px-6 py-4 text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{candidate.name}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-300">{candidate.email}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300">{candidate.division || '-'}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300">{candidate.employeeId || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        {candidate.registrationStatus === REGISTRATION_CANDIDATE_STATUS.ACTIVE ? (
                                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-black uppercase tracking-widest">
                                                                <span className="size-1.5 rounded-full bg-slate-400"></span>
                                                                Sudah Aktif
                                                            </span>
                                                        ) : candidate.registrationStatus === REGISTRATION_CANDIDATE_STATUS.PENDING ? (
                                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                                                                <span className="size-1.5 rounded-full bg-amber-500"></span>
                                                                Menunggu Persetujuan
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest">
                                                                <span className="size-1.5 rounded-full bg-blue-500"></span>
                                                                Siap Registrasi
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleOpenCandidateModal(candidate)}
                                                                disabled={candidate.registrationStatus !== REGISTRATION_CANDIDATE_STATUS.READY}
                                                                className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCandidate(candidate)}
                                                                disabled={candidate.registrationStatus !== REGISTRATION_CANDIDATE_STATUS.READY}
                                                                className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-16 text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <span className="material-symbols-outlined text-4xl text-slate-200">person_add</span>
                                                            <p className="text-slate-400 font-bold text-sm">Belum ada calon akun yang disiapkan admin.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        <StatistikPengguna users={visibleUsersForStats} />
                        <TabelPengguna
                            users={filteredUsers}
                            totalCount={users.length}
                            onEdit={handleOpenUserModal}
                            onDelete={handleDeleteUser}
                            canManageUser={canManageUserRecord}
                        />
                    </div>
                )}
            </div>

            {showStaffSection && (
                <button
                    onClick={() => handleOpenCandidateModal()}
                    className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-full font-bold shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all z-40"
                >
                    <span className="material-symbols-outlined font-bold">person_add</span>
                    <span className="text-sm tracking-wide hidden sm:inline">Siapkan Akun Staf</span>
                </button>
            )}

            {showUserModal && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                                {userFormData.role === 'Admin' ? 'Perbarui Profil Admin' : 'Perbarui Profil Karyawan'}
                            </h3>
                            <button onClick={handleCloseUserModal} className="text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleUserSubmit} className="p-6 md:p-8 space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nama Lengkap</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={userFormData.name}
                                        onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                                        placeholder="Masukkan nama lengkap..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Alamat Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={userFormData.email}
                                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                                        placeholder="email@hotel.com"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Divisi</label>
                                        {userFormData.role === 'Admin' ? (
                                            <input
                                                disabled
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-sm font-bold text-slate-500"
                                                value="Umum"
                                            />
                                        ) : (
                                            <select
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                                value={userFormData.division}
                                                onChange={(e) => setUserFormData({ ...userFormData, division: e.target.value })}
                                            >
                                                <option value="">Pilih Divisi</option>
                                                {divisions.map((div) => (
                                                    <option key={div.id} value={div.name}>{div.name}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Peran / Role</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                            value={userFormData.role}
                                            onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                                            disabled={(users.find((user) => user.id === currentUserId)?.role === 'Admin') || isProtectedSuperAdmin(users.find((user) => user.id === currentUserId) || {})}
                                        >
                                            <option value="Staf">Staf</option>
                                            {(isSuperAdmin() || userFormData.role === 'Admin') && (
                                                <option value="Admin">Admin</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">ID Karyawan</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={userFormData.employeeId}
                                        onChange={(e) => setUserFormData({ ...userFormData, employeeId: e.target.value })}
                                        placeholder="Contoh: HK-024"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Status Akun</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={userFormData.accountStatus}
                                        onChange={(e) => setUserFormData({ ...userFormData, accountStatus: e.target.value })}
                                    >
                                        <option value={USER_ACCOUNT_STATUS.ACTIVE}>Aktif</option>
                                        <option value={USER_ACCOUNT_STATUS.SUSPENDED}>Ditangguhkan</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px] font-bold">save_as</span>
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCandidateModal && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                                {currentCandidateId ? 'Perbarui Calon Akun Staf' : 'Siapkan Akun Staf Baru'}
                            </h3>
                            <button onClick={handleCloseCandidateModal} className="text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCandidateSubmit} className="p-6 md:p-8 space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nama Lengkap</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={candidateFormData.name}
                                        onChange={(e) => setCandidateFormData({ ...candidateFormData, name: e.target.value })}
                                        placeholder="Masukkan nama lengkap..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Alamat Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={candidateFormData.email}
                                        onChange={(e) => setCandidateFormData({ ...candidateFormData, email: e.target.value })}
                                        placeholder="email@hotel.com"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Divisi</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                            value={candidateFormData.division}
                                            onChange={(e) => setCandidateFormData({ ...candidateFormData, division: e.target.value })}
                                        >
                                            <option value="">Pilih Divisi</option>
                                            {divisions.map((div) => (
                                                <option key={div.id} value={div.name}>{div.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Role</label>
                                        <input
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-sm font-bold text-slate-500"
                                            value="Staf"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">ID Karyawan</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={candidateFormData.employeeId}
                                        onChange={(e) => setCandidateFormData({ ...candidateFormData, employeeId: e.target.value })}
                                        placeholder="Contoh: HK-024"
                                    />
                                </div>
                                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                                    Setelah data ini disimpan, karyawan bisa membuka halaman register, memilih divisi, lalu mengirim permintaan aktivasi. Akun baru aktif setelah admin menyetujui permintaan tersebut.
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px] font-bold">{currentCandidateId ? 'save_as' : 'person_add'}</span>
                                    {currentCandidateId ? 'Simpan Perubahan' : 'Siapkan untuk Registrasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAdminModal && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">Tambah Admin Baru</h3>
                            <button onClick={handleCloseAdminModal} className="text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleAdminSubmit} autoComplete="off" className="p-6 md:p-8 space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nama Lengkap</label>
                                    <input
                                        required
                                        autoComplete="off"
                                        name="new_admin_name"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={adminFormData.name}
                                        onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                                        placeholder="Masukkan nama admin..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Alamat Email</label>
                                    <input
                                        required
                                        type="email"
                                        autoComplete="off"
                                        name="new_admin_email"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={adminFormData.email}
                                        onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                                        placeholder="admin@hotel.com"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Divisi</label>
                                        <input
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-sm font-bold text-slate-500"
                                            value="Umum"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Role</label>
                                        <input
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-sm font-bold text-slate-500"
                                            value="Admin"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">ID Admin</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={adminFormData.employeeId}
                                        onChange={(e) => setAdminFormData({ ...adminFormData, employeeId: e.target.value })}
                                        placeholder="Contoh: ADM-002"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Password</label>
                                    <input
                                        required
                                        type="password"
                                        autoComplete="new-password"
                                        name="new_admin_password"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={adminFormData.password}
                                        onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                                        placeholder="Minimal 6 karakter"
                                    />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-2 tracking-widest">Konfirmasi Password</label>
                                    <input
                                        required
                                        type="password"
                                        autoComplete="new-password"
                                        name="new_admin_password_confirm"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                        value={adminFormData.confirmPassword}
                                        onChange={(e) => setAdminFormData({ ...adminFormData, confirmPassword: e.target.value })}
                                        placeholder="Ulangi password"
                                    />
                                    </div>
                                </div>
                                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                                    Akun admin dibuat langsung aktif. Password diisi oleh Super Admin saat akun dibuat.
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px] font-bold">admin_panel_settings</span>
                                    Buat Akun Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Users;
