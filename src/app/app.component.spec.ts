import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import { AppComponent } from './app.component';
import { DataTableComponent } from './data-table/data-table.component';

describe('AppComponent', () => {
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [
        AppComponent,
        DataTableComponent
      ],
      providers: [
        {provide: ConnectionBackend, useClass: MockBackend},
        {provide: RequestOptions, useClass: BaseRequestOptions},
        Http,
      ]
    }).compileComponents();
    this.backend = TestBed.get(ConnectionBackend) as MockBackend;
    this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));
});
