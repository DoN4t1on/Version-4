import { VoterList } from './components/VoterList';

export const Upvoter = () => (
  <VoterList queryKey='getUpvoter' endpoint='/post/getUpvoterList' titleKey='voters.upvoter' />
);
