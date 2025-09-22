import { createSafeContext } from "utils/createSafeContext";

export const [ProgramaFormContextProvider, useProgramaFormContext] = createSafeContext(
    "useProgramaFormContext must be used within a ProgramaFormContextProvider",
);