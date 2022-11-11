import type { DOMAttributes } from "react";
import invariant from "tiny-invariant";

type CustomElement<T> = Partial<
  T & DOMAttributes<T> & { children: any; class: string; ref?: any }
>;

export class AmalgoBox extends HTMLElement {
  get input() {
    return this.querySelector("input") as HTMLInputElement;
  }

  get button() {
    return this.querySelector("button") as HTMLButtonElement;
  }

  get popover() {
    return this.querySelector("amalgo-popover") as Popover;
  }

  get allOptions() {
    return Array.from(this.querySelectorAll("amalgo-option")) as Option[];
  }

  get visibleOptions() {
    return Array.from(
      this.querySelectorAll("amalgo-option:not([hidden])")
    ) as Option[];
  }

  get highlightedIndex() {
    const activeElement = this.querySelector(
      "amalgo-option[highlight]"
    ) as Option;
    return activeElement ? this.visibleOptions.indexOf(activeElement) : -1;
  }

  toggle() {
    if (this.hasAttribute("open")) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.setAttribute("open", "");
    this.button.setAttribute("aria-expanded", "true");

    this.addEventListener("keydown", this.keydownEvent);
    this.highlightInitial();
    this.input.focus();

    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", this.documentOuterEvent);
    document.addEventListener("touchstart", this.documentOuterEvent);
    document.addEventListener("focusin", this.documentOuterEvent);
  }

  close() {
    this.removeAttribute("open");
    this.button.setAttribute("aria-expanded", "false");
    this.clearHighlighted();
    this.clearSearch();
    this.removeEventListener("keydown", this.keydownEvent);

    document.body.style.overflow = "";
    document.removeEventListener("mousedown", this.documentOuterEvent);
    document.removeEventListener("touchstart", this.documentOuterEvent);
    document.removeEventListener("focusin", this.documentOuterEvent);
  }

  highlightInitial() {
    const highlightValue = this.getAttribute("highlight");
    const option = this.querySelector(
      `amalgo-option[value="${highlightValue}"]`
    ) as Option;
    if (option) {
      this.highlightOption(option);
    }
  }

  filter(query: string) {
    for (const option of this.allOptions) {
      const text = option.textContent?.trim().toLowerCase() || "";
      const matches = text.includes(query.trim().toLowerCase());
      console.log({ matches, text, query });
      if (matches) {
        option.hidden = false;
      } else {
        option.hidden = true;
      }
    }
  }

  private keydownEvent = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        this.cycleHighlight(1);
        event.preventDefault();
        break;
      case "ArrowUp":
        this.cycleHighlight(-1);
        event.preventDefault();
        break;
      case "Enter":
        this.selectHighlighted();
        break;
      case "Escape":
        this.close();
        this.button.focus();
        break;
    }
  };

  private cycleHighlight(which: number) {
    const nextOption = this.visibleOptions[this.highlightedIndex + which];
    if (nextOption) {
      this.highlightOption(nextOption);
    }
  }

  highlightOption(option: Option) {
    this.clearHighlighted();
    option.setAttribute("highlight", "");
    this.input.setAttribute("aria-activedescendant", option.id);
  }

  private selectHighlighted() {
    const option = this.visibleOptions[this.highlightedIndex];
    if (option) {
      this.select(option);
    }
  }

  private documentOuterEvent = (event: Event) => {
    const interactedInside =
      event.target instanceof Node && this.contains(event.target);

    if (!interactedInside) {
      this.close();
    }
  };

  clearHighlighted() {
    this.querySelector("amalgo-option[highlight]")?.removeAttribute(
      "highlight"
    );
  }

  clearSearch() {
    this.input.value = "";
    const items = this.querySelectorAll("amalgo-option[hidden]");
    for (const item of items) {
      item.removeAttribute("hidden");
    }
  }

  select(option: Option) {
    this.dispatchEvent(
      new CustomEvent("onOptionSelect", {
        detail: option.getAttribute("value"),
      })
    );
    this.close();
    // let focus rest, otherwise "keyup" will be fired on the button when
    // selecting with keyboard "Enter" and the button will be "clicked" again,
    // opening the menu
    requestAnimationFrame(() => {
      this.button.focus();
    });
  }
}

class AmalgoElement extends HTMLElement {
  get root() {
    const root = this.closest("amalgo-box");
    invariant(root instanceof AmalgoBox);
    return root;
  }
}

class Button extends AmalgoElement {
  get button() {
    const button = this.querySelector("button");
    invariant(button instanceof HTMLButtonElement);
    return button;
  }

  connectedCallback() {
    this.button.setAttribute("aria-haspopup", "menu");
    this.button.addEventListener("click", () => {
      this.root.toggle();
    });
  }
}

class Input extends AmalgoElement {
  get input() {
    return this.querySelector("input") as HTMLInputElement;
  }

  connectedCallback() {
    this.input.setAttribute("role", "combobox");
    this.input.setAttribute("aria-autocomplete", "list");
    this.input.setAttribute("aria-expanded", "true");
    this.input.addEventListener("input", () => {
      this.root.filter(this.input.value);
    });
  }
}

class Popover extends AmalgoElement {
  connectedCallback() {
    this.id = "popover-" + Math.random().toString(36).slice(2);
    this.root.button.setAttribute("aria-controls", this.id);
  }
}

class Menu extends AmalgoElement {
  connectedCallback() {
    this.id = "menu-" + Math.random().toString(36).slice(2);
    this.setAttribute("role", "listbox");

    this.root.input.setAttribute("aria-controls", this.id);
  }
}

class Option extends AmalgoElement {
  connectedCallback() {
    this.id = "option-" + Math.random().toString(36).slice(2);
    this.setAttribute("role", "option");

    this.addEventListener("mouseenter", () => {
      this.root.highlightOption(this);
    });

    this.addEventListener("click", () => {
      this.root.select(this);
    });
  }
}

////////////////////////////////////////////////////////////////////////////////
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["amalgo-box"]: CustomElement<AmalgoBox & { highlight?: string }>;
      ["amalgo-button"]: CustomElement<Button>;
      ["amalgo-input"]: CustomElement<Input>;
      ["amalgo-popover"]: CustomElement<Popover>;
      ["amalgo-menu"]: CustomElement<Menu>;
      ["amalgo-option"]: CustomElement<
        Option & { highlight?: string; value?: string }
      >;
    }
  }
}

let registered = false;
export function registerCustomElements() {
  console.log("registering");
  if (registered) return;
  registered = true;
  window.customElements.define("amalgo-box", AmalgoBox);
  window.customElements.define("amalgo-button", Button);
  window.customElements.define("amalgo-input", Input);
  window.customElements.define("amalgo-popover", Popover);
  window.customElements.define("amalgo-menu", Menu);
  window.customElements.define("amalgo-option", Option);
}
