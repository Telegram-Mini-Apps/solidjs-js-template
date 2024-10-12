import { ErrorBoundary, Switch, Match } from 'solid-js';

import { App } from '@/components/App.jsx';
import { TonConnectUIProvider } from '@/tonconnect/TonConnectUIProvider.jsx';
import { publicUrl } from '@/helpers/publicUrl.js';

function ErrorBoundaryError(props) {
  return (
    <div>
      <p>ErrorBoundary handled error:</p>
      <blockquote>
        <code>
          <Switch fallback={JSON.stringify(props.error)}>
            <Match when={typeof props.error === 'string' ? props.error : false}>
              {v => v()}
            </Match>
            <Match
              when={props.error instanceof Error ? props.error.message : false}>
              {v => v()}
            </Match>
          </Switch>
        </code>
      </blockquote>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <TonConnectUIProvider manifestUrl={publicUrl('tonconnect-manifest.json')}>
        <App/>
      </TonConnectUIProvider>
    </ErrorBoundary>
  );
}
