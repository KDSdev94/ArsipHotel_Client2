import React, { createContext, useContext } from 'react';
import { supabase } from '../supabase/config';

const SupabaseContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (!context) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context;
};

export const SupabaseProvider = ({ children }) => {

    // Storage and DB CRUD for Archives (Arsip)
    const uploadFile = async (file, onProgress = null, path = 'documents') => {
        try {
            const cleanFileName = file.name.replace(/[^\w.-]/g, '_');
            const fileName = `${Date.now()}_${cleanFileName}`;
            const filePath = `${path}/${fileName}`;

            const { error } = await supabase.storage
                .from('archives')
                .upload(filePath, file, {
                    onUploadProgress: (progress) => {
                        if (onProgress) {
                            const percent = (progress.loaded / progress.total) * 100;
                            onProgress(Math.round(percent));
                        }
                    }
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('archives')
                .getPublicUrl(filePath);

            return { success: true, url: publicUrl, path: filePath };
        } catch (error) {
            console.error('Error uploading file:', error);
            return { success: false, error: error.message };
        }
    };

    // CRUD for Archives (Arsip)
    const addArchive = async (data) => {
        try {
            const { data: result, error } = await supabase
                .from('archives')
                .insert([
                    {
                        ...data,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ])
                .select();

            if (error) throw error;
            return { success: true, data: result[0] };
        } catch (error) {
            console.error('Error adding archive:', error);
            return { success: false, error: error.message };
        }
    };

    const getArchives = async () => {
        try {
            const { data, error } = await supabase
                .from('archives')
                .select('*')
                .or('is_deleted.is.null,is_deleted.eq.false')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting archives:', error);
            return { success: false, error: error.message };
        }
    };

    // Get archives filtered by division (untuk Staf)
    const getArchivesByDivision = async (division) => {
        try {
            const { data, error } = await supabase
                .from('archives')
                .select('*')
                .eq('divisi', division)
                .or('is_deleted.is.null,is_deleted.eq.false')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting archives by division:', error);
            return { success: false, error: error.message };
        }
    };

    const getArchiveById = async (id) => {
        try {
            const { data, error } = await supabase
                .from('archives')
                .select('*')
                .eq('id', id)
                .or('is_deleted.is.null,is_deleted.eq.false')
                .maybeSingle();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting archive by id:', error);
            return { success: false, error: error.message };
        }
    };

    const getDeletedArchives = async (division = null) => {
        try {
            let query = supabase
                .from('archives')
                .select('*')
                .eq('is_deleted', true);

            if (division) {
                query = query.eq('divisi', division);
            }

            const { data, error } = await query.order('deleted_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting deleted archives:', error);
            return { success: false, error: error.message };
        }
    };

    const updateArchive = async (id, data) => {
        try {
            const { data: result, error } = await supabase
                .from('archives')
                .update({
                    ...data,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!result || result.length === 0) {
                return { success: false, error: 'Gagal memperbarui: Data tidak ditemukan atau terhalang izin RLS.' };
            }
            return { success: true };
        } catch (error) {
            console.error('Error updating archive:', error);
            return { success: false, error: error.message };
        }
    };

    const softDeleteArchive = async (id) => {
        try {
            console.log('Memproses soft delete untuk ID:', id);
            const { data: result, error, status } = await supabase
                .from('archives')
                .update({
                    is_deleted: true,
                    deleted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select();

            if (error) {
                console.error('Supabase Error:', error);
                throw error;
            }

            console.log('Status HTTP:', status);
            console.log('Hasil Update:', result);

            if (!result || result.length === 0) {
                return { success: false, error: 'Gagal memindahkan ke sampah: Data tidak ditemukan atau terhalang izin RLS. (Cek tabel archives di Supabase)' };
            }
            return { success: true };
        } catch (error) {
            console.error('Error soft deleting archive:', error);
            return { success: false, error: error.message };
        }
    };

    const restoreArchive = async (id) => {
        try {
            const { data: result, error } = await supabase
                .from('archives')
                .update({
                    is_deleted: false,
                    deleted_at: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!result || result.length === 0) {
                return { success: false, error: 'Gagal memulihkan: Data tidak ditemukan atau terhalang izin RLS.' };
            }
            return { success: true };
        } catch (error) {
            console.error('Error restoring archive:', error);
            return { success: false, error: error.message };
        }
    };

    const deleteArchive = async (id, filePath = null) => {
        try {
            // 1. Hapus record dari Database dan minta data yang dihapus balik
            const { data, error } = await supabase
                .from('archives')
                .delete()
                .eq('id', id)
                .select(); // Penting: biar tau ada yang beneran dihapus gak

            if (error) throw error;

            // Jika data kosong, berarti tidak ada barisan yang cocok (atau RLS blokir)
            if (!data || data.length === 0) {
                console.warn('No record deleted. Check ID or RLS policies.');
                return {
                    success: false,
                    error: 'Data tidak ditemukan atau Anda tidak memiliki izin untuk menghapus (RLS).'
                };
            }

            // 2. Jika ada filePath, hapus juga filenya dari Storage
            if (filePath) {
                const { error: storageError } = await supabase.storage
                    .from('archives')
                    .remove([filePath]);

                if (storageError) {
                    console.warn('DB Deleted but Storage error:', storageError);
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error deleting archive:', error);
            return { success: false, error: error.message || 'Gagal menghapus data dari server' };
        }
    };

    const value = {
        uploadFile,
        addArchive,
        getArchives,
        getArchivesByDivision,
        getArchiveById,
        getDeletedArchives,
        updateArchive,
        softDeleteArchive,
        restoreArchive,
        deleteArchive
    };

    return (
        <SupabaseContext.Provider value={value}>
            {children}
        </SupabaseContext.Provider>
    );
};
