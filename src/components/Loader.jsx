import React from "react";

const Loader = ({ text, loader }) => {
  return (
    <div className="flex flex-col items-center mt-8">
      <h4 className="md:mx-auto mx-4 my-4 text-black text-3xl font-medium">
        {text}
      </h4>
      {loader && (
        <div
          id="loader"
          className="border-8 border-gray-200 border-t-purple-600 rounded-full w-16 h-16 animate-spin"
        ></div>
      )}
    </div>
  );
};

export default Loader;
