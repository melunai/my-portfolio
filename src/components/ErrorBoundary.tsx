import React from "react";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: unknown) { console.error("App error:", error); }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh grid place-items-center p-6 text-center">
          <div>
            <h1 className="text-2xl font-semibold">Что-то пошло не так</h1>
            <p className="mt-2 opacity-70">Обновите страницу, а если повторится — напишите мне.</p>
            <button
              className="mt-4 inline-flex items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2"
              onClick={() => location.reload()}
            >
              Обновить
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
