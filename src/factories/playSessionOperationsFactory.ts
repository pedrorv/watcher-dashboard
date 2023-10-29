import { SessionPlayerState } from "@/types";

export const playSessionOperationsFactory = (
  sessionPlayerState: SessionPlayerState
) => {
  const updateInputValue = (
    iframe: HTMLIFrameElement,
    selector: string,
    cb: (val: string) => string
  ) => {
    const possibleInput =
      iframe?.contentWindow?.document?.querySelector?.(selector);

    if (possibleInput && possibleInput.getAttribute("value") != undefined) {
      (possibleInput as any).value = cb((possibleInput as any).value);
    }
  };

  const displayKeydownEvent = ({
    unique_selector,
  }: {
    unique_selector: string;
  }) => {
    updateInputValue(
      sessionPlayerState.activeIframe,
      unique_selector,
      (val) => val + "*"
    );
  };

  const clearAllInputs = (keydownEvents: any[]) => {
    const uniqueSelectors = Array.from(
      new Set(keydownEvents.map((e) => e.unique_selector))
    );
    const iframes = document.querySelectorAll("iframe.session-frame");

    uniqueSelectors.forEach((selector) => {
      iframes.forEach((iframe) => {
        updateInputValue(iframe as HTMLIFrameElement, selector, () => "");
      });
    });
  };

  const toggleMouseEvent = (event: any, action: "add" | "remove") => {
    const isClick = event.name === "click";
    const div = document.getElementById(event.id);
    if (!div) return;

    div.classList[action]("visible");
    if (isClick) {
      div.classList[action]("click");
    }
  };

  const displayMouseEvent = (e: any) => toggleMouseEvent(e, "add");
  const hideMouseEvent = (e: any) => toggleMouseEvent(e, "remove");

  const displayUIEvent = (event: any) => {
    const currentIframe = document.getElementById(event.id);
    const previousIframe = sessionPlayerState.activeIframe;

    if (currentIframe) {
      sessionPlayerState.activeIframe = currentIframe as HTMLIFrameElement;

      currentIframe.classList.add("visible");

      if (previousIframe && previousIframe !== currentIframe) {
        previousIframe.classList.remove("visible");
      }
    }
  };

  return {
    displayKeydownEvent,
    displayMouseEvent,
    hideMouseEvent,
    displayUIEvent,
    clearAllInputs,
  };
};
