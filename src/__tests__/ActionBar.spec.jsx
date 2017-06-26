import React from 'react';
import { IntlProvider } from 'react-intl';
import { ActionBar} from '../ActionBar';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <IntlProvider locale="en">
        <ActionBar total="100" hits="10" />
      </IntlProvider>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

