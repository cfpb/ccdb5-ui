import { sendAnalyticsEvent } from '../../../utils';
import { Hero } from '../../search/hero/hero';
import { buildAllResultsUri } from './data-export-utils';
import { Button, Heading } from '@cfpb/design-system-react';

export const ExportRoute = () => {
  const exportUrl = buildAllResultsUri();

  const handleDownload = () => {
    sendAnalyticsEvent('Export All Data', 'csv');
    location.assign(exportUrl);
  };

  return (
    <>
      <Hero />
      <section className="block block--flush-top">
        <Heading type="3">Download all complaint data (ZIP CSV)</Heading>
        <Button
          label="Download data"
          iconRight="download"
          data-gtm_ignore="true"
          onClick={() => {
            handleDownload();
          }}
        />
      </section>
    </>
  );
};
