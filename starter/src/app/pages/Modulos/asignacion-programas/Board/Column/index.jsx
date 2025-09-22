// Import Dependencies
import PropTypes from "prop-types";
import { FaListCheck } from "react-icons/fa6";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

// Local Imports
import { Avatar, ScrollShadow } from "components/ui";
import { useBoardContext } from "../../Board.context";
import { TaskCard } from "./Task/TaskCard";

// ----------------------------------------------------------------------

const idle = { type: "idle" };
const dragging = { type: "dragging" };

export function Column({ data, tasks }) {
  const { id, color, Icon, nombre } = data; // 'nombre' viene de la API
  const [cardDraggableState, setCardDraggableState] = useState(idle);
  const tasksWrapperRef = useRef();
  const columnRef = useRef();

  const { instanceId, registerColumn } = useBoardContext();

  useEffect(() => {
    const column = columnRef.current;
    const tasksWrapper = tasksWrapperRef.current;
    invariant(column);
    invariant(tasksWrapper);
    
    // Convertimos el ID numérico del programa a string para consistencia
    const columnId = String(id);

    return combine(
      registerColumn({
        columnId: columnId,
        entry: {
          element: column,
        },
      }),
      dropTargetForElements({
        element: tasksWrapper,
        getData: () => ({ columnId: columnId }),
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === "card"
          );
        },
        getIsSticky: () => true,
        onDragEnter: () => setCardDraggableState(dragging),
        onDragLeave: () => setCardDraggableState(idle),
        onDrop: () => setCardDraggableState(idle),
      }),
      autoScrollForElements({
				element: tasksWrapper,
				canScroll: ({ source }) =>
					source.data.instanceId === instanceId && source.data.type === 'card',
			})
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, instanceId]);

  return (
    <div
      className={clsx(
        "relative flex h-full shrink-0 flex-col rounded-xl transition-all duration-200",
        cardDraggableState.type === "dragging"
          ? "bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-300 dark:ring-primary-700"
          : "bg-white dark:bg-dark-800 shadow-sm hover:shadow-md"
      )}
    >
      <div
        ref={columnRef}
        className="relative flex max-h-full w-80 shrink-0 flex-col p-4"
      >
        {/* Header de la columna */}
        <div className="flex min-w-0 items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-dark-700">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar
              size={10}
              initialColor={color || "primary"}
              initialVariant={(color && color !== "neutral") ? "soft" : "filled"}
              classNames={{
                display: "rounded-lg shadow-sm",
              }}
            >
              {Icon ? (
                <Icon className="size-5" />
              ) : (
                <FaListCheck className="size-5" />
              )}
            </Avatar>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-base font-semibold text-gray-900 dark:text-dark-100">
                {nombre}
              </h4>
              <p className="text-xs text-gray-500 dark:text-dark-400">
                {tasks.length} {tasks.length === 1 ? 'atleta' : 'atletas'}
              </p>
            </div>
          </div>
          {/* Badge con el número de atletas */}
          <span className={clsx(
            "px-2.5 py-1 text-xs font-medium rounded-full",
            tasks.length > 0
              ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
              : "bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-dark-400"
          )}>
            {tasks.length}
          </span>
        </div>

        {/* Lista de atletas */}
        <ScrollShadow
          ref={tasksWrapperRef}
          className="hide-scrollbar relative flex-1 space-y-2.5 overflow-y-auto"
        >
          {tasks?.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                data={task}
                columnData={data}
                key={task.id}
              />
            ))
          ) : (
            <div className={clsx(
              "flex h-40 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center",
              cardDraggableState.type === "dragging"
                ? "border-primary-300 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-900/10"
                : "border-gray-200 dark:border-dark-600"
            )}>
              <div className="text-3xl">
                {cardDraggableState.type === "dragging" ? "🎯" : "📋"}
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-dark-400">
                {cardDraggableState.type === "dragging"
                  ? "Suelta aquí para asignar"
                  : "Sin atletas asignados"
                }
              </p>
              <p className="text-xs text-gray-400 dark:text-dark-500">
                Arrastra atletas desde la columna &quot;Sin Asignar&quot;
              </p>
            </div>
          )}
        </ScrollShadow>
      </div>
    </div>
  );
}

Column.propTypes = {
  data: PropTypes.object,
  tasks: PropTypes.array,
};