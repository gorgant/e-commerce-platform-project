import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderDetailsDialogueComponent } from './edit-order-details-dialogue.component';

describe('ShippingDetailsComponent', () => {
  let component: EditOrderDetailsDialogueComponent;
  let fixture: ComponentFixture<EditOrderDetailsDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrderDetailsDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrderDetailsDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
