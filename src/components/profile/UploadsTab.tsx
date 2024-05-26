import OptionsModal from '@components/OptionsModal';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import OptionSelector from '@ui/OptionSelector';
import PaginatedList from '@ui/PaginatedList';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import AntDesing from 'react-native-vector-icons/AntDesign';
import { useQueryClient } from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';
import catchAsyncError from 'src/api/catchError';
import {fetchUploadsByProfile, useFetchUploadsByProfile} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import { upldateNotification } from 'src/store/notification';
import {getPlayerState} from 'src/store/player';

interface Props {}
let pageNo = 0;
const UploadsTab: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const {onGoingAudio} = useSelector(getPlayerState);
  const {data=[], isLoading, isFetching} = useFetchUploadsByProfile();
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const {onAudioPress} = useAudioController();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnEditPress = () => {
    setShowOptions(false);
    if (selectedAudio)
      navigate('UpdateAudio', {
        audio: selectedAudio,
      });
  };

  const handleOnRefresh = () => {
    pageNo = 0;
    setHasMore(true);
    queryClient.invalidateQueries(['uploads-by-profile']);
  };

  const handleOnEndReached = async () => {
    setIsFetchingMore(true);
    try {
      if (!data) return;
      pageNo += 1;
      const playlist = await fetchUploadsByProfile(pageNo);
      if (!playlist || !playlist.length) {
        setHasMore(false);
      }

      const newList = [...data, ...playlist];
      queryClient.setQueryData(['playlist'], newList);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
    setIsFetchingMore(false);
  };

  if (isLoading) return <AudioListLoadingUI />;

  return (
    <>
    <PaginatedList
      data={data}
      hasMore={hasMore}
      isFetching={isFetchingMore}
      onEndReached={handleOnEndReached}
      onRefresh={handleOnRefresh}
      refreshing={isFetching}
      ListEmptyComponent={<EmptyRecords title="There are no audios." />}
      renderItem={({item}) => {
        return (
          <AudioListItem
            onPress={() => onAudioPress(item, data)}
            key={item.id}
            audio={item}
            isPlaying={onGoingAudio?.id === item.id}
            onLongPress={() => handleOnLongPress(item)}
         />
        );
      }}
    />
      <OptionsModal
        visible={showOptions}
        onRequestClose={() => {
          setShowOptions(false);
        }}
        options={[
          {
            title: 'Edit',
            icon: 'edit',
            onPress: handleOnEditPress,
          },
        ]}
        renderItem={item => {
          return (
            <OptionSelector
              icon={
                <AntDesing size={24} color={colors.PRIMARY} name={item.icon} />
              }
              label={item.title}
              onPress={item.onPress}
            />
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLabel: {color: colors.PRIMARY, fontSize: 16, marginLeft: 5},
});

export default UploadsTab;
