import { Injectable } from '@angular/core';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private readonly storageKey = 'notes';

  getNotes(): Note[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addNote(note: Note): void {
    const notes = this.getNotes();
    note.id = this.generateId(notes);
    notes.push(note);
    this.saveNotes(notes);
  }

  updateNote(updatedNote: Note): void {
    const notes = this.getNotes().map(note =>
      note.id === updatedNote.id ? updatedNote : note
    );
    this.saveNotes(notes);
  }

  deleteNote(id: number): void {
    const notes = this.getNotes().filter(note => note.id !== id);
    this.saveNotes(notes);
  }

  private saveNotes(notes: Note[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(notes));
  }

  private generateId(notes: Note[]): number {
    return notes.length ? Math.max(...notes.map(n => n.id || 0)) + 1 : 1;
  }
}
