import AboutSection from '@/components/home/about';
import Certification from '@/components/home/certification';
import FaqSection from '@/components/home/faq';
import Hero from '@/components/home/hero';
import OurServiceArea from '@/components/home/serviceArea';
import Services from '@/components/home/services';
import Video from '@/components/home/video';
import WhyUs from '@/components/home/whyUs';
import React from 'react';

const page = async () => {
    await new Promise((res) => setTimeout(res, 1200))
    return (
        <div>
            <Hero />
            <Services />
            <Video />
            <WhyUs />
            <Certification />
            <OurServiceArea />
            <AboutSection />
            <FaqSection />
        </div>
    );
};

export default page;