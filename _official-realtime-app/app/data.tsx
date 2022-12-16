export type User = { name: string; avatarUrl: string };

export type Issue = {
  id: string;
  userId: string;
  title: string;
  priority: number;
  status: number;
  owner: User;
  date: string;
};

const users: Record<string, User> = {
  chance: {
    name: "Chance Strickland",
    avatarUrl: "https://github.com/chaance.png",
  },
  ryan: {
    name: "Ryan Florence",
    avatarUrl: "https://github.com/ryanflorence.png",
  },
};

const defaultIssues: Issue[] = [
  {
    id: "REM-1",
    userId: "chance",
    title: "Community stuff [TODO: rename this]",
    priority: 0,
    status: 1,
  },
  {
    id: "REM-2",
    userId: "ryan",
    title:
      "Provide `matches` to loader/action/meta args [TODO: flesh this out]",
    priority: 0,
    status: 3,
  },
  {
    id: "REM-3",
    userId: "chance",
    title: "ci - update RR workflow to comment again",
    priority: 1,
    status: 3,
  },
  {
    id: "REM-4",
    userId: "chance",
    title: "Write decision doc on replacing `@remix-run/dev` with `remix`",
    priority: 0,
    status: 1,
  },
  {
    id: "REM-5",
    userId: "chance",
    title: "Make a list of new docs/guides that we want to write",
    priority: 3,
    status: 1,
  },
  {
    id: "REM-6",
    userId: "chance",
    title: "React Router + Webpack migration guide using BYOC",
    priority: 4,
    status: 2,
  },
  {
    id: "REM-7",
    userId: "ryan",
    title: "Fetcher API Updates Decision Doc",
    priority: 0,
    status: 0,
  },
  {
    id: "REM-8",
    userId: "ryan",
    title: "Add `createCloudflareDurableObjectSessionStorage`",
    priority: 1,
    status: 2,
  },
  {
    id: "REM-9",
    userId: "ryan",
    title: "Add CF workers ESM request handler",
    priority: 0,
    status: 2,
  },
  {
    id: "REM-10",
    userId: "chance",
    title: "bring React 18 fixtures/templates in line with indie-stack updates",
    priority: 0,
    status: 0,
  },
  {
    id: "REM-11",
    userId: "chance",
    title:
      "Back navigation from ErrorBoundary (without `<Scripts>`) does not work properly",
    priority: 0,
    status: 3,
  },
  {
    id: "REM-12",
    userId: "ryan",
    title:
      "An error in MetaFunction or LinkFunction is not caught by ErrorBoundary",
    priority: 0,
    status: 0,
  },
  {
    id: "REM-13",
    userId: "chance",
    title: "Fix rendered href for createHashRouter links",
    priority: 2,
    status: 4,
  },
  {
    id: "REM-14",
    userId: "ryan",
    title: "Optional Route Segments Internal RFC",
    priority: 0,
    status: 4,
  },
  {
    id: "REM-15",
    userId: "ryan",
    title: "bug: Respect basename in RR useFormAction",
    priority: 2,
    status: 2,
  },
  {
    id: "REM-16",
    userId: "chance",
    title: "UMD Build for remix-run/router",
    priority: 0,
    status: 3,
  },
  {
    id: "REM-17",
    userId: "chance",
    title: "Bug: Form action for pathless layout routes",
    priority: 3,
    status: 2,
  },
  {
    id: "REM-18",
    userId: "chance",
    title: "React Router: Optional Params",
    priority: 0,
    status: 2,
  },
  {
    id: "REM-19",
    userId: "ryan",
    title: "RouterProvider unit test refactor",
    priority: 0,
    status: 3,
  },
  {
    id: "REM-20",
    userId: "ryan",
    title: "Fetcher API updates Implementation",
    priority: 0,
    status: 0,
  },
  {
    id: "REM-21",
    userId: "ryan",
    title: "Move dom utils from react-router to @remix-run/router",
    priority: 0,
    status: 0,
  },
  {
    id: "REM-22",
    userId: "chance",
    title: "Add SSR deferred hydration support to RR",
    priority: 0,
    status: 2,
  },
  {
    id: "REM-23",
    userId: "chance",
    title: "Hash link handling in react router",
    priority: 4,
    status: 2,
  },
  {
    id: "REM-24",
    userId: "ryan",
    title: "Write decision doc on service workers",
    priority: 4,
    status: 0,
  },
].map((issue) => {
  return {
    ...issue,
    owner: users[issue.userId],
    date: "Oct 10",
  };
});

export async function getIssues() {
  return defaultIssues;
}

export async function getIssue(id: string) {
  return defaultIssues.find((issue) => issue.id === id);
}

export async function updateIssue(id: string, updates: any) {
  const issue = defaultIssues.find((issue) => issue.id === id);
  if (!issue) return null;
  if (updates.priority) {
    updates.priority = parseInt(updates.priority, 10);
  }
  Object.assign(issue, updates);
  return issue;
}
