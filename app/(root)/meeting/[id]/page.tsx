'use client';

import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';

const Meeting = () => {
  const params = useParams();
  const id = params.id as string;
  const {user, isLoaded} = useUser();
  const [isSetupComplete,setIsSetupComplete] = useState(false);
  const {call, isCallLoading}=useGetCallById(id);

  if(!isLoaded || isCallLoading) return <Loader/>



  return (
    // <div>Meeting Room: #{id}</div>
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? ( <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>
        ):(
          <MeetingRoom/>)}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting