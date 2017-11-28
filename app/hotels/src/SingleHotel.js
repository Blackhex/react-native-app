// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import Button from '../../native/src/components/visual/buttons/Button';

export default function AllHotels(props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is SingleHotel component</Text>
      <Button
        title="Single hotel gallery"
        onPress={() => props.navigation.navigate('Gallery')}
      />
    </View>
  );
}
