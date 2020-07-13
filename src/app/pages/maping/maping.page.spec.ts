import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapingPage } from './maping.page';

describe('MapingPage', () => {
  let component: MapingPage;
  let fixture: ComponentFixture<MapingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
