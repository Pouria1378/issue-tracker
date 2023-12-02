import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { IssuesService } from '../issues.service';
import { Issue } from '../issue';

interface IssueForm {
  title: FormControl<string>;
  description: FormControl<string>;
  priority: FormControl<string>;
  type: FormControl<string>;
}

@Component({
  selector: 'app-issue-edit',
  templateUrl: './issue-edit.component.html',
  styleUrls: ['./issue-edit.component.css'],
})
export class IssueEditComponent implements OnInit {
  @Output() formClose = new EventEmitter();
  @Input() issue: Issue | any = {
    issueNo: 0,
    title: '',
    description: '',
    priority: 'low',
    type: 'Bug',
  };
  suggestions: Issue[] = [];

  constructor(private issueService: IssuesService) {}

  ngOnInit(): void {
    this.issueEditForm.controls.title.valueChanges.subscribe((title) => {
      this.suggestions = this.issueService.getSuggestions(title);
    });

    this.issueEditForm.patchValue({
      title: this.issue.title,
      description: this.issue.description,
      priority: this.issue.priority,
      type: this.issue.type,
    });
  }

  issueEditForm = new FormGroup<IssueForm>({
    title: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
    priority: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    type: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  editIssue() {
    this.issueService.editIssue({
      issueNo: this.issue.issueNo,
      ...this.issueEditForm.getRawValue(),
    } as Issue);
    this.formClose.emit();
  }
}
