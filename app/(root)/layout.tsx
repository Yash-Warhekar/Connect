import { ReactNode } from 'react';

import StreamVideoProvider from '@/providers/StreamClientProvider';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "CONNECT",
  description: "Video calling application",
  icons:{
    icon:'/icons/logo.svg'
  }

};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default RootLayout;