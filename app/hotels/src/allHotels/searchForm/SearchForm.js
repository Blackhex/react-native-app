// @flow

import * as React from 'react';
import {
  TextInput,
  Color,
  Logger,
  StyleSheet,
} from '@kiwicom/react-native-app-shared';
import { View } from 'react-native';

import DateInput from './DateInput';
import Guests from './guests/Guests';
import type {
  RoomConfigurationType,
  SearchParams,
  OnChangeSearchParams,
} from './SearchParametersType';

const styles = StyleSheet.create({
  form: {
    backgroundColor: Color.brandSecondary,
    android: {
      padding: 14,
      paddingTop: 16,
    },
    ios: {
      padding: 10,
    },
  },
  row: {
    android: {
      marginTop: 8,
    },
    ios: {
      marginTop: 10,
    },
  },
});

type Props = {|
  location: string,
  search: SearchParams,
  onChange: (search: OnChangeSearchParams) => void,
  onLocationChange: (location: string) => void,
|};

export default class SearchForm extends React.Component<Props> {
  componentDidMount = () => {
    Logger.ancillaryDisplayed(Logger.Type.ANCILLARY_STEP_SEARCH_FORM);
  };

  handleDestinationChange = (location: string) => {
    this.props.onLocationChange(location);
  };

  handleGuestsChange = (roomsConfiguration: RoomConfigurationType) => {
    this.props.onChange({ roomsConfiguration });
  };

  render = () => {
    const { search, location, onChange } = this.props;

    return (
      <View style={styles.form}>
        <TextInput
          value={location}
          onChangeText={this.handleDestinationChange}
          placeholder="Where do you go?"
          iconName="location-city"
        />
        <View style={styles.row}>
          <DateInput
            checkin={search.checkin}
            checkout={search.checkout}
            onChange={onChange}
          />
        </View>
        <View style={styles.row}>
          <Guests
            guests={search.roomsConfiguration}
            onChange={this.handleGuestsChange}
          />
        </View>
      </View>
    );
  };
}
