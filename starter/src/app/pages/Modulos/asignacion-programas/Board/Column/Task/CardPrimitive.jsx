// Import Dependencies
import PropTypes from "prop-types";
import clsx from "clsx";
import { FaUser, FaIdCard, FaCalendarAlt } from "react-icons/fa";

// Local Imports
import { Avatar, Box } from "components/ui";

// ----------------------------------------------------------------------

export function CardPrimitive({ data }) {
  const { nombre, apPaterno, apMaterno, foto, edad, categoria } = data;
  const fullName = `${nombre} ${apPaterno} ${apMaterno}`;

  return (
    <Box
      className={clsx(
        "flex flex-col rounded-lg transition-all duration-200 hover:scale-[1.02]",
      )}
    >
      <div className="px-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            size={10}
            src={foto}
            name={fullName}
            initialColor="auto"
            classNames={{
              root: "shrink-0 ring-2 ring-white dark:ring-dark-700 shadow-sm",
              display: "font-semibold"
            }}
          >
            {!foto && <FaUser className="size-5" />}
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-sm text-gray-900 dark:text-dark-100">
              {fullName}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              {edad && (
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-dark-400">
                  <FaCalendarAlt className="size-3" />
                  {edad} años
                </span>
              )}
              {categoria && (
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-dark-400">
                  <FaIdCard className="size-3" />
                  {categoria}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

CardPrimitive.propTypes = {
  data: PropTypes.object,
};