// @flow

import * as React from 'react';
import { NetworkImage, Touchable } from '@kiwicom/react-native-app-shared';

type Props = {|
  onTilePress: (imageIndex: number) => void,
  imageIndex: number,
  width: number,
  lastInRow: boolean,
  gap: number,
  imageUrl: string,
|};

export default class GalleryGridTile extends React.Component<Props> {
  handleTilePress = () => this.props.onTilePress(this.props.imageIndex);

  render = () => {
    const style: Object = {
      width: this.props.width,
      height: this.props.width, // width is intentional because we want square tiles
      marginBottom: 2,
    };
    if (!this.props.lastInRow) {
      style.marginRight = this.props.gap;
    }

    return (
      <Touchable onPress={this.handleTilePress}>
        <NetworkImage
          source={{ uri: this.props.imageUrl }}
          style={style}
          resizeMode="cover"
        />
      </Touchable>
    );
  };
}
