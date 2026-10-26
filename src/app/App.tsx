import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './router';

/**
 * @description Root application component.
 * @returns {JSX.Element} App tree.
 */
export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
