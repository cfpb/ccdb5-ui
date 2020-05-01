import React from 'react';
import renderer from 'react-test-renderer';
import { Select } from '../components/RefineBar/Select';

describe('component:Select', () => {
  it('renders array values without crashing', () => {
    const options = ['Uno', 'Dos', 'Tres']
    const target = renderer.create(
      <Select label={ 'Select something' }
              title={ 'Show sumthing' }
              values={ options }
              id={ 'txt' }
              value={ 'Dos' }
              handleChange={ jest.fn() }/>
    );

    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders object values without crashing', () => {
    const options = {
      10: '10 results',
      25: '25 results',
      50: '50 results',
      100: '100 results'
    }
    const target = renderer.create(
      <Select label={ 'Select size' }
              title={ 'Show' }
              values={ options }
              id={ 'size' }
              value={ 10 }
              handleChange={ jest.fn() }/>
    );

    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
