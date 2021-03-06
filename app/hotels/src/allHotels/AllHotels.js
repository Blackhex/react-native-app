// @flow

import * as React from 'react';
import { ScrollView, Keyboard } from 'react-native';
import idx from 'idx';
import { graphql } from 'react-relay';
import { PublicApiRenderer } from '@kiwicom/react-native-app-relay';
import { Layout, AppStateChange } from '@kiwicom/react-native-app-shared';
import { connect } from '@kiwicom/react-native-app-redux';

import AllHotelsSearch from './AllHotelsSearch';
import SearchForm from './searchForm/SearchForm';
import FilterStripe from '../filter/FilterStripe';
import type {
  SearchParams,
  OnChangeSearchParams,
} from './searchForm/SearchParametersType';
import type {
  FilterParams,
  OnChangeFilterParams,
} from '../filter/FilterParametersType';
import type { AllHotels_cityLookup_QueryResponse } from './__generated__/AllHotels_cityLookup_Query.graphql';
import GeneralError from '../../../shared/src/errors/GeneralError';
import type { HotelsReducerState } from '../HotelsReducer';
import type { FilterReducerState } from '../filter/FiltersReducer';
import type { AvailableHotelSearchInput } from '../singleHotel/AvailableHotelSearchInput';
import type { Coordinates } from '../CoordinatesType';
import { updateCheckinDateIfBeforeToday } from '../search/SearchQueryHelpers';

type Props = {|
  onSearchChange: OnChangeSearchParams => void,
  onLocationChange: (location: string) => void,
  search: SearchParams,
  coordinates: Coordinates | null,
  location: string,
  filter: FilterParams,
  onFilterChange: OnChangeFilterParams => void,
  currency: string,
  openSingleHotel: (searchParams: AvailableHotelSearchInput) => void,
|};

/**
 * We need to lookup city ID first and only after that we can search for all
 * hotels. This is why we use two nested query renderers.
 */
class AllHotels extends React.Component<Props> {
  componentDidMount = () => {
    this.validateCheckinDate();
  };

  validateCheckinDate = () => {
    updateCheckinDateIfBeforeToday(
      this.props.search,
      this.props.onSearchChange,
    );
  };

  renderAllHotelsSearchPublicRenderer = (
    rendererProps: AllHotels_cityLookup_QueryResponse,
  ) => {
    const cityId = idx(rendererProps, _ => _.city.edges[0].node.id) || null;
    if (cityId === null) {
      return <GeneralError errorMessage="Cannot find such city." />;
    }
    return (
      <AllHotelsSearch
        {...rendererProps}
        coordinates={this.props.coordinates}
        openSingleHotel={this.props.openSingleHotel}
        cityId={cityId}
        currency={this.props.currency}
      />
    );
  };

  render = () => (
    <AppStateChange
      states={['active']}
      onStateChange={this.validateCheckinDate}
    >
      <Layout>
        <ScrollView
          bounces={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onScroll={Keyboard.dismiss}
        >
          <SearchForm
            onChange={this.props.onSearchChange}
            onLocationChange={this.props.onLocationChange}
            search={this.props.search}
            location={this.props.location}
          />
          <FilterStripe
            filter={this.props.filter}
            onChange={this.props.onFilterChange}
            currency={this.props.currency}
          />
          <PublicApiRenderer
            query={graphql`
              query AllHotels_cityLookup_Query($prefix: String!) {
                city: hotelCities(prefix: $prefix, first: 1) {
                  edges {
                    node {
                      id
                    }
                  }
                }
              }
            `}
            render={this.renderAllHotelsSearchPublicRenderer}
            variables={{
              prefix: this.props.location,
            }}
          />
        </ScrollView>
      </Layout>
    </AppStateChange>
  );
}

const select = ({
  hotels,
  filters,
}: {
  hotels: HotelsReducerState,
  filters: FilterReducerState,
}) => ({
  location: hotels.location,
  search: hotels.searchParams,
  filter: filters.filterParams,
});

const actions = dispatch => ({
  onSearchChange: search =>
    dispatch({
      type: 'setSearch',
      search,
    }),
  onLocationChange: (location: string) =>
    dispatch({
      type: 'setLocation',
      location,
    }),
  onCityIdChange: (cityId: string | null) =>
    dispatch({
      type: 'setCityId',
      cityId,
    }),
  onFilterChange: filter =>
    dispatch({
      type: 'filtersReducer/FILTER_CHANGED',
      filter,
    }),
});

export default connect(select, actions)(AllHotels);
