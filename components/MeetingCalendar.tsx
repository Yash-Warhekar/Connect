
'use client';

import Calendar from 'react-calendar';
import { Call } from '@stream-io/video-react-sdk';
import 'react-calendar/dist/Calendar.css';
import { useGetcalls } from '@/hooks/useGetCalls';
import 'react-calendar/dist/Calendar.css';

const MeetingCalendar = () => {
  const { upcomingCalls } = useGetcalls();
  
  const tileClassName = ({ date }: { date: Date }) => {
    const hasMeeting = upcomingCalls?.some((call: Call) => {
        if (!call.state.startsAt) return false;
      const meetingDate = new Date(call.state.startsAt);
      return (
        date.getFullYear() === meetingDate.getFullYear() &&
        date.getMonth() === meetingDate.getMonth() &&
        date.getDate() === meetingDate.getDate()
      );
    });
    
    return hasMeeting ? 'meeting-date' : '';
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        tileClassName={tileClassName}
        value={new Date()}
      />
    </div>
  );
};

export default MeetingCalendar;
