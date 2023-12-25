import React, { useState, useEffect } from 'react';
import {
  EyeIcon,
  CursorArrowRaysIcon,
  RectangleStackIcon,
  PencilSquareIcon

} from "@heroicons/react/24/outline";

import "./HelpMenu.css";
import HelpModal from './HelpModal';
import helpContent from './helpContent'; // Import the content file

const items = [
  {
    name: "How to Mark Tables",
    description: "Get a better understanding of tables options",
    href: "#",
    icon: RectangleStackIcon,
  },
  {
    name: "How to Take Orders",
    description: "Take customers orders quickly and efficiently",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "How to View Orders",
    description: "Need to fulfill an order? Learn how to view orders here",
    href: "#",
    icon: EyeIcon,
  },
  {
    name: "How to Edit Map",
    description: "Restaurant layout changed? Learn how to edit the map here",
    href: "#",
    icon: PencilSquareIcon,
  },
];

function HelpMenu(props) {
  // Initialize a local state with the value of the isActive prop
  const [isActive, setIsActive] = useState(props.isActive);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleButtonClick = (topic) => {
    setModalContent(helpContent[topic]);
    setIsModalOpen(true);
  };


  useEffect(() => {
    setIsActive(props.isActive);
  }, [props.isActive]);


  return (
    <div
      className={`help-menu w-screen max-w-4xl overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 ${
        isActive ? "active" : "inactive"
      }`}
    >
      <div className="p-4">
        {items.map((item) => (
          <div
            key={item.name}
            onClick={() => handleButtonClick(item.name)}
            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
          >
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
              <item.icon
                className="h-6 w-6 text-gray-600 group-hover:text-emerald-600"
                aria-hidden="true"
              />
            </div>
            <div className="flex-auto">
              <a href={item.href} className="block font-semibold text-gray-900">
                {item.name}
                <span className="absolute inset-0" />
              </a>
              <p className="mt-1 text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between p-4">
        <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">
          Ask for Help
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={ () => setIsActive(false)}>
          Exit
        </button>
      </div>
      <HelpModal
        isOpen={isModalOpen}
        content={modalContent}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default HelpMenu;
