/* tslint:disable:no-unused-variable */
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { routerForTesting } from './../../app.router';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { TwigletFiltersComponent } from './twiglet-filters.component';
import { TwigletFilterTargetComponent } from './../twiglet-filter-target/twiglet-filter-target.component';
import USERSTATE from '../../../non-angular/services-helpers/userState/constants';
import VIEW from '../../../non-angular/services-helpers/twiglet/constants/view';
import VIEW_DATA from '../../../non-angular/services-helpers/twiglet/constants/view/data';

describe('TwigletFiltersComponent', () => {
  let component: TwigletFiltersComponent;
  let fixture: ComponentFixture<TwigletFiltersComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletFiltersComponent, TwigletFilterTargetComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: {
            firstChild: { params: Observable.of({name: 'name1'}) },
            params: Observable.of({name: 'name1'}),
          }
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletFiltersComponent);
    component = fixture.componentInstance;
    component.twiglet = fromJS({
      nodes: [],
    });
    component.userState = fromJS({
      [USERSTATE.LEVEL_FILTER_MAX]: 5,
    })
    component.viewData = fromJS({
      [VIEW_DATA.FILTERS]: {
        attributes: [],
        types: {},
      },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngChanges', () => {
    it('updates the filters from the viewData', () => {
      spyOn(component, 'updateForm');
      const changes = {
        viewData: {
          currentValue: fromJS({
            filters: { some: 'filters' }
          }),
        }
      };
      component.ngOnChanges(changes as any);
      expect(component.updateForm).toHaveBeenCalledWith(changes.viewData.currentValue.get(VIEW_DATA.FILTERS).toJS());
    });

    it('does not error if there are no userState changes', () => {
      const changes = {};
      expect(() => component.ngOnChanges(changes)).not.toThrow();
    });
  });

  describe('keys', () => {
    it('creates a non-repeating array of keys', () => {
      component.twiglet = fromJS({
        nodes: [
          { type: 'type1', attrs: [ { key: 'key1' } ] },
          { type: 'type2', attrs: [ { key: 'key2' } ] },
          { type: 'type2', attrs: [ { key: 'key1' } ] },
          { type: 'type1', attrs: [ { key: 'key3' } ] },
          { type: 'type3', attrs: [ { key: 'key2' } ] },
        ]
      });
      expect(component.keys(new FormGroup({}))).toEqual(['key1', 'key2', 'key3']);
    });

    it('creates a non-repeating array of keys but filtered by type', () => {
      component.twiglet = fromJS({
        nodes: [
          { type: 'type1', attrs: [ { key: 'key1' } ] },
          { type: 'type2', attrs: [ { key: 'key2' } ] },
          { type: 'type2', attrs: [ { key: 'key1' } ] },
          { type: 'type1', attrs: [ { key: 'key3' } ] },
          { type: 'type3', attrs: [ { key: 'key2' } ] },
        ]
      });
      expect(component.keys(new FormGroup({ type: new FormControl('type1') }))).toEqual(['key1', 'key3']);
    });
  });

  describe('values', () => {
    it('returns an empty array if the attribute is not set', () => {
      const attributeFormControl = new FormGroup({
        key: new FormControl(),
      });
      expect(component.values(attributeFormControl)).toEqual([]);
    });

    it('returns an array of possible values to match a key', () => {
      const attributeFormControl = new FormGroup({
        key: new FormControl('key1'),
      });
      component.twiglet = fromJS({
        nodes: [
          {
            attrs: [
              {
                key: 'key1',
                value: 'match1',
              },
              {
                key: 'key2',
                value: 'nonmatch1',
              }
            ]
          },
          {
            attrs: [
              {
                key: 'key1',
                value: 'match2',
              },
              {
                key: 'key3',
                value: 'nonmatch2',
              }
            ]
          },
        ]
      });
      expect(component.values(attributeFormControl)).toEqual(['match1', 'match2']);
    });
  });

  describe('buildForm', () => {
    it('updates the level filter on form changes', () => {
      spyOn(stateServiceStubbed.twiglet.viewService, 'setLevelFilter').and.callThrough();
      component.levelSelectForm.patchValue({ level: '3' });
      expect(stateServiceStubbed.twiglet.viewService.setLevelFilter).toHaveBeenCalledWith('3');
    });
  });

  describe('updateForm', () => {
    it('does not error if the filters not an array (before userState is updated)', () => {
      expect(component.updateForm.bind(component)).not.toThrow();
    });

    it('keeps track of whether an update came from itself', () => {
      component.selfUpdated = true;
      component.updateForm([]);
      expect(component.selfUpdated).toBeFalsy();
    });

    it('resets the form with the new information', () => {
      const form1 = component.form;
      component.updateForm([]);
      expect(component.form).not.toBe(form1);
    });
  });

  describe('createFilter', () => {
    it('creates a filter with existing attributes', () => {
      const filter = {
        attributes: [{ key: 'key1', value: 'value1' }],
      };
      expect(component.createFilter(filter).controls.attributes).not.toBeUndefined();
    });

    it('creates a filter with existing attributes', () => {
      const filter = {
        attributes: [],
        type: 'type1'
      };
      expect(component.createFilter(filter).controls.type.value).toEqual('type1');
    });

    it('creates a target filter', () => {
      const filter = {
        _target: {
          attributes: [],
          type: 'type2',
        },
        attributes: [],
        type: 'type1',
      };
      expect(component.createFilter(filter).controls._target).not.toBeUndefined();
    });

    it('can return an empty filter', () => {
      expect(component.createFilter().controls.type.value).toEqual('');
    });
  });

  describe('createAttribute', () => {
    it('can create an attribute with an existing key', () => {
      expect(component.createAttribute({ key: 'key1'}).controls.key.value).toEqual('key1');
    });

    it('can create an attribute with an existing value', () => {
      expect(component.createAttribute({ value: 'value1'}).controls.value.value).toEqual('value1');
    });

    it('can create a blank attribute', () => {
      const attribute = component.createAttribute();
      expect(attribute.controls.key.value).toEqual('');
      expect(attribute.controls.value.value).toEqual('');
    });
  });

  describe('addTarget', () => {
    it('adds a target filter', () => {
      component.addTarget(0);
      expect(component.form.controls[0]['controls']._target.controls).not.toBeUndefined();
    });

    it('updates the filters', () => {
      spyOn(stateServiceStubbed.twiglet.viewService, 'setFilter');
      component.addTarget(0);
      expect(stateServiceStubbed.twiglet.viewService.setFilter).toHaveBeenCalled();
    });
  });

  describe('removeTarget', () => {
    it('removes a target filter', () => {
      component.addTarget(0);
      component.removeTarget(0);
      expect(component.form.controls[0]['controls']._target).toBeUndefined();
    });

    it('updates the filters', () => {
      spyOn(stateServiceStubbed.twiglet.viewService, 'setFilter');
      component.addTarget(0);
      expect(stateServiceStubbed.twiglet.viewService.setFilter).toHaveBeenCalled();
    });
  });

  describe('addFilter', () => {
    it('adds a filter', () => {
      component.addFilter();
      expect(component.form.controls.length).toEqual(2);
    });

    it('updates the filters', () => {
      spyOn(stateServiceStubbed.twiglet.viewService, 'setFilter');
      component.addFilter();
      expect(stateServiceStubbed.twiglet.viewService.setFilter).toHaveBeenCalled();
    });
  });

  describe('addFilter', () => {
    it('adds a filter', () => {
      component.addFilter();
      component.removeFilter(1);
      expect(component.form.controls.length).toEqual(1);
    });

    it('updates the filters', () => {
      component.addFilter();
      spyOn(stateServiceStubbed.twiglet.viewService, 'setFilter');
      component.removeFilter(1);
      expect(stateServiceStubbed.twiglet.viewService.setFilter).toHaveBeenCalled();
    });
  });

  describe('updateFilters', () => {
    it('updates the filters', () => {
      spyOn(stateServiceStubbed.twiglet.viewService, 'setFilter');
      component.updateFilters({ target: { value: 'some value' } });
      expect(stateServiceStubbed.twiglet.viewService.setFilter).toHaveBeenCalled();
    });
  });
});
