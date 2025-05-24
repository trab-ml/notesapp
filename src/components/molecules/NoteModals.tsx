import React from "react";
import { Modal } from "../molecules/Modal";
import { NoteForm } from "../molecules/NoteForm";
import { INote } from "../../types/INote";

export interface NoteFormValues {
    title: string;
    content: string;
    tags: string[];
    isPublic: boolean;
}

interface NoteModalsProps {
    showAddForm: boolean;
    noteToEdit: INote | null;
    onCloseAddForm: () => void;
    onCloseEditForm: () => void;
    onSubmitAdd: (values: NoteFormValues) => void;
    onSubmitEdit: (values: NoteFormValues) => void;
    editFormInitialValues?: {
        title: string;
        content: string;
        tags: string;
        isPublic: boolean;
    };
}

export const NoteModals: React.FC<NoteModalsProps> = ({
    showAddForm,
    noteToEdit,
    onCloseAddForm,
    onCloseEditForm,
    onSubmitAdd,
    onSubmitEdit,
    editFormInitialValues,
}) => {
    return (
        <>
            <Modal
                isOpen={showAddForm}
                onClose={onCloseAddForm}
                title="Nouvelle Note"
            >
                <NoteForm
                    onSubmit={onSubmitAdd}
                    onCancel={onCloseAddForm}
                />
            </Modal>

            <Modal
                isOpen={!!noteToEdit}
                onClose={onCloseEditForm}
                title="Modifier la note"
            >
                <NoteForm
                    initialValues={editFormInitialValues}
                    onSubmit={onSubmitEdit}
                    onCancel={onCloseEditForm}
                />
            </Modal>
        </>
    );
};