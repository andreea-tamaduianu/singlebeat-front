import {getFromAsyncStorage, Keys} from '@utils/asyncStorage';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {AudioData, CompletePlaylist, History} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {upldateNotification} from 'src/store/notification';
import {Playlist} from 'src/@types/audio';

const fetchLatest = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();
  return useQuery(['latest-uploads'], {
    queryFn: () => fetchLatest(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

const fetchRecommended = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/profile/recommended');
  return data.audios;
};

export const useFetchRecommendedAudios = () => {
  const dispatch = useDispatch();
  return useQuery(['recommended'], {
    queryFn: () => fetchRecommended(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

export const fetchPlaylist = async (pageNo = 0): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client('/playlist/by-profile?limit=10&pageNo=' + pageNo);
  return data.playlist;
};

export const useFetchPlaylist = () => {
  const dispatch = useDispatch();
  return useQuery(['playlist'], {
    queryFn: () => fetchPlaylist(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

export const fetchUploadsByProfile = async (pageNo = 0): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/profile/uploads?pageNo=' + pageNo);
  return data.audios;
};

export const useFetchUploadsByProfile = () => {
  const dispatch = useDispatch();
  return useQuery(['uploads-by-profile'], {
    queryFn: () => fetchUploadsByProfile(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

export const fetchFavorites = async (pageNo = 0): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/favorite?pageNo=' + pageNo);
  return data.audios;
};

export const useFetchFavorite = () => {
  const dispatch = useDispatch();
  return useQuery(['favorite'], {
    queryFn: () => fetchFavorites(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

export const fetchHistories = async (pageNo = 0): Promise<History[]> => {
  const client = await getClient();
  const {data} = await client('/history?limit=15&pageNo=' + pageNo);
  return data.histories;
};

export const useFetchHistories = () => {
  const dispatch = useDispatch();
  return useQuery(['histories'], {
    queryFn: () => fetchHistories(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

const fetchRecentlyPlayed = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/history/recently-played');
  return data.audios;
};

export const useFetchRecentlyPlayed = () => {
  const dispatch = useDispatch();
  return useQuery(['recently-played'], {
    queryFn: () => fetchRecentlyPlayed(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

const fetchRecommendedPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client('/profile/auto-generated-playlist');
  return data.playlist;
};

export const useFetchRecommendedPlaylist = () => {
  const dispatch = useDispatch();
  return useQuery(['recommended-playlist'], {
    queryFn: () => fetchRecommendedPlaylist(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

const fetchIsFavorite = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const {data} = await client('/favorite/is-fav?audioId=' + id);
  return data.result;
};

export const useFetchIsFavorite = (id: string) => {
  const dispatch = useDispatch();
  return useQuery(['favorite', id], {
    queryFn: () => fetchIsFavorite(id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
    enabled: id ? true : false,
  });
};

const fetchPublicProfile = async (id: string): Promise<PublicProfile> => {
  const client = await getClient();
  const {data} = await client('/profile/info/' + id);
  return data.profile;
};

export const useFetchPublicProfile = (id: string) => {
  const dispatch = useDispatch();
  return useQuery(['profile', id], {
    queryFn: () => fetchPublicProfile(id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
    enabled: id ? true : false,
  });
};

const fetchPublicUploads = async (id: string): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/profile/uploads/' + id);
  return data.audios;
};

export const useFetchPublicUploads = (id: string) => {
  const dispatch = useDispatch();
  return useQuery(['uploads', id], {
    queryFn: () => fetchPublicUploads(id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
    enabled: id ? true : false,
  });
};

const fetchPublicPlaylist = async (id: string): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client('/profile/playlist/' + id);
  return data.playlist;
};

export const useFetchPublicPlaylist = (id: string) => {
  const dispatch = useDispatch();
  return useQuery(['playlist', id], {
    queryFn: () => fetchPublicPlaylist(id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
    enabled: id ? true : false,
  });
};

const fetchPlaylistAudios = async (
  id: string,
  isPrivate: boolean,
): Promise<CompletePlaylist> => {
  const endpoint = isPrivate
    ? '/profile/private-playlist-audios/' + id
    : '/profile/playlist-audios/' + id;
  const client = await getClient();
  const {data} = await client(endpoint);
  return data.list;
};

export const useFetchPlaylistAudios = (id: string, isPrivate: boolean) => {
  const dispatch = useDispatch();
  return useQuery(['playlist-audios', id], {
    queryFn: () => fetchPlaylistAudios(id, isPrivate),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
    enabled: id ? true : false,
  });
};

const fetchIsFollowing = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const {data} = await client('/profile/is-following/' + id);
  return data.status;
};

export const useFetchIsFollowing = (id: string) => {
  const dispatch = useDispatch();
  return useQuery(['is-following', id], {
    queryFn: () => fetchIsFollowing(id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
    enabled: id ? true : false,
  });
};
