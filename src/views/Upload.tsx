import AudioForm from '@components/form/AudioForm';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import colors from '@utils/colors';
import {mapRange} from '@utils/math';
import {FC, useState} from 'react';
import {StyleSheet} from 'react-native';
import { useQueryClient } from 'react-query';
import {useDispatch} from 'react-redux';
import { ProfileNavigatorStackParamList } from 'src/@types/navigation';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {upldateNotification} from 'src/store/notification';

interface Props {}

const Upload: FC<Props> = props => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleUpload = async (formData: FormData) => {
    setBusy(true);
    try {
      const client = await getClient({'Content-Type': 'multipart/form-data;'});

      const {data} = await client.post('/audio/create', formData, {
        onUploadProgress(progressEvent) {
          const uploaded = mapRange({
            inputMin: 0,
            inputMax: progressEvent.total || 0,
            outputMin: 0,
            outputMax: 100,
            inputValue: progressEvent.loaded,
          });

          if (uploaded >= 100) {
            setBusy(false);
          }

          setUploadProgress(Math.floor(uploaded));
        },
      });

      queryClient.invalidateQueries({queryKey: ['uploads-by-profile']});
      navigate('Profile');
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
    setBusy(false);
  };

  return (
    <AudioForm onSubmit={handleUpload} busy={busy} progress={uploadProgress} />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  fileSelctorContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
    textAlignVertical: 'top',
  },
  category: {
    padding: 10,
    color: colors.PRIMARY,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  categorySelectorTitle: {
    color: colors.CONTRAST,
  },
  selectedCategory: {
    color: colors.SECONDARY,
    marginLeft: 5,
    fontStyle: 'italic',
  },
});

export default Upload;
