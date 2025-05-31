import React, { useCallback, useMemo, useState } from "react";
import { INote } from "../../types/INote";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../atoms/LoadingSpinner";
import { EmptyState } from "../atoms/EmptyState";
import { TNoteListSearchOptions } from "../../types/SearchOptions";
import { useNotes } from "../../hooks/useNotes";
import { useNoteFiltering } from "../../hooks/useNoteFiltering";
import { NoteListHeader } from "../atoms/NoteListHeader";
import { NoteGrid } from "../molecules/NoteGrid";
import { NoteModals } from "../molecules/NoteModals";
import { NetworkStatusIndicator } from "../molecules/NetworkStatusIndicator";

interface NoteFormValues {
    title: string;
    content: string;
    tags: string[];
    isPublic: boolean;
}

const NoteList: React.FC<TNoteListSearchOptions> = ({
  query,
  sortBy,
  filterBy,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<INote | null>(null);

  const { user } = useAuth();

  const {
    notes,
    loading,
    addNewNote,
    updateExistingNote,
    removeNote,
    toggleNoteFavorite,
    shareNote,
  } = useNotes(user?.uid);

  const displayedNotes = useNoteFiltering(
    notes,
    query,
    filterBy,
    sortBy,
    user?.uid
  );

  const handleAddNote = useCallback(
    async (values: NoteFormValues) => {
      if (!user) return;
      try {
        await addNewNote({
          ...values,
          ownerId: user.uid,
          ownerEmail: user.email,
        });
        setShowAddForm(false);
      } catch (error) {
        console.error("Error adding note:", error);
        setShowAddForm(false);
      }
    },
    [user, addNewNote]
  );

  const handleEditNote = useCallback(
    async (values: Partial<INote>) => {
      if (!noteToEdit?.id) return;
      try {
        await updateExistingNote(noteToEdit.id, values);
        setNoteToEdit(null);
      } catch (error) {
        console.error("Erreur modification :", error);
        setNoteToEdit(null);
      }
    },
    [noteToEdit, updateExistingNote]
  );

  const handleToggleVisibility = useCallback(
    async (e: React.MouseEvent, note: INote) => {
      e.stopPropagation();
      if (!note.id) return;
      await updateExistingNote(note.id, { isPublic: !note.isPublic });
    },
    [updateExistingNote]
  );

  const handleDeleteNote = useCallback(
    async (e: React.MouseEvent, noteId: string) => {
      e.stopPropagation();
      if (!window.confirm("Supprimer cette note ?")) return;
      await removeNote(noteId);
    },
    [removeNote]
  );

  const handleToggleFavorite = useCallback(
    async (e: React.MouseEvent, note: INote) => {
      e.stopPropagation();
      if (!note.id) return;
      await toggleNoteFavorite(note.id, !note.isFavorite);
    },
    [toggleNoteFavorite]
  );

  const handleShare = useCallback(
    async (note: INote, email: string) => {
      if (!note.id || !user?.uid) return;
      try {
        await shareNote(note.id, email, user.uid);
        alert("Note partagée avec succès !");
      } catch (error) {
        console.error("Erreur partage :", error);
        alert(error instanceof Error ? error.message : "Erreur lors du partage.");
      }
    },
    [user?.uid, shareNote]
  );

  const editFormInitialValues = useMemo(
    () => ({
      title: noteToEdit?.title ?? "",
      content: noteToEdit?.content ?? "",
      tags: noteToEdit?.tags?.join(", ") ?? "",
      isPublic: noteToEdit?.isPublic ?? false,
    }),
    [noteToEdit]
  );

  if (loading) {
    return (
      <div className="mt-3">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-4 gap-1">
        <NetworkStatusIndicator 
          showDetailedMessages={true}
          notesCount={notes.length}
        />
        <NoteListHeader
          onAddNote={() => setShowAddForm(true)}
          isAuthenticated={!!user}
        />
      </div>

      <NoteModals
        showAddForm={showAddForm}
        noteToEdit={noteToEdit}
        onCloseAddForm={() => setShowAddForm(false)}
        onCloseEditForm={() => setNoteToEdit(null)}
        onSubmitAdd={handleAddNote}
        onSubmitEdit={handleEditNote}
        editFormInitialValues={editFormInitialValues}
      />

      {displayedNotes.length === 0 ? (
        <EmptyState
          message="Aucune note disponible."
          actionText="Créer votre première note"
          onAction={() =>
            user
              ? setShowAddForm(true)
              : alert("Veuillez vous connecter pour ajouter une note.")
          }
        />
      ) : (
        <NoteGrid
          notes={displayedNotes}
          expandedNote={expandedNote}
          currentUserId={user?.uid}
          onToggleExpand={(id) =>
            setExpandedNote((prev) => (prev === id ? null : id))
          }
          onToggleVisibility={handleToggleVisibility}
          onEdit={setNoteToEdit}
          onDelete={handleDeleteNote}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
        />
      )}
    </div>
  );
};

export default NoteList;