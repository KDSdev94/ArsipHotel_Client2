import React, { useState, useEffect } from 'react';
import NavigasiSamping from '../components/dashboard/sidebar/NavigasiSamping';
import HeaderAtas from '../components/dashboard/header/HeaderAtas';
import FilterPencarian from '../components/dashboard/umum/FilterPencarian';
import TabelDokumen from '../components/dashboard/dokumen/TabelDokumen';
import { useSupabase } from '../contexts/SupabaseContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import Footer from '../components/dashboard/umum/Footer';
import { useFirestore } from '../contexts/FirestoreContext';
import { useLocation } from 'react-router-dom';

import Layout from '../components/layout/Layout';

const Home = () => {
    const location = useLocation();
    const { getArchives, getArchivesByDivision } = useSupabase();
    const { isAdmin, getUserDivision, getVisibleDivisions } = useUserProfile();
    const { getDocuments } = useFirestore();
    const [archives, setArchives] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDivisi, setSelectedDivisi] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const fetchInitialData = React.useCallback(async () => {
        setLoading(true);

        // Ambil Arsip berdasarkan Role
        let arcResult;
        if (isAdmin()) {
            arcResult = await getArchives();
        } else {
            const userDiv = getUserDivision();
            if (userDiv) {
                arcResult = await getArchivesByDivision(userDiv);
            } else {
                arcResult = { success: true, data: [] };
            }
        }

        if (arcResult.success) setArchives(arcResult.data);

        // Ambil Divisi
        const divResult = await getDocuments('divisions');
        if (divResult.success) setDivisions(getVisibleDivisions(divResult.data));

        setLoading(false);
    }, [getArchives, getArchivesByDivision, getDocuments, getUserDivision, getVisibleDivisions, isAdmin]);

    useEffect(() => {
        const initFetch = async () => {
            await Promise.resolve();
            fetchInitialData();
        };
        initFetch();

        // Auto reload saat window dapet focus lagi (misal abis dari tab lain)
        window.addEventListener('focus', fetchInitialData);
        return () => window.removeEventListener('focus', fetchInitialData);
    }, [location.pathname, fetchInitialData]); // Re-fetch tiap pindah halaman

    const filteredArchives = archives.filter(item => {
        const matchesSearch = (item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nomorArsip?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesDivisi = selectedDivisi === '' || item.divisi === selectedDivisi;
        const matchesType = selectedType === '' || item.fileType?.toLowerCase().includes(selectedType.toLowerCase());

        return matchesSearch && matchesDivisi && matchesType;
    });

    return (
        <Layout title="Pustaka Dokumen">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[#111318] dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                        Beranda Arsip Digital
                    </h1>
                    <p className="text-[#616f89] dark:text-gray-400 text-sm md:text-base font-normal">
                        {isAdmin()
                            ? 'Kelola, cari, dan atur semua aset arsip hotel dengan efisien.'
                            : `Pustaka dokumen digital khusus Divisi ${getUserDivision() || 'Anda'}.`
                        }
                    </p>
                </div>
            </div>

            <FilterPencarian
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedDivisi={selectedDivisi}
                setSelectedDivisi={setSelectedDivisi}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                divisions={divisions}
                totalResults={filteredArchives.length}
            />

            <TabelDokumen
                data={filteredArchives.slice(0, 10)}
                loading={loading}
                onDeleteSuccess={(deletedId) => {
                    // Optimistic update: langsung hapus dari state biar cepet
                    setArchives(prev => prev.filter(a => a.id !== deletedId));
                }}
            />
        </Layout>
    );
};

export default Home;
