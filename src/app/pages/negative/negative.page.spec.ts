import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NegativePage } from './negative.page';

describe('NegativePage', () => {
  let component: NegativePage;
  let fixture: ComponentFixture<NegativePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegativePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NegativePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
