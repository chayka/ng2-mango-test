import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '@angular/http';
import {Response, ResponseOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import { DataTableComponent } from './data-table.component';
import { By } from '@angular/platform-browser';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let compiled: any;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ DataTableComponent ],
      providers: [
        {provide: ConnectionBackend, useClass: MockBackend},
        {provide: RequestOptions, useClass: BaseRequestOptions},
        Http
      ]
    })
    .compileComponents();
    this.backend = TestBed.get(ConnectionBackend) as MockBackend;
    this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty url by default', () => {
    expect(component.url).toBeFalsy('No url specified by default');
  });

  it('should show empty data set message', () => {
    const div = compiled.querySelector('.empty-dataset');
    expect(div).toBeTruthy('empty dataset message shown');
    expect(div.innerText).toContain('No source data provided');
  });

  it('should request data when load() issued', () => {
    const div = compiled.querySelector('.empty-dataset');
    expect(div).toBeTruthy('empty dataset message shown');
    expect(div.innerText).toContain('No source data provided');
    component.url = '/api/data.json';
    component.load();
    fixture.detectChanges();
    expect(this.lastConnection).toBeDefined('no http service connection at all?');
    expect(this.lastConnection.request.url).toMatch(/api\/data\.json$/, 'url invalid');
  });

  it('should load data', fakeAsync(() => {
    let data = [];
    component.url = '/api/data.json';
    component.load().then(payload => data = payload);
    fixture.detectChanges();
    expect(this.lastConnection).toBeDefined('no http service connection at all?');
    this.lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({payload: [
        {id: 0, name: 'CCC'},
        {id: 1, name: 'AAA'},
        {id: 2, name: 'BBB'},
      ]}),
    })));
    tick();
    expect(data.length).toEqual(3, 'should contain given amount of rows');
    expect(component.getFields()).toContain('id', 'should contain id column');
    expect(component.getFields()).toContain('name', 'should contain name column');
  }));

  it('should set data', () => {
    const data = component.setData([
      {id: 0, name: 'CCC'},
      {id: 1, name: 'AAA'},
      {id: 2, name: 'BBB'},
    ]);
    expect(data.length).toEqual(3, 'should contain given amount of rows');
    expect(component.getFields()).toContain('id', 'should contain id column');
    expect(component.getFields()).toContain('name', 'should contain name column');
    expect(component.orderBy).toBe('id', 'should sort by first column');
    expect(component.orderAsc).toBe(true, 'should sort by first column asc');
  });

  it('should sort and resort data', () => {
    component.setData([
      {id: 0, name: 'CCC'},
      {id: 1, name: 'AAA'},
      {id: 2, name: 'BBB'},
    ]);

    let {orderBy, orderAsc} = component;
    const {fields} = component;
    let data = component.getData();

    function expectSorted() {
      let prev;
      data.forEach(row => {
        if (prev !== undefined) {
          switch (fields[orderBy]) {
            case 'string':
              prev = prev || '';
              row[orderBy] = row[orderBy] || '';
              break;
            case 'number':
              prev = prev || 0;
              row[orderBy] = row[orderBy] || 0;
              break;
          }
          if (orderAsc) {
            expect(row[orderBy]).toBeGreaterThanOrEqual(prev);
          } else {
            expect(row[orderBy]).toBeLessThanOrEqual(prev);
          }
        }
        prev = row[orderBy];
      });
    }

    expectSorted();

    fixture.detectChanges();
    const th = fixture.debugElement.queryAll(By.css('th'))
        .find(cell => cell.nativeElement.innerText.match(/name/i));

    expect(th).toBeTruthy('th name found');

    th.triggerEventHandler('click', null);

    fixture.detectChanges();
    expect(component.orderBy).toBe('name', 'order by changed');
    expect(component.orderAsc).toBe(true, 'order by changed');

    data = component.getData();

    orderBy = component.orderBy;
    orderAsc = component.orderAsc;
    expectSorted();

    th.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.orderBy).toBe('name', 'order by changed');
    expect(component.orderAsc).toBe(false, 'order by changed');

    data = component.getData();

    orderBy = component.orderBy;
    orderAsc = component.orderAsc;
    expectSorted();

  });

  it('should search data', () => {
    component.setData([
      {id: 0, name: 'Foo'},
      {id: 1, name: 'Bar'},
      {id: 2, name: 'Foo Foo'},
    ]);

    component.query = 'foo';

    let data = component.getData();
    let ids = data.map(row => row.id);

    expect(ids).toContain(0, 'need right ids');
    expect(ids).not.toContain(1, 'need right ids');
    expect(ids).toContain(2, 'need right ids');

    component.query = 'bar';

    data = component.getData();
    ids = data.map(row => row.id);

    expect(ids).not.toContain(0, 'need right ids');
    expect(ids).toContain(1, 'need right ids');
    expect(ids).not.toContain(2, 'need right ids');

    fixture.detectChanges();
  });

});
