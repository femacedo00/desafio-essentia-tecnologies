import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLogsModal } from './task-logs-modal';

describe('TaskLogsModal', () => {
  let component: TaskLogsModal;
  let fixture: ComponentFixture<TaskLogsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskLogsModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskLogsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
