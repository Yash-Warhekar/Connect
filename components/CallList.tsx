//@ts-nocheck

'use client';
import { useGetcalls } from '@/hooks/useGetCalls'
// import { CallRecording } from '@stream-io/node-sdk';
import { Call,CallRecording } from '@stream-io/video-react-sdk';
import { validateHeaderValue } from 'http';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { toast } from 'sonner';


const CallList = ({type}:{type:'ended'| 'upcoming' | 'recordings'}) => {
    const {endedCalls, upcomingCalls,callRecordings,isLoading}=useGetcalls();
    const router= useRouter();
    const [recordings,setRecordings]=useState<CallRecording[]>([])

    const getCalls=()=>{
        switch(type){
            case 'ended':return endedCalls;
            case 'recordings':return recordings;
            case 'upcoming': return upcomingCalls;
            default:return [];
        }
    }

    const getNoCallsMessage=()=>{
        switch(type){
            case 'ended':return 'No Previous Calls';
            case 'recordings':return 'No Recordings';
            case 'upcoming': return 'No Upcoming Calls';
            default:return '';
        }
    }

    useEffect(()=>{
        const fetchRecordings=async()=>{
            try{
            const callData=await Promise.all(callRecordings.map((meeting)=>meeting.queryRecordings()))
            const recordings = callData.filter(call=>call.recordings.length>0).flatMap(call=>call.recordings)
            setRecordings(recordings);
            }catch(error){
                console.log('try again later | error:'+ error);
                toast.error('try again later');
            }
            
        }

        if(type === 'recordings') fetchRecordings();
    },[type,callRecordings]);


    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    if(isLoading) return <Loader/>

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
            <MeetingCard 
            key={type === 'recordings' ? (meeting as CallRecording).url : (meeting as Call).id}
            icon={
                type==='ended'?'/icons/previous.svg':type==='upcoming'?'/icons/upcoming.svg':'/icons/recordings.svg'
            }
            title={(meeting as Call).state?.custom?.description?.substring(0,60)||meeting?.filename?.substring(0,20) || "your's personal meeting"}
            date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
            isPreviousMeeting={type === 'ended'}
            buttonIcon1={type === 'recordings' ? '/icons/play.svg':undefined}
            buttonText={type === 'recordings'?'Play':'Start'}
            handleClick={type === 'recordings'? ()=>router.push(`${meeting.url}`):()=>router.push(`/meeting/${meeting.id}`)}
            link={type=== 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
            />
        )) : (
            <h1>{noCallsMessage}</h1>
        )}
    </div>
  )
}

export default CallList