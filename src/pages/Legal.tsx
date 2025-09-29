import React from 'react';

interface LegalProps {
  title: string;
}

export default function Legal({ title = "LEGAL" }: LegalProps) {
  return (
    <div className="min-h-screen bg-[#E1DFD9]">
      <section className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="impact-text text-5xl md:text-7xl text-[#209D50] mb-12">
            {title}<span className="text-[#E1DFD9]">.</span>
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-white/80 rounded-3xl p-8 shadow-lg">
              <p className="text-black/70">
                This is a placeholder for the {title.toLowerCase()} content. The actual content
                will be provided by the legal team.
              </p>
              
              <h2 className="impact-text text-2xl text-black mt-8 mb-4">
                SECTION 1: OVERVIEW
              </h2>
              <p className="text-black/70">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua.
              </p>
              
              <h2 className="impact-text text-2xl text-black mt-8 mb-4">
                SECTION 2: YOUR RIGHTS
              </h2>
              <p className="text-black/70">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
                aliquip ex ea commodo consequat.
              </p>
              
              <h2 className="impact-text text-2xl text-black mt-8 mb-4">
                SECTION 3: OUR RESPONSIBILITIES
              </h2>
              <p className="text-black/70">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur.
              </p>
              
              <div className="mt-8 p-6 bg-black/5 rounded-2xl">
                <p className="text-black/60 text-sm">
                  Last updated: March 2024
                </p>
                <p className="text-black/60 text-sm mt-2">
                  If you have any questions about these {title.toLowerCase()}, please contact us at{' '}
                  <a href="mailto:legal@barz.jpg" className="text-[#209D50] hover:text-[#209D50]/80 transition-colors">
                    legal@barz.jpg
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}