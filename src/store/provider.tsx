import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";

interface PropTypes {
  children: ReactNode;
}

export function ReduxProvider({ children }: PropTypes) {
  return <Provider store={store}>{children}</Provider>;
}
