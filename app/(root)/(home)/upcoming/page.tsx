import CallList from '@/components/CallList'
import MeetingCalendar from '@/components/MeetingCalendar'
import React from 'react'

const Upcoming = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className="mt-8 ">
        <h2 className="mb-4 text-2xl font-bold">Meeting Calendar</h2>
        <MeetingCalendar />
      </div>
      <h1 className='text-3xl font-bold'>Upcomings</h1>

      <CallList  type='upcoming'/>

    </section>
  )
}

export default Upcoming