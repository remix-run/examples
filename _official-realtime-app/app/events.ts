import { EventEmitter } from "events";

export const EVENTS = {
  ISSUE_CHANGED: "ISSUE_CHANGED",
};

export const emitter = new EventEmitter();
