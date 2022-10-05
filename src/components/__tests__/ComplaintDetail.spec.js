import { ComplaintDetail } from '../ComplaintDetail/ComplaintDetail';
import React from 'react';
import {
  testRenderWithMemoryRouter as render,
  screen,
} from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { defaultDetail } from '../../reducers/detail/detail';
import { defaultQuery } from '../../reducers/query/query';
import { waitFor } from '@testing-library/react';
import * as complaintActions from '../../actions/complaints';

const fixture = {
  company: 'JPMORGAN CHASE & CO.',
  company_public_response: 'Company acknowledges the complaint',
  company_response: 'Closed with explanation',
  complaint_id: '2371744',
  complaint_what_happened: 'Lorem ipsum dolor sit amet',
  consumer_consent_provided: 'Consent provided',
  consumer_disputed: 'Yes',
  date_received: '2017-03-04T12:00:00',
  date_sent_to_company: '2017-03-04T12:00:00',
  has_narrative: true,
  issue: 'Account opening, closing, or management',
  product: 'Bank account or service',
  state: 'KY',
  sub_issue: 'Closing',
  sub_product: 'Checking account',
  submitted_via: 'Web',
  tags: 'Older American',
  timely: 'Yes',
  zip_code: '423XX',
};

const renderComponent = (newDetailState, newQueryState) => {
  merge(newDetailState, defaultDetail);
  merge(newQueryState, defaultQuery);
  const data = {
    detail: newDetailState,
    query: newQueryState,
  };
  render(<ComplaintDetail />, {
    preloadedState: data,
    initialEntries: ['/detail/2371744'],
  });
};

describe('component::ComplaintDetail', () => {
  it('renders loading page', () => {
    const activeCall = '/api/call/detailid';
    const newDetailState = {
      activeCall: activeCall,
      error: '',
    };

    renderComponent(newDetailState, {});
    expect(screen.getByText('Back to search results')).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toHaveAttribute(
      'href',
      '/?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends'
    );
    expect(screen.getByText('This page is loading')).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toBeInTheDocument();
  });

  it('renders error', async () => {
    const newDetailState = {
      activeCall: '',
      data: {},
      error: { some: 'value' },
    };

    const complaintApiSpy = jest
      .spyOn(complaintActions, 'getComplaintDetail')
      .mockImplementation(() => jest.fn());

    renderComponent(newDetailState, {});

    expect(complaintApiSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Back to search results')).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toHaveAttribute(
      'href',
      '/?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends'
    );

    expect(
      screen.getByText('There was a problem retrieving')
    ).toBeInTheDocument();
  });

  it('renders document', async () => {
    const newDetailState = {
      activeCall: '',
      data: fixture,
      error: '',
    };

    const complaintApiSpy = jest
      .spyOn(complaintActions, 'getComplaintDetail')
      .mockImplementation(() => jest.fn());

    renderComponent(newDetailState, {});

    expect(complaintApiSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText(fixture.sub_issue)).toBeInTheDocument();
    expect(screen.getByText(fixture.sub_product)).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toHaveAttribute(
      'href',
      '/?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends'
    );

    await waitFor(() =>
      expect(screen.queryByText('This page is loading')).toBeNull()
    );

    expect(
      screen.getByText('Date CFPB received the complaint')
    ).toBeInTheDocument();

    expect(screen.getAllByText('Yes')).toHaveLength(2);
    expect(screen.getByText(fixture.company)).toBeInTheDocument();
    expect(screen.getByText(fixture.company_response)).toBeInTheDocument();
    expect(
      screen.getByText(fixture.company_public_response)
    ).toBeInTheDocument();
    expect(screen.getByText(fixture.submitted_via)).toBeInTheDocument();
  });

  it('handles missing narrative, sub-agg and timely values', async () => {
    const dataFixture = Object.assign({}, fixture);
    dataFixture.complaint_what_happened = '';
    dataFixture.consumer_disputed = 'No';
    dataFixture.timely = '';
    dataFixture.sub_issue = '';
    dataFixture.sub_product = '';

    const newDetailState = {
      activeCall: '',
      data: dataFixture,
      error: '',
    };

    const complaintApiSpy = jest
      .spyOn(complaintActions, 'getComplaintDetail')
      .mockImplementation(() => jest.fn());

    renderComponent(newDetailState, {});

    expect(complaintApiSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Back to search results')).toBeInTheDocument();
    expect(screen.getByText('Back to search results')).toHaveAttribute(
      'href',
      '/?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends'
    );

    await waitFor(() =>
      expect(screen.queryByText('This page is loading')).toBeNull()
    );

    expect(
      screen.getByText('Date CFPB received the complaint')
    ).toBeInTheDocument();

    expect(screen.getByText(dataFixture.company)).toBeInTheDocument();
    expect(screen.getByText(dataFixture.company_response)).toBeInTheDocument();
    expect(
      screen.getByText(dataFixture.company_public_response)
    ).toBeInTheDocument();
    expect(
      screen.getByText(dataFixture.consumer_disputed)
    ).toBeInTheDocument();
    expect(screen.getByText(dataFixture.submitted_via)).toBeInTheDocument();
    expect(screen.queryByText('Sub-product:')).toBeNull();
    expect(screen.queryByText('Sub-issue:')).toBeNull();
    expect(screen.queryByText('Consumer complaint narrative')).toBeNull();
  });

  it('handles errors with "Consumer Consent Provided" icons', async () => {
    const dataFixture = Object.assign({}, fixture);
    dataFixture.complaint_what_happened = '';
    dataFixture.consumer_consent_provided = 'Bad Value';

    const newDetailState = {
      activeCall: '',
      data: dataFixture,
      error: '',
    };

    const complaintApiSpy = jest
      .spyOn(complaintActions, 'getComplaintDetail')
      .mockImplementation(() => jest.fn());

    renderComponent(newDetailState, {});

    expect(complaintApiSpy).toHaveBeenCalledTimes(1);

    await waitFor(() =>
      expect(screen.queryByText('This page is loading')).toBeNull()
    );

    expect(
      screen.getByText('Date CFPB received the complaint')
    ).toBeInTheDocument();

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('Not Timely', async () => {
    const dataFixture = Object.assign({}, fixture);
    dataFixture.timely = 'No';

    const newDetailState = {
      activeCall: '',
      data: dataFixture,
      error: '',
    };

    const complaintApiSpy = jest
      .spyOn(complaintActions, 'getComplaintDetail')
      .mockImplementation(() => jest.fn());

    renderComponent(newDetailState, {});

    expect(complaintApiSpy).toHaveBeenCalledTimes(1);

    await waitFor(() =>
      expect(screen.queryByText('This page is loading')).toBeNull()
    );

    expect(screen.getByText('Timely response?')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });
});
