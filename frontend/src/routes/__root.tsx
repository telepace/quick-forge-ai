import { Outlet, createRootRoute } from "@tanstack/react-router"
import React, { Suspense } from "react"

import NotFound from "@/components/Common/NotFound"

/**
 * Loads and returns a React component that renders both TanStack Router Devtools and React Query Devtools.
 *
 * @returns {Promise<{default: () => JSX.Element}>} A promise that resolves to an object containing the default export, which is a React component.
 *
 * Example usage:
 * loadDevtools().then(({ default: DevToolsComponent }) => {
 *   ReactDOM.render(<DevToolsComponent />, document.getElementById('root'));
 * });
 */
const loadDevtools = () =>
  Promise.all([
    import("@tanstack/router-devtools"),
    import("@tanstack/react-query-devtools"),
  ]).then(([routerDevtools, reactQueryDevtools]) => {
    return {
      default: () => (
        <>
          <routerDevtools.TanStackRouterDevtools />
          <reactQueryDevtools.ReactQueryDevtools />
        </>
      ),
    }
  })

const TanStackDevtools =
  process.env.NODE_ENV === "production" ? () => null : React.lazy(loadDevtools)

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <TanStackDevtools />
      </Suspense>
    </>
  ),
  notFoundComponent: () => <NotFound />,
})
