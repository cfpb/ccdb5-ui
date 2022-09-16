import '../RefineBar/RefineBar.less';
import ActionBar from '../ActionBar';
import { connect } from 'react-redux';
import ErrorBlock from '../Warnings/Error';
import FilterPanel from '../Filters/FilterPanel';
import FilterPanelToggle from '../Filters/FilterPanelToggle';
import Loading from '../Dialogs/Loading';
import MapToolbar from './MapToolbar';
import { mapWarningDismissed } from '../../actions/view';
import { PerCapita } from '../RefineBar/PerCapita';
import { processRows } from '../../utils/chart';
import React from 'react';
import RowChart from '../Charts/RowChart';
import { Separator } from '../RefineBar/Separator';
import { shortFormat } from '../../utils';
import { TabbedNavigation } from '../TabbedNavigation';
import TileChartMap from '../Charts/TileChartMap';
import Warning from '../Warnings/Warning';

const WARNING_MESSAGE =
  '“Complaints per' +
  ' 1,000 population” is not available with your filter selections.';

const MAP_ROWCHART_HELPERTEXT =
  'Product the consumer identified in the' +
  ' complaint. Click on a product to expand sub-products';

export class MapPanel extends React.Component {
  // eslint-disable-next-line complexity
  render() {
    const MAP_ROWCHART_TITLE =
      'Product by highest complaint volume' +
      ' ' +
      this.props.minDate +
      ' to ' +
      this.props.maxDate;

    return (
      <section className="map-panel">
        <ActionBar />
        <TabbedNavigation />
        {this.props.error && (
          <ErrorBlock text="There was a problem executing your search" />
        )}
        {this.props.showWarning && (
          <Warning
            text={WARNING_MESSAGE}
            closeFn={this.props.onDismissWarning}
          />
        )}
        {this.props.showMobileFilters && <FilterPanel />}
        <div className="layout-row refine-bar">
          <FilterPanelToggle />
          <Separator />
          <PerCapita />
        </div>
        <TileChartMap />
        <MapToolbar />
        <RowChart
          id="product"
          colorScheme={this.props.productData.colorScheme}
          data={this.props.productData.data}
          title={MAP_ROWCHART_TITLE}
          helperText={MAP_ROWCHART_HELPERTEXT}
          total={this.props.total}
        />

        <Loading isLoading={this.props.isLoading || false} />
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  const { error, isLoading, results } = state.map;

  const {
    date_received_max: maxDate,
    date_received_min: minDate,
    enablePer1000,
    mapWarningEnabled,
  } = state.query;

  const { expandedRows, width } = state.view;

  return {
    error,
    isLoading,
    minDate: shortFormat(minDate),
    maxDate: shortFormat(maxDate),
    productData: processRows(results.product, false, 'Product', expandedRows),
    showMobileFilters: width < 750,
    showWarning: !enablePer1000 && mapWarningEnabled,
    total: state.aggs.total,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  onDismissWarning: () => {
    dispatch(mapWarningDismissed());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MapPanel);
