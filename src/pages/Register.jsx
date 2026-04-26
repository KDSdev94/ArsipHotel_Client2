import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirestore } from '../contexts/FirestoreContext';
import {
    normalizeEmail,
    REGISTRATION_REQUEST_STATUS,
    REGISTRATION_CANDIDATE_STATUS,
    isUserAccountActive
} from '../utils/accessControl';

const Register = () => {
    const { getDocuments, getDocument, addDocument, updateDocument } = useFirestore();

    const [formData, setFormData] = useState({
        division: '',
        candidateId: '',
        password: '',
        confirmPassword: '',
    });

    const [divisions, setDivisions] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [existingUsers, setExistingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('info');

    const availableCandidates = candidates.filter((candidate) => candidate.division === formData.division);
    const activeUsersByDivision = existingUsers
        .filter((user) => (
            user.division === formData.division
            && user.role !== 'Admin'
            && isUserAccountActive(user)
        ))
        .filter((user) => !availableCandidates.some((candidate) => (
            candidate.activatedUserId === user.uid
            || (
                candidate.employeeId
                && user.employeeId
                && candidate.employeeId.trim().toUpperCase() === user.employeeId.trim().toUpperCase()
            )
            || normalizeEmail(candidate.email) === normalizeEmail(user.email)
        )))
        .map((user) => ({
            ...user,
            registrationStatus: REGISTRATION_CANDIDATE_STATUS.ACTIVE,
            isLegacyAccount: true
        }));

    const registrationOptions = [...availableCandidates, ...activeUsersByDivision];

    useEffect(() => {
        const fetchReferenceData = async () => {
            const [divisionResult, candidateResult, userResult] = await Promise.all([
                getDocuments('divisions'),
                getDocuments('registrationCandidates'),
                getDocuments('users'),
            ]);

            if (divisionResult.success) {
                setDivisions(divisionResult.data);
            }

            if (candidateResult.success) {
                setCandidates(candidateResult.data);
            }

            if (userResult.success) {
                setExistingUsers(userResult.data);
            }
        };

        fetchReferenceData();
    }, [getDocuments]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const showAlert = (message, type = 'info') => {
        setAlertMessage(message);
        setAlertType(type);
    };

    const handleVerifyIdentity = async (e) => {
        e.preventDefault();
        setLoading(true);
        showAlert('');

        const candidate = candidates.find((item) => item.id === formData.candidateId);

        if (!candidate) {
            showAlert('Pilih nama yang sudah disiapkan admin terlebih dahulu.', 'error');
            setLoading(false);
            return;
        }

        if (candidate.registrationStatus === REGISTRATION_CANDIDATE_STATUS.ACTIVE) {
            showAlert('Nama ini sudah aktif dan tidak bisa diregistrasi ulang.', 'error');
            setLoading(false);
            return;
        }

        if (candidate.registrationStatus === REGISTRATION_CANDIDATE_STATUS.PENDING) {
            showAlert('Nama ini sedang menunggu persetujuan admin. Silakan tunggu keputusan admin.', 'error');
            setLoading(false);
            return;
        }

        setSelectedCandidate(candidate);
        setStep(2);
        showAlert('Verifikasi tahap 1 berhasil. Lanjutkan dengan membuat password akun Anda.', 'success');
        setLoading(false);
    };

    const handleActivateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        showAlert('');

        if (!selectedCandidate) {
            showAlert('Data karyawan belum dipilih.', 'error');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showAlert('Password dan konfirmasi password tidak cocok.', 'error');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            showAlert('Password minimal 6 karakter.', 'error');
            setLoading(false);
            return;
        }

        const candidateResult = await getDocument('registrationCandidates', selectedCandidate.id);
        if (!candidateResult.success) {
            showAlert('Data akun yang disiapkan admin tidak ditemukan lagi.', 'error');
            setLoading(false);
            return;
        }

        const currentCandidate = candidateResult.data;
        if (currentCandidate.registrationStatus === REGISTRATION_CANDIDATE_STATUS.ACTIVE) {
            showAlert('Akun ini sudah lebih dulu diaktifkan. Silakan login atau hubungi admin.', 'error');
            setLoading(false);
            return;
        }

        if (currentCandidate.registrationStatus === REGISTRATION_CANDIDATE_STATUS.PENDING) {
            showAlert('Akun ini sedang menunggu persetujuan admin. Silakan tunggu keputusan admin.', 'error');
            setLoading(false);
            return;
        }

        const normalizedEmail = normalizeEmail(currentCandidate.email);
        const requestResult = await addDocument('registrationRequests', {
            candidateId: currentCandidate.id,
            name: currentCandidate.name,
            email: normalizedEmail,
            division: currentCandidate.division,
            role: currentCandidate.role || 'Staf',
            employeeId: currentCandidate.employeeId || '',
            password: formData.password,
            status: REGISTRATION_REQUEST_STATUS.PENDING
        });

        if (!requestResult.success) {
            showAlert(`Permintaan aktivasi gagal dikirim: ${requestResult.error}`, 'error');
            setLoading(false);
            return;
        }

        const candidateUpdateResult = await updateDocument('registrationCandidates', currentCandidate.id, {
            registrationStatus: REGISTRATION_CANDIDATE_STATUS.PENDING,
            latestRequestId: requestResult.id
        });

        if (!candidateUpdateResult.success) {
            showAlert(`Permintaan terkirim, tapi status daftar registrasi gagal diperbarui: ${candidateUpdateResult.error}`, 'error');
            setLoading(false);
            return;
        }

        setCandidates((prev) => prev.map((candidate) => (
            candidate.id === currentCandidate.id
                ? {
                    ...candidate,
                    registrationStatus: REGISTRATION_CANDIDATE_STATUS.PENDING,
                    latestRequestId: requestResult.id
                }
                : candidate
        )));

        setSelectedCandidate(null);
        setStep(1);
        setFormData({
            division: '',
            candidateId: '',
            password: '',
            confirmPassword: '',
        });
        showAlert('Permintaan aktivasi berhasil dikirim. Tunggu persetujuan admin sebelum akun bisa dipakai login.', 'success');
        setLoading(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
            <div className="flex lg:w-1/2 relative overflow-hidden bg-slate-900 min-h-[300px] lg:min-h-screen">
                <div className="absolute inset-0">
                    <img
                        src="/background.jpeg"
                        alt="Hotel Background"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 text-white w-full flex flex-col justify-between p-8 lg:p-16">
                    <div className="flex items-center justify-between lg:justify-start gap-3 w-full">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 backdrop-blur-md p-1.5 lg:p-2 rounded-lg border border-white/20">
                                <img className="w-10 h-10 lg:w-16 lg:h-16" src="/logo_512.png" alt="logo" />
                            </div>
                            <h2 className="text-xl lg:text-2xl font-bold tracking-tight">Arsip Hotel</h2>
                        </div>

                        <div className="lg:hidden">
                            <Link to="/login" className="px-4 py-1.5 bg-black rounded-full text-xs font-bold">
                                Masuk
                            </Link>
                        </div>
                    </div>

                    <div className="max-w-lg mt-auto lg:mt-0">
                        <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 mb-4 lg:hidden">
                            <p className="text-xs font-bold">Aktivasi</p>
                        </div>
                        <h1 className="text-2xl lg:text-5xl font-extrabold leading-tight mb-4 lg:mb-6">Aktivasi Akun Arsip Hotel</h1>
                        <p className="hidden lg:block text-lg text-blue-50/80 leading-relaxed mb-10">
                            Admin hotel menyiapkan identitas akun Anda lebih dulu. Aktivasi di sini memastikan akun hanya dipakai oleh karyawan yang benar.
                        </p>

                        <div className="hidden lg:flex gap-8">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold">2</span>
                                <span className="text-xs text-blue-100 uppercase tracking-widest font-bold opacity-70">Langkah</span>
                            </div>
                            <div className="w-px h-10 bg-white/20"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold">Admin</span>
                                <span className="text-xs text-blue-100 uppercase tracking-widest font-bold opacity-70">Approval</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 bg-white dark:bg-background-dark flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative">
                <div className="max-w-105 w-full mx-auto">
                    <header className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em]">
                                Verifikasi 2 Langkah
                            </span>
                            <span className="text-xs font-bold text-slate-400">Tahap {step} / 2</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Aktivasi Akun</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Pilih identitas yang sudah dibuat admin, lalu buat password untuk mengirim permintaan aktivasi akun Anda.
                        </p>
                    </header>

                    {alertMessage && (
                        <div className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${alertType === 'error'
                            ? 'border-red-200 bg-red-50 text-red-600'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            }`}>
                            {alertMessage}
                        </div>
                    )}

                    <form onSubmit={step === 1 ? handleVerifyIdentity : handleActivateAccount} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider" htmlFor="division">Divisi</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">corporate_fare</span>
                                </div>
                                <select
                                    required
                                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-none [background-image:none] transition-all ${formData.division === "" ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"}`}
                                    id="division"
                                    value={formData.division}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            division: e.target.value,
                                            candidateId: '',
                                            password: '',
                                            confirmPassword: ''
                                        });
                                        setSelectedCandidate(null);
                                        setStep(1);
                                    }}
                                >
                                    <option value="" disabled className="text-slate-400">Pilih Divisi</option>
                                    {divisions.map((div) => (
                                        <option key={div.id} value={div.name} className="text-slate-900 dark:text-slate-900">
                                            {div.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider" htmlFor="candidateId">Nama & ID Karyawan</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">badge</span>
                                </div>
                                <select
                                    required
                                    disabled={!formData.division}
                                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-none [background-image:none] transition-all disabled:cursor-not-allowed disabled:opacity-60 ${formData.candidateId === "" ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"}`}
                                    id="candidateId"
                                    value={formData.candidateId}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>
                                        {formData.division ? 'Pilih nama yang disiapkan admin' : 'Pilih divisi terlebih dahulu'}
                                    </option>
                                    {registrationOptions.map((candidate) => (
                                        <option
                                            key={candidate.id}
                                            value={candidate.id}
                                            disabled={candidate.registrationStatus !== REGISTRATION_CANDIDATE_STATUS.READY}
                                        >
                                            {`${candidate.name} - ${candidate.employeeId || 'Tanpa ID'}${candidate.registrationStatus === REGISTRATION_CANDIDATE_STATUS.ACTIVE ? ' (Sudah Aktif)' : candidate.registrationStatus === REGISTRATION_CANDIDATE_STATUS.PENDING ? ' (Menunggu Persetujuan)' : ''}`}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
                                </div>
                            </div>
                            {formData.division && registrationOptions.length === 0 && (
                                <p className="text-xs text-amber-600 font-medium">
                                    Belum ada akun yang disiapkan untuk divisi ini. Minta admin menambahkannya dulu di Manajemen User.
                                </p>
                            )}
                        </div>

                        {step === 2 && selectedCandidate && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nama Karyawan</label>
                                        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">
                                            {selectedCandidate.name}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">ID Karyawan</label>
                                        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">
                                            {selectedCandidate.employeeId || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Terdaftar</label>
                                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                        {selectedCandidate.email}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider" htmlFor="password">Password</label>
                                        <input
                                            required
                                            id="password"
                                            type="password"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Minimal 6 karakter"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider" htmlFor="confirmPassword">Konfirmasi Password</label>
                                        <input
                                            required
                                            id="confirmPassword"
                                            type="password"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Ulangi password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 1 && (
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-4">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary">shield_lock</span>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">Tahap 1: Verifikasi identitas</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Pilih divisi lalu pilih identitas yang memang sudah dibuat admin untuk Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-4">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-amber-500">approval</span>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">Tahap 2: Aktivasi password</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Identitas Anda sudah dicek. Langkah terakhir tinggal membuat password lalu kirim permintaan persetujuan ke admin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        setFormData({
                                            ...formData,
                                            password: '',
                                            confirmPassword: ''
                                        });
                                    }}
                                    className="sm:w-40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-lg transition-all"
                                >
                                    Kembali
                                </button>
                            )}

                            <button disabled={loading} className="flex-1 bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50" type="submit">
                                {loading ? 'Memproses...' : step === 1 ? 'Lanjut Verifikasi' : 'Kirim Permintaan Aktivasi'}
                                {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            Sudah punya akun aktif?
                            <Link to="/login" className="text-primary font-bold hover:underline ml-1.5 transition-all">Masuk</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 Arsip Digital Hotel</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
