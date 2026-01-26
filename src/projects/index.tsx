import clsx from "clsx";
import { Box } from "lucide-react";
import { Link } from "react-router-dom";

export const ProjectsIndex = () => {
  const projects = [
    { name: "Color Picker", path: "/color-picker" },
    { name: "Currency Converter", path: "/currency-converter" },
    { name: "Fruit Search Bar", path: "/fruit-search-bar" },
    { name: "Mood Board", path: "/mood-board" },
    { name: "OTP Generator", path: "/otp-generator" },
    { name: "RSVP Event Form", path: "/rsvp-event-form" },
    { name: "Shopping List", path: "/shopping-list" },
    { name: "Tic Tac Toe", path: "/tic-tac-toe" },
    { name: "Watch", path: "/watch" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link
            key={p.path}
            to={p.path}
            className={clsx(
              "bg-white dark:bg-gray-800",
              "p-6 rounded-xl shadow-md hover:shadow-xl",
              "transition-shadow duration-300 ease-in-out",
              "flex items-center space-x-4"
            )}
          >
            <Box className="w-8 h-8 text-indigo-500" />
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {p.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};