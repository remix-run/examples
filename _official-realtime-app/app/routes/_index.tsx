import { json } from "@remix-run/node";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { useEffect, useRef } from "react";

import * as AmalgoBox from "~/amalgo-box.client";
import type { Issue } from "~/data";
import { getIssues } from "~/data";
import icons from "~/icons.svg";

export async function loader() {
  return json(await getIssues());
}

export default function Index() {
  const issues = useLoaderData<typeof loader>();

  useEffect(() => AmalgoBox.registerCustomElements(), []);
  return (
    <div>
      <Header />
      {issues.map((issue) => (
        <IssueLine key={issue.id} issue={issue} />
      ))}
    </div>
  );
}

function Header() {
  return (
    <div className="sticky top-0 z-10 flex justify-between border-b border-gray-100 bg-white px-6 py-4 text-sm">
      <div className="flex-1">
        <div>All issues</div>
      </div>
      <div className="flex-0">
        <ViewToggler />
      </div>
    </div>
  );
}

function ViewToggler() {
  return (
    <div className="flex rounded shadow-sm">
      <div className="rounded-l border bg-gray-100 px-2 py-1">
        <svg className="h-4 w-3">
          <use href={`${icons}#list`} />
        </svg>
      </div>
      <div className="rounded-r border px-2 py-1">
        <svg className="h-4 w-3">
          <use href={`${icons}#grid`} />
        </svg>
      </div>
    </div>
  );
}

function IssueLine({ issue }: { issue: Issue }) {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  return (
    <div
      onClick={() => navigate(`/issues/${issue.id}`)}
      className="flex cursor-default justify-between gap-8 border-b border-gray-100 py-3 px-6 text-sm hover:bg-gray-50"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <form onClick={(e) => e.stopPropagation()}>
          <input
            className="opacity-25 checked:opacity-100 hover:opacity-100"
            type="checkbox"
          />
        </form>
        <PriorityMenu
          highlight={
            fetcher.submission
              ? parseInt(fetcher.submission.formData.get("priority") as string)
              : issue.priority
          }
          onChange={(priority: string) => {
            if (parseInt(priority) !== issue.priority) {
              fetcher.submit(
                { issueId: issue.id, priority },
                { method: "post", action: `/issues/${issue.id}/update` }
              );
            }
          }}
        />
        <div className="w-14 text-gray-400">{issue.id}</div>
        <StatusMenu issue={issue} />
        <Link
          to={`/issues/${issue.id}`}
          tabIndex={0}
          className="flex-1 cursor-default truncate font-medium text-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {issue.title}
        </Link>
      </div>
      <div className="flex flex-shrink-0 items-center gap-3">
        <div className="text-xs text-gray-400">{issue.date}</div>
        <img
          alt={issue.owner.name + " avatar"}
          src={issue.owner.avatarUrl}
          className="h-5 w-5 rounded-full"
        />
      </div>
    </div>
  );
}

function StatusMenu({ issue }: { issue: Issue }) {
  return (
    <button onClick={(e) => e.stopPropagation()}>
      <svg
        className={classNames(
          `h-[14px] w-[14px] rounded-full`,
          issue.status === 1
            ? "text-yellow-500"
            : issue.status === 2
            ? "text-orange-500"
            : issue.status === 3
            ? "text-green-600"
            : issue.status === 4
            ? "text-indigo-600"
            : "text-gray-300"
        )}
      >
        <use
          href={`${icons}#${
            issue.status === 1
              ? "pie-1/4"
              : issue.status === 2
              ? "pie-1/2"
              : issue.status === 3
              ? "pie-3/4"
              : issue.status === 4
              ? "check"
              : "circle"
          }`}
        />
      </svg>
    </button>
  );
}

function PriorityMenu({
  highlight,
  onChange,
}: {
  highlight: number;
  onChange: (priority: string) => void;
}) {
  const ref = useRef<HTMLElement>();
  useCustomElementEvent(ref, "onOptionSelect", onChange);

  const iconList = [
    "ellipsis-horizontal",
    "priority-low",
    "priority-medium",
    "priority-high",
    "priority-urgent",
  ];

  return (
    <amalgo-box
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      highlight={String(highlight)}
    >
      <amalgo-button>
        <button type="button" aria-label="Set priority...">
          <Icon
            id={iconList[highlight]}
            className={classNames(
              "h-4 w-4",
              highlight == 4 ? "text-orange-500" : "text-gray-400"
            )}
          />
        </button>
      </amalgo-button>
      <amalgo-popover>
        <amalgo-input>
          <input
            type="text"
            placeholder="Set priority..."
            aria-label="Type to filter options"
          />
        </amalgo-input>
        <amalgo-menu>
          <amalgo-option value="0">
            <Option icon={iconList[0]} label="No Priority" />
          </amalgo-option>
          <amalgo-option value="4">
            <Option icon={iconList[4]} label="Urgent" />
          </amalgo-option>
          <amalgo-option value="3">
            <Option icon={iconList[3]} label="High" />
          </amalgo-option>
          <amalgo-option value="2">
            <Option icon={iconList[2]} label="Medium" />
          </amalgo-option>
          <amalgo-option value="1">
            <Option icon={iconList[1]} label="Low" />
          </amalgo-option>
        </amalgo-menu>
      </amalgo-popover>
    </amalgo-box>
  );
}

function Option({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-4 font-light">
      <Icon id={icon} /> {label}
    </div>
  );
}

function Icon({ id, className }: { id: string; className?: string }) {
  return (
    <svg className={className || "h-4 w-4 text-gray-500"}>
      <use href={`${icons}#${id}`} />
    </svg>
  );
}

function useCustomElementEvent<T>(
  ref: React.MutableRefObject<HTMLElement | undefined>,
  eventName: string,
  eventHandler: (event: T) => void
) {
  useEffect(() => {
    const node = ref.current;
    const handler = (event: CustomEvent) => {
      eventHandler(event.detail);
    };
    // @ts-ignore
    node?.addEventListener(eventName, handler);
    return () => {
      // @ts-ignore
      node?.removeEventListener(eventName, handler);
    };
  }, [eventHandler, eventName, ref]);
}
