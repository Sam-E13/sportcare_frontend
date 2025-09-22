// Import Dependencies
import PropTypes from "prop-types";
import { useRef, useEffect, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { FaUsers } from "react-icons/fa6";

// Local Imports
import { Avatar, ScrollShadow } from "components/ui";
import { TaskCard } from "./Column/Task/TaskCard";
import { useBoardContext } from "../Board.context";

// ----------------------------------------------------------------------

export function UnassignedAthletesColumn({ athletes }) {
  const { instanceId } = useBoardContext();
  const columnId = "unassigned-athletes";

  const tasksWrapperRef = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = tasksWrapperRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({ columnId }),
      canDrop: ({ source }) =>
        source.data.instanceId === instanceId && source.data.type === "card",
      getIsSticky: () => true,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [instanceId]);

  return (
    <div
      className={`relative flex h-full shrink-0 flex-col rounded-xl transition-all duration-200 ${
        isDraggedOver
          ? "bg-secondary-50 dark:bg-secondary-900/20 ring-2 ring-secondary-300 dark:ring-secondary-700 scale-[1.02]"
          : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-900 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="relative flex max-h-full w-80 shrink-0 flex-col p-4">
        {/* Header */}
        <div className="flex min-w-0 items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-dark-700">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar
              size={10}
              initialColor="secondary"
              initialVariant="soft"
              classNames={{
                display: "rounded-lg shadow-sm",
                root: "bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/30"
              }}
            >
              <FaUsers className="size-5" />
            </Avatar>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-base font-semibold text-gray-900 dark:text-dark-100">
                Atletas sin Asignar
              </h4>
              <p className="text-xs text-gray-500 dark:text-dark-400">
                {athletes.length} {athletes.length === 1 ? 'atleta disponible' : 'atletas disponibles'}
              </p>
            </div>
          </div>
          {/* Badge con el número de atletas */}
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            athletes.length > 0
              ? "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400"
              : "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400"
          }`}>
            {athletes.length}
          </span>
        </div>

        {/* Lista de Atletas */}
        <ScrollShadow
          ref={tasksWrapperRef}
          className="hide-scrollbar relative flex-1 space-y-2.5 overflow-y-auto"
        >
          {athletes.length > 0 ? (
            <>
              {/* Mensaje informativo */}
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                  💡 Arrastra los atletas a los programas para asignarlos
                </p>
              </div>
              {athletes.map((athlete) => (
                <TaskCard
                  key={athlete.id}
                  data={athlete}
                  columnData={{ id: columnId }}
                />
              ))}
            </>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-lg bg-success-50 dark:bg-success-900/20 p-6 text-center">
              <div className="text-4xl">🎉</div>
              <div>
                <p className="text-sm font-semibold text-success-700 dark:text-success-400">
                  ¡Excelente trabajo!
                </p>
                <p className="text-xs text-success-600 dark:text-success-500 mt-1">
                  Todos los atletas han sido asignados a un programa
                </p>
              </div>
            </div>
          )}
        </ScrollShadow>
      </div>
    </div>
  );
}

UnassignedAthletesColumn.propTypes = {
  athletes: PropTypes.array.isRequired,
};