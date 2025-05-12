import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Note } from '../../models/note';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule],
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css'],
})
export class NoteFormComponent implements OnChanges {
  @Input() editingNote: Note | null = null;
  @Output() save = new EventEmitter<Note>();

  // Define the noteForm property but don't initialize it here
  noteForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    // Initialize the form in the constructor after fb is injected
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [''],
    });
  }

  ngOnChanges() {
    if (this.editingNote) {
      // Set form values when editing a note
      this.noteForm.setValue({
        title: this.editingNote.title,
        content: this.editingNote.content,
        tags: this.editingNote.tags.join(', '),
      });
    }
  }

  onSubmit() {
    if (this.noteForm.invalid) return;

    const formValue = this.noteForm.value;
    const tags = formValue.tags?.split(',').map((tag: string) => tag.trim()).filter(Boolean) ?? [];

    const note: Note = {
      id: this.editingNote?.id ?? Date.now(),
      title: formValue.title!,
      content: formValue.content!,
      tags,
    };

    this.save.emit(note);
    this.noteForm.reset();
  }
}
