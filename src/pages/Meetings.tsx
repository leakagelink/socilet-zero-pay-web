import { Helmet } from 'react-helmet';
import { MeetingRoom } from '@/components/meeting/MeetingRoom';

const Meetings = () => {
  return (
    <>
      <Helmet>
        <title>Video Meetings | Socilet</title>
        <meta name="description" content="Join video meetings with Socilet. Connect with clients through audio/video calls and chat." />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">
          <MeetingRoom />
        </main>
      </div>
    </>
  );
};

export default Meetings;
