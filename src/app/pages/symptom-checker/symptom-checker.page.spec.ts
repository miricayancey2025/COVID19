import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SymptomCheckerPage } from './symptom-checker.page';

describe('SymptomCheckerPage', () => {
  let component: SymptomCheckerPage;
  let fixture: ComponentFixture<SymptomCheckerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymptomCheckerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SymptomCheckerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
