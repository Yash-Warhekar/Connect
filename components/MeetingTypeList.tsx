'use client';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import ReactDatePicker from 'react-datepicker';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>(undefined);
  const { user } = useUser();
  const client = useStreamVideoClient();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });

  const [callDetail, setCallDetail] = useState<Call | null>(null);

  const createMeeting = async (instant = false) => {
    if (!client || !user) return;

    try {
      const id = uuidv4();
      const call = client.call('default', id);

      await call.getOrCreate({
        data: {
          starts_at: instant ? new Date().toISOString() : values.dateTime.toISOString(),
          custom: { description: values.description || 'Instant Meeting' },
        },
      });

      setCallDetail(call);
      toast.success('Meeting Created');

      if (instant) {
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`);
        toast.success('Meeting Link Copied');
        router.push(`/meeting/${call.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create Meeting');
    }
  };

  if (!client || !user) return <Loader />;

  const meetingLink = callDetail ? `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail.id}` : '';

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        className="bg-orange-1"
        handleClick={() => createMeeting(true)}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />

      {callDetail && (
        <MeetingModal
          isOpen={true}
          onClose={() => setCallDetail(null)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast.success('Link copied');
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Create Meeting"
        handleClick={() => createMeeting(false)}
      >
        <div className="flex flex-col gap-2.5">
          <label className="text-base text-normal leading-[22px] text-sky-2">Add a description</label>
          <Textarea
            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) => setValues({ ...values, description: e.target.value })}
          />
        </div>
        <div className="flex w-full flex-col gap-2.5">
          <label className="text-base text-normal leading-[22px] text-sky-2">Select Date and Time</label>
          <ReactDatePicker
            selected={values.dateTime}
            onChange={(date) => setValues({ ...values, dateTime: date! })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy HH:mm"
            className="w-full rounded bg-dark-3 p-2 focus:outline-none"
          />
        </div>
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting Link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
