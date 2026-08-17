import { useEffect } from 'react';

/**
 * Add a window event listener for the lifetime of the calling component.
 * Borrowed from
 * https://atomizedobjects.com/blog/react/add-event-listener-react-hooks/
 *
 * @param event - Event name to listen to.
 * @param handler - Listener invoked for the event.
 * @param passive - If true, the listener will never call preventDefault.
 */
export function useEvent(
  event: string,
  handler: EventListener,
  // eslint-disable-next-line unicorn/consistent-boolean-name -- mirrors EventListenerOptions.passive
  passive = false,
): void {
  useEffect(() => {
    addEventListener(event, handler, passive);

    return function cleanup() {
      removeEventListener(event, handler);
    };
  });
}
