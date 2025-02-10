import React from 'react';

// interface GreetingBannerProps {
//   userName: string;
//   projectCount: number;
// }

const GreetingBanner = () => {
  

  return (
    <div className="w-full h-[200px] bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center px-4 text-center shadow-lg">
      <h1 className="text-4xl sm:text-5xl font-extrabold">
        Talkietotz Dashboard!
      </h1>
      <p className="text-neutral-300 text-lg sm:text-xl mt-2">
        You have <span className="text-white font-semibold"></span> waiting for your attention.
      </p>
      {/* <p className="text-neutral-400 text-xs sm:text-xs mt-1">
        Stay focused and achieve your goals today!
      </p> */}
    </div>
  );
};

export default GreetingBanner;
