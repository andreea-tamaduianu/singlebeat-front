import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Image, Pressable, Text} from 'react-native';
import PlayAnimation from './PlayAnimation';

interface Props {
  title: string;
  poster?: string;
  isPlaying?: boolean;
  onPress?(): void;
}

const RecentlyPlayedCard: FC<Props> = ({
  title,
  isPlaying = false,
  poster,
  onPress,
}) => {
  const source = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View>
        <Image source={source} style={styles.poster} />
        <PlayAnimation visible={isPlaying} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.OVERLAY,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  poster: {
    width: 50,
    height: 50,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
  },
  titleContainer: {
    flex: 1,
    padding: 5,
  },
});

export default RecentlyPlayedCard;
