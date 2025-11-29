import { useCallback, useEffect, useState } from "react";
import api from "../configs/axios";

const useAboutSection = (sectionKey) => {
    const [section, setSection] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const fetchSection = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/about/${sectionKey}`);
            setSection(data.section);
            setItems(data.items || []);
            setError(null);
        } catch (fetchError) {
            setError(fetchError?.message || "Unable to load section");
        } finally {
            setLoading(false);
        }
    }, [sectionKey]);

    useEffect(() => {
        fetchSection();
    }, [fetchSection]);

    const updateSection = async (payload) => {
        setSaving(true);
        try {
            const { data } = await api.put(`/about/${sectionKey}`, payload);
            setSection(data.section);
            setError(null);
            return data.section;
        } catch (updateError) {
            setError(updateError?.message || "Unable to update section");
            throw updateError;
        } finally {
            setSaving(false);
        }
    };

    const createItem = async (payload) => {
        const { data } = await api.post(`/about/${sectionKey}/items`, payload);
        setItems((prev) => [...prev, data.item]);
        return data.item;
    };

    const updateItem = async (id, payload) => {
        const { data } = await api.put(`/about/${sectionKey}/items/${id}`, payload);
        setItems((prev) => prev.map((item) => (item.id === id ? data.item : item)));
        return data.item;
    };

    const deleteItem = async (id) => {
        await api.delete(`/about/${sectionKey}/items/${id}`);
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return {
        section,
        items,
        loading,
        saving,
        error,
        fetchSection,
        updateSection,
        createItem,
        updateItem,
        deleteItem,
    };
};

export default useAboutSection;
