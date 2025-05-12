import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, MatCardModule,
    MatButtonModule,
    MatIconModule,],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<number>();
}
