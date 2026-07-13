import WelcomeBanner from './components/WelcomeBanner';
import UpcomingMeetings from './components/UpcomingMeetings';
import RecentAssignments from './components/RecentAssignments';
import Directory from './components/Directory';

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <WelcomeBanner />
      <UpcomingMeetings />
      <section className="grid gap-6 lg:grid-cols-5">
        <RecentAssignments />
        <Directory />
      </section>
    </div>
  );
}
