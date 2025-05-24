import React, { useState } from 'react';
import { NoteFormValues } from './NoteModals';

interface NoteFormProps {
    initialValues?: {
        title: string;
        content: string;
        tags: string;
        isPublic: boolean;
    };
    onSubmit: (values: NoteFormValues) => void;
    onCancel: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ 
    initialValues = {
        title: '',
        content: '',
        tags: '',
        isPublic: false
    }, 
    onSubmit, 
    onCancel 
}) => {
    const [values, setValues] = useState(initialValues);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: string, value: string | boolean) => {
        setValues(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await onSubmit({
                ...values,
                tags: values.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-1">(min. 5 caractères)</span>
                </label>
                <input
                    id="title"
                    type="text"
                    placeholder="Donnez un titre à votre note"
                    value={values.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength={5}
                    autoFocus
                />
                <p className="mt-1 text-xs text-gray-500">
                    {values.title.length}/5 caractères
                </p>
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Contenu <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-1">(min. 10 caractères)</span>
                </label>
                <textarea
                    id="content"
                    placeholder="Détaillez votre note..."
                    value={values.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={5}
                    required
                    minLength={10}
                />
                <p className="mt-1 text-xs text-gray-500">
                    {values.content.length}/10 caractères
                </p>
            </div>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                </label>
                <input
                    id="tags"
                    type="text"
                    placeholder="mots-clés, séparés par des virgules"
                    value={values.tags}
                    onChange={(e) => handleChange("tags", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="flex items-center">
                <input
                    id="isPublic"
                    type="checkbox"
                    checked={values.isPublic}
                    onChange={(e) => handleChange("isPublic", e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                    Rendre cette note publique
                </label>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
};