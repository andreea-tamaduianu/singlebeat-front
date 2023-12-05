import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import {useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {useFetchFavorite} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

interface Props {}

const FavoriteTab: FC<Props> = props => {
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const {data, isLoading, isFetching} = useFetchFavorite();
  const queryClient = useQueryClient();

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['favorite']});
  };

  if (isLoading) return <AudioListLoadingUI />;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={handleOnRefresh}
          tintColor={colors.CONTRAST}
        />
      }
      style={styles.container}>
      {!data?.length ? (
        <EmptyRecords title="There is no favorite audio!" />
      ) : null}
      {data?.map(item => {
        return (
          <AudioListItem
            onPress={() => onAudioPress(item, data)}
            key={item.id}
            audio={item}
            isPlaying={onGoingAudio?.id === item.id}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default FavoriteTab;
