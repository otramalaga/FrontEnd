import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddMarkerButton = ({ onClick, className = '' }) => {
  return (
    <div className={`${className} absolute top-[160px] left-4 z-[1001]`}>
      <button
        onClick={onClick}
        className="bg-secondary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center w-12 h-12"
        title="Agregar nuevo marcador"
      >
        <FontAwesomeIcon icon={faPlus} className="text-white text-xl" />
      </button>
    </div>
  );
};

export default AddMarkerButton;

