import { VoterList } from './components/VoterList';

export const UpvoterComments = () => (
  <VoterList queryKey='getUpvoterComments' endpoint='/post/getUpvoterListComments' titleKey='voters.upvoter' />
);
