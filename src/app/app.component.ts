import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { NoteListComponent } from './components/note-list/note-list.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Note } from './models/note';
import { NoteService } from './services/note.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NoteFormComponent,
    NoteListComponent,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  editingNote: Note | null = null;

  // Initialize form group with an empty object
  filterForm: FormGroup;

  constructor(private readonly noteService: NoteService, private readonly fb: FormBuilder) {
    // Initialize the filter form correctly in the constructor
    this.filterForm = this.fb.group({
      title: [''],
      tags: ['']
    });
  }

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.notes = this.noteService.getNotes();
    this.filteredNotes = [...this.notes];
  }

  onSave(note: Note) {
    if (this.editingNote) {
      this.noteService.updateNote(note);
    } else {
      this.noteService.addNote(note);
    }
    this.loadNotes();
    this.editingNote = null;
  }

  onEdit(note: Note) {
    this.editingNote = note;
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(id);
      this.loadNotes();
      this.applyFilters();
    }
  }

  applyFilters() {
    const { title, tags } = this.filterForm.value;
    const tagArray = tags?.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean) ?? [];

    this.filteredNotes = this.notes.filter(note => {
      const matchesTitle = title
        ? note.title.toLowerCase().includes(title.toLowerCase())
        : true;

      const matchesTags = tagArray.length
        ? tagArray.some((tag: string) => note.tags.map(t => t.toLowerCase()).includes(tag))
        : true;

      return matchesTitle && matchesTags;
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filteredNotes = [...this.notes];
  }
}
