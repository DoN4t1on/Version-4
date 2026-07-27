import { VoterList } from './components/VoterList';

export const DownvoterComments = () => (
  <VoterList queryKey='getDownvoterComments' endpoint='/post/getDownvoterListComments' titleKey='voters.downvoter' />
);
