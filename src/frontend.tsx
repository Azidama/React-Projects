/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MiniProjectLayout } from "@/layouts/MiniProjectLayout";

// Mini Projects
import { ColorPicker } from "@/projects/Color Picker/index";
import { CurrencyConverter } from "@/projects/Currency Converter/index";
import { FruitSearchBar } from "@/projects/Fruit search bar/index";
import { MoodBoard } from "@/projects/Mood Board/index";
import { OTPGenerator } from "@/projects/OTP Generator/index";
import { RSVPEventForm } from "@/projects/RSVP Event Form/index";
import { ShoppingList } from "@/projects/Shopping List/index";
import { TicTacToe } from "@/projects/Tic-Tac-Toe/index";
import { Watch } from "@/projects/Watch/index";
import { ProjectsIndex } from "@/projects";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<App />} />

        <Route path="/" element={<ProjectsIndex />} />
        <Route element={<MiniProjectLayout />}>
          <Route path="/color-picker" element={<ColorPicker />} />
          <Route path="/currency-converter" element={<CurrencyConverter />} />
          <Route path="/fruit-search-bar" element={<FruitSearchBar />} />
          <Route path="/mood-board" element={<MoodBoard />} />
          <Route path="/otp-generator" element={<OTPGenerator />} />
          <Route path="/rsvp-event-form" element={<RSVPEventForm />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/watch" element={<Watch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
