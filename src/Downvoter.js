import { VoterList } from './components/VoterList';

export const Downvoter = () => (
  <VoterList queryKey='getDownvoter' endpoint='/post/getDownvoterList' titleKey='voters.downvoter' />
);
