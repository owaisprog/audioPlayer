import React from "react";
const Header = () => {
  return (
    <section
      style={{ backgroundImage: `url('/elementi/iStock-1145042624.jpg')` }}
      className=" bg-center bg-cover relative h-[20vw] w-screen"
    >
      <div className=" absolute top-0 left-0 right-0 bottom-0 bg-white opacity-40 z-10"></div>
      <div
        className={`flex container top-0 left-0 right-0 absolute z-10 mx-auto p-4 justify-between items-center`}
      >
        <div className="w-1/3">
          <img
            className="rounded-lg"
            src={"/elementi/loescher_logo.png"}
            alt="Loescher Logo"
          />
        </div>
        <div className="w-2/3 flex justify-center">
          <img
            className="rounded-lg w-1/2"
            src={"/elementi/logo.png"}
            alt="Logo"
          />
        </div>
      </div>
    </section>
  );
};

export default Header;
