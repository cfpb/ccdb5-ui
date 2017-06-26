import React from 'react';
import Aggregation from '../Aggregation';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    let options = [{key: 'foo', doc_count: 99}];

    const target = renderer.create(
      <Aggregation options={options} />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('show more', () => {
  let options;
  beforeEach(() => {
    options = [
      {key: 'alpha', doc_count: 99},
      {key: 'beta', doc_count: 99},
      {key: 'gamma', doc_count: 99},
      {key: 'delta', doc_count: 99},
      {key: 'epsilon', doc_count: 99},
      {key: 'zeta', doc_count: 99},
      {key: 'eta', doc_count: 99},
      {key: 'theta', doc_count: 99}
    ]
  })

  it('only shows the first 6 items of large arrays', () => {
    const target = renderer.create(
      <IntlProvider locale="en">
        <Aggregation options={options} />
      </IntlProvider>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })
})

