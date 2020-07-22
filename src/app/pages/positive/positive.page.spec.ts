import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PositivePage } from './positive.page';

describe('PositivePage', () => {
  let component: PositivePage;
  let fixture: ComponentFixture<PositivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositivePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PositivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
