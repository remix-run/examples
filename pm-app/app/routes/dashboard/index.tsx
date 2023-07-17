import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import * as React from "react";

import { getUserProjects } from "~/db.server";
import stylesUrl from "~/dist/styles/routes/dashboard/index.css";
import type { Project } from "~/models";
import { requireUser } from "~/session.server";
import { Avatar } from "~/ui/avatar";
import {
  DropdownMenuPopover,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuList,
  DropdownMenuOptionsButton,
} from "~/ui/dropdown-menu";
import { Link } from "~/ui/link";
import { MaxContainer } from "~/ui/max-container";
import { Heading, Section } from "~/ui/section-heading";
import { ShadowBox } from "~/ui/shadow-box";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({ request }: LoaderArgs) => {
  const { passwordHash, ...secureUser } = await requireUser(request, {
    redirect: "/sign-in",
  });

  const projects = await getUserProjects(secureUser.id);

  return json({
    user: secureUser,
    projects,
  });
};

export default function DashboardIndex() {
  const { user, projects } = useLoaderData<typeof loader>();
  const { nameFirst } = user;
  const deleteFetcher = useFetcher();
  const deleteFormRef = React.useRef<HTMLFormElement | null>(null);
  const [projectToDelete, setProjectToDelete] = React.useState<
    Project["id"] | null
  >(null);

  if (!user) {
    return <p>Opppps</p>;
  }

  return (
    <MaxContainer>
      <div className="dashboard__header">
        <div className="dashboard__header-inner">
          <Heading level={2}>Hello, {nameFirst}!</Heading>
          <p>Here's what you missed while you were away.</p>
        </div>
      </div>
      <section className="dashboard__section dashboard__projects">
        <Heading className="dashboard__section-heading">Projects</Heading>
        <Section as="div" className="dashboard__project-list">
          {projects.map(({ name, id, members }) => {
            return (
              <article key={id} className="dashboard__project">
                <Link
                  to={`projects/${id}`}
                  className="dashboard__project-block-link dashboard__project-link"
                >
                  <ShadowBox className="dashboard__project-box">
                    <Heading className="dashboard__project-heading" level={4}>
                      {name}
                    </Heading>
                    {members.length > 0 ? (
                      <div className="dashboard__member-list">
                        {members.map((member, i) => {
                          return (
                            <Avatar
                              size="md"
                              key={member.id}
                              className="dashboard__member"
                              {...member}
                              // @ts-ignore
                              style={{ "--n": i }}
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </ShadowBox>
                </Link>
                {/* MENU BUTTON */}
                <DropdownMenu
                  id={`project-options-${id}-button`}
                  className="dashboard__project-opts-menu"
                >
                  <DropdownMenuOptionsButton
                    type="button"
                    className="dashboard__project-opts-button"
                    aria-label="Project options"
                  />
                  <DropdownMenuPopover>
                    <DropdownMenuList>
                      <DropdownMenuItem
                        variant="danger"
                        onSelect={() => {
                          setProjectToDelete(id);
                          const confirmed = window.confirm(
                            "Are you sure? This will also delete all todo lists associated with this project.",
                          );
                          if (confirmed) {
                            deleteFetcher.submit(deleteFormRef.current, {
                              replace: true,
                            });
                          }
                        }}
                      >
                        Delete project
                      </DropdownMenuItem>
                    </DropdownMenuList>
                  </DropdownMenuPopover>
                </DropdownMenu>
              </article>
            );
          })}
          <div>
            <Link
              to="projects/new"
              className="dashboard__project-block-link dashboard__create-link"
            >
              <div className="h4">Create a new project</div>
            </Link>
          </div>
        </Section>

        <deleteFetcher.Form
          hidden
          action={
            projectToDelete ? `projects/${projectToDelete}/delete` : undefined
          }
          method={projectToDelete ? "post" : undefined}
          replace
          ref={deleteFormRef}
        >
          <button>Delete project</button>
        </deleteFetcher.Form>
      </section>
    </MaxContainer>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  switch (caught.status) {
    case 401:
    case 404:
      return (
        <div>
          <h1>
            {caught.status} -- {caught.statusText}
          </h1>
        </div>
      );

    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`,
      );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <div>
        <h1>PM Camp</h1>
        <div>Crap</div>
      </div>
    </div>
  );
}
