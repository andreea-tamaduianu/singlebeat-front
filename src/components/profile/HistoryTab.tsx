import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import colors from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {View, RefreshControl, StyleSheet, Text, Pressable, FlatList} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {fetchHistories, useFetchHistories} from 'src/hooks/query';
import AntDesing from 'react-native-vector-icons/AntDesign';
import {getClient} from 'src/api/client';
import {useMutation, useQueryClient} from 'react-query';
import {History, historyAudio} from 'src/@types/audio';
import {useNavigation} from '@react-navigation/native';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import PaginatedList from '@ui/PaginatedList';

interface Props {}
/* [
  {date: "" , audios: [ {audio1 }, { audio2 } ]},
  {date: "" , audios: [ {audio3 }, { audio4 } ]}
  {date: "" , audios: [ {audio4 }, { audio5 } ]}
] */
let pageNo = 0;

const HistoryTab: FC<Props> = props => {
  const navigation = useNavigation();
  const {data, isLoading, isFetching} = useFetchHistories();
  const queryClient = useQueryClient();
  const [selectedHistories, setSelectedHistories] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const noData = !data?.length;

  const removeMutation = useMutation({
    mutationFn: async histories => removeHistories(histories),
    onMutate: (histories: string[]) => {
      queryClient.setQueryData<History[]>(['histories'], oldData => {
        let newData: History[] = [];
        if (!oldData) return newData;

        for (let data of oldData) {
          const filterd = data.audios.filter(
            item => !histories.includes(item.id),
          );
          if (filterd.length) {
            newData.push({date: data.date, audios: filterd});
          }
        }

        return newData;
      });
    },
  });

  const removeHistories = async (histories: string[]) => {
    const client = await getClient();
    await client.delete('/history?histories=' + JSON.stringify(histories));
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  const handleSingleHistoryRemove = async (history: historyAudio) => {
    removeMutation.mutate([history.id]);
  };

  const handleMultipleHistoryRemove = async () => {
    setSelectedHistories([]);
    removeMutation.mutate([...selectedHistories]);
  };

  const handleOnLongPress = (history: historyAudio) => {
    setSelectedHistories([history.id]);
  };

  const handleOnPress = (history: historyAudio) => {
    if(selectedHistories.length===0) return 
    setSelectedHistories(old => {
      if (old.includes(history.id)) {
        return old.filter(item => item !== history.id);
      }

      return [...old, history.id];
    });
  };

  const handleOnEndReached = async() =>{
    if(!data || !hasMore || isFetchingMore) return;
    setIsFetchingMore(true)
    pageNo +=1;
    const res = await fetchHistories(pageNo);
    if(!res || !res.length){
      setHasMore(false)
    }
    const newData = [...data,...res];
    const finalData: History[] = []
    const mergedData = newData.reduce((accumulator, current)=>{
        const foundObj = accumulator.find(item=> item.date === current.date)
       if(foundObj){
        foundObj.audios = foundObj.audios.concat(current.audios)
       }
       else{
        accumulator.push(current)
       }
        return accumulator
    },finalData)

    queryClient.setQueryData(['histories'], mergedData)
    setIsFetchingMore(false)
  };

  const handleOnRefresh = () => {
    pageNo = 0
    setHasMore(true)
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  useEffect(() => {
    const unselectHistories = () => {
      setSelectedHistories([]);
    };

    navigation.addListener('blur', unselectHistories);

    return () => {
      navigation.removeListener('blur', unselectHistories);
    };
  }, []);

  if (isLoading) return <AudioListLoadingUI />;

  return (
    <>
      {selectedHistories.length ? (
        <Pressable
          onPress={handleMultipleHistoryRemove}
          style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Remove</Text>
        </Pressable>
      ) : null}

      <PaginatedList
        data={data}
        renderItem={({item}) => {
          return (
            <View key={item.date}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.listContainer}>
                {item.audios.map((audio, index) => {
                  return (
                    <Pressable
                      onLongPress={() => handleOnLongPress(audio)}
                      onPress={() => handleOnPress(audio)}
                      key={audio.id + index}
                      style={[
                        styles.history,
                        {
                          backgroundColor: selectedHistories.includes(audio.id)
                            ? colors.INACTIVE_CONTRAST
                            : colors.OVERLAY,
                        },
                      ]}>
                      <Text style={styles.historyTitle}>{audio.title}</Text>
                      <Pressable
                        onPress={() => handleSingleHistoryRemove(audio)}>
                        <AntDesing name="close" color={colors.CONTRAST} />
                      </Pressable>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        }}
        onEndReached={handleOnEndReached}
        ListEmptyComponent={<EmptyRecords title="There is no history!" />}
        refreshing={isFetching}
        onRefresh={handleOnRefresh}
        isFetching={isFetchingMore}
        hasMore={hasMore}
      />
    </>
      
    
  );
};

const styles = StyleSheet.create({
  container: {},
  removeBtn: {
    padding: 10,
    alignSelf: 'flex-end',
  },
  removeBtnText: {
    color: colors.CONTRAST,
  },
  listContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  date: {
    color: colors.SECONDARY,
  },
  historyTitle: {
    color: colors.CONTRAST,
    paddingHorizontal: 5,
    fontWeight: '700',
    flex: 1,
  },
  history: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.OVERLAY,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default HistoryTab;
