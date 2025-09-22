// Local Imports
import { Page } from "components/shared/Page";
import { Header } from "./Header";
import { BoardProvider } from "./BoardProvider";
import { Board } from "./Board";

// ----------------------------------------------------------------------

export default function AsignacionProgramas() {
  return (
    <Page title="Asignación de Programas">
      <div className="flex h-full flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-900">
        <BoardProvider>
          <Header />
          <Board />
        </BoardProvider>
      </div>
    </Page>
  );
}
