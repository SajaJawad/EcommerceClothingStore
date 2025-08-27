import React from "react";

const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col justify-center items-center h-[60vh]">
            {/* الدائرة الدوارة */}
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            {/* النص تحت اللودر */}
            <span className="mt-4 text-gray-600">{text}</span>
        </div>
    );
};

export default Loader;