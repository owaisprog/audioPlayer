import React from 'react';

const Loader = ({text}) => {
  return (
    <div className="flex flex-col items-center mt-8">
      <h4 id="status" className="mb-4">{text}</h4>
      <div id="loader" className="border-8 border-gray-200 border-t-purple-600 rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
};

export default Loader;
