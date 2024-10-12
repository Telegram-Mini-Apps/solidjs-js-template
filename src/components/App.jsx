import { Navigate, Route, HashRouter } from '@solidjs/router';
import { For } from 'solid-js';

import { routes } from '@/navigation/routes.jsx';

export function App() {
  return (
    <HashRouter>
      <For each={routes}>
        {(route) => <Route path={route.path} component={route.Component}/>}
      </For>
      <Route path="*" component={() => <Navigate href="/"/>}/>
    </HashRouter>
  );
}
