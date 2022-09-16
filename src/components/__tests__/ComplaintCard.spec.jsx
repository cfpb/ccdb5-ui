import React from 'react';
import { IntlProvider } from 'react-intl';
import ComplaintCard from '../List/ComplaintCard';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router';

describe('initial state', () => {
  let item;
  beforeEach(() => {
    item = {
      company: 'ABC Corp',
      company_public_response: 'Lorem',
      company_response: 'Ipsum',
      complaint_id: '99990909',
      complaint_what_happened: 'Oh baby you. Got what I need',
      consumer_consent_provided: 'Yes',
      consumer_disputed: 'Yes',
      date_received: '2013-02-03T12:00:00Z',
      date_sent_to_company: '2013-01-01T12:00:00Z',
      issue: 'Alpha',
      product: 'Beta',
      state: 'DC',
      sub_issue: 'Gamma',
      sub_product: 'Delta',
      submitted_via: 'Email',
      timely: 'Yes',
      zip_code: '20008',
      foo: 'do not show this',
    };
  });

  it('renders without crashing', () => {
    const target = renderer.create(
      <MemoryRouter>
        <IntlProvider locale="en">
          <ComplaintCard key={item.complaint_id} row={item} />
        </IntlProvider>
      </MemoryRouter>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toContain('foo');
  });

  it('hides the section when there is no narrative', () => {
    delete item.complaint_what_happened;
    const target = renderer.create(
      <MemoryRouter>
        <IntlProvider locale="en">
          <ComplaintCard key={item.complaint_id} row={item} />
        </IntlProvider>
      </MemoryRouter>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toContain('Oh baby you');
  });

  it('includes an overflow link when the narrative is long', () => {
    item.complaint_what_happened =
      "Call me Ishmael. Some years ago- never \
mind how long precisely- having little or no money in my purse, and \
nothing particular to interest me on shore, I thought I would sail about \
a little and see the watery part of the world. It is a way I have of \
driving off the spleen and regulating the circulation. Whenever I find \
myself growing grim about the mouth; whenever it is a damp, drizzly \
November in my soul; whenever I find myself involuntarily pausing before \
coffin warehouses, and bringing up the rear of every funeral I meet; and \
especially whenever my hypos get such an upper hand of me, that it \
requires a strong moral principle to prevent me from deliberately \
stepping into the street, and methodically knocking people's hats off- \
then, I account it high time to get to sea as soon as I can. This is my \
substitute for pistol and ball. With a philosophical flourish Cato throws \
himself upon his sword; I quietly take to the ship. There is nothing \
surprising in this. If they but knew it, almost all men in their degree, \
some time or other, cherish very nearly the same feelings towards the \
ocean with me.";
    const target = renderer.create(
      <MemoryRouter>
        <IntlProvider locale="en">
          <ComplaintCard key={item.complaint_id} row={item} />
        </IntlProvider>
      </MemoryRouter>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toContain('November');
  });

  it('hides the section when there is no sub-issue', () => {
    delete item.sub_issue;
    const target = renderer.create(
      <MemoryRouter>
        <IntlProvider locale="en">
          <ComplaintCard key={item.complaint_id} row={item} />
        </IntlProvider>
      </MemoryRouter>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toContain('Gamma');
  });

  it('hides the section when there is no sub-product', () => {
    delete item.sub_product;
    const target = renderer.create(
      <MemoryRouter>
        <IntlProvider locale="en">
          <ComplaintCard key={item.complaint_id} row={item} />
        </IntlProvider>
      </MemoryRouter>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toContain('Delta');
  });

  it('removes <em> highlighting tags effectively from text', () => {
    item.complaint_id = '<em>99990909</em>';
    const target = renderer.create(
      <MemoryRouter>
        <IntlProvider locale="en">
          <ComplaintCard key={item.complaint_id} row={item} />
        </IntlProvider>
      </MemoryRouter>
    );
    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toContain(
      '<a href="detail/<em>99990909</em>"><em>99990909</em></a>'
    );
  });
});
