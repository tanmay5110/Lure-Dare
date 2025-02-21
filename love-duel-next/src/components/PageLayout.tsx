import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PageLayoutProps {
  backgroundImage: string;
  children: React.ReactNode;
}

export default function PageLayout({ backgroundImage, children }: PageLayoutProps) {
  return (
    <main className="min-h-screen relative">
      <Image
        src={backgroundImage}
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
} 