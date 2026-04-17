import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DocumentCreatePage } from "./pages/DocumentCreatePage";
import { DocumentEditPage } from "./pages/DocumentEditPage";
import { DocumentViewPage } from "./pages/DocumentViewPage";
import { SearchPage } from "./pages/SearchPage";

const App = (): JSX.Element => (
  <Routes>
    <Route element={<Layout />} path="/">
      <Route element={<SearchPage />} index />
      <Route element={<DocumentCreatePage />} path="documents/new" />
      <Route element={<DocumentViewPage />} path="documents/:slug" />
      <Route element={<DocumentEditPage />} path="documents/:slug/edit" />
    </Route>
  </Routes>
);

export default App;
