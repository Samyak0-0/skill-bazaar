/*// src/components/home_page/Home_page.tsx
import React from 'react';

type Props = {};

const Home_page = (props: Props) => {
  return <div>Home</div>;
};

export default Home_page;
*/

"use client";
import React from 'react';
import { ChevronRight, ChevronLeft } from "lucide-react";

type Props = {};

interface Recommendation {
  work: string;
  description: string;
  rate: string;
}

const Home_page = (props: Props) => {
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -15 : 15; // Adjust scrollAmount for smoother scaling
      scrollContainer.current.scrollBy({ left: scrollAmount * 16, behavior: 'smooth' });
    }
  };

  const recommendations: Recommendation[] = [
    {
      work: "Math Tutition",
      description: "Required a guy who has not failed math",
      rate: "500$/HR"
    },
    {
      work: "Essay Writing",
      description: "Need help with college essays",
      rate: "50$/HR"
    },
    {
      work: "Essay Writing",
      description: "Need help with college essays",
      rate: "50$/HR"
    },
    {
      work: "Essay Writing",
      description: "Need help with college essays",
      rate: "50$/HR"
    },
    {
      work: "Essay Writing",
      description: "Need help with college essays",
      rate: "50$/HR"
    },
    {
      work: "Web Development",
      description: "React/Next.js developer needed",
      rate: "75$/HR"
    }
  ];

  const categories: string[] = ["Writing", "Coding", "Tutition", "Coding", "Tutition", "Coding", "Tutition"
    , "Coding", "Tutition", "Coding", "Tutition", "Coding", "Tutition", "Coding", "Tutition", "Coding", "Tutition"
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 relative">
        <h2 className="text-3xl font-bold mb-4 text-white">Recommended</h2>
        <div className="relative">
          <div 
            ref={scrollContainer}
            className="flex gap-4 overflow-x-auto pr-4 pb-4 pt-4 scrollbar-hide"
          >
            {recommendations.map((item, index) => (
              <div 
                key={index} 
                className="min-w-[18.75rem] h-[14.0625rem] p-4 mt-3 mb-2 border rounded-lg shadow-sm hover:shadow-md 
                transition-all duration-200 cursor-pointer bg-gray-300 hover:scale-105 "
              >
                <h3 className="font-medium mb-3 text-black">Work: {item.work}</h3>
                <p className="font-medium text-black mb-4">Description: {item.description}</p>
                <p className="font-medium text-black ">Rate: {item.rate}</p>
              </div>
            ))}
          </div>

         <button 
            onClick={() => scroll('right')} 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black rounded-full p-2 shadow-md"
          >
          <ChevronRight size={10} />
          </button>

        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4 text-white">Categories</h2>
        <div className="grid grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="font-medium min-w-[9.375rem] p-4 border rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 
              cursor-pointer bg-gray-300 text-black text-center hover:scale-105"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home_page;

