import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import PaginatedList from '@ui/PaginatedList';
import {FC, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import catchAsyncError from 'src/api/catchError';
import {fetchFavorites, useFetchFavorite} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {upldateNotification} from 'src/store/notification';
import {getPlayerState} from 'src/store/player';

interface Props {}
let pageNo = 0;
const FavoriteTab: FC<Props> = props => {
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const {data = [], isLoading, isFetching} = useFetchFavorite();
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  if (isLoading) return <AudioListLoadingUI />;

  const handleOnEndReached = async () => {
    setIsFetchingMore(true);
    try {
      if (!data) return;
      pageNo += 1;
      const audios = await fetchFavorites(pageNo);
      if (!audios || !audios.length) {
        setHasMore(false);
      }

      const newList = [...data, ...audios];
      queryClient.setQueryData(['favorite'], newList);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
    setIsFetchingMore(false);
  };

  const handleOnRefresh = () => {
    pageNo = 0;
    setHasMore(true);
    queryClient.invalidateQueries(['favorite']);
  };

  return (
    <PaginatedList
      data={data}
      hasMore={hasMore}
      isFetching={isFetchingMore}
      onEndReached={handleOnEndReached}
      onRefresh={handleOnRefresh}
      refreshing={isFetching}
      ListEmptyComponent={<EmptyRecords title="There are no favorite audios." />}
      renderItem={({item}) => {
        return (
          <AudioListItem
            onPress={() => onAudioPress(item, data)}
            key={item.id}
            audio={item}
            isPlaying={onGoingAudio?.id === item.id}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default FavoriteTab;
