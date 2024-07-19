import React from 'react';

const Loader = ({ open }: { open: boolean}) => {
  return (
    open && (
      <div className="fixed top-0 z-40 w-full h-screen flex justify-center items-center bg-black/40">
        <i className="animate-spin text-primary text-3xl font-bold text-main fas fa-spinner"></i>
      </div>
    )
  );
};

export default Loader;
