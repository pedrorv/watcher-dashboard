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

  const displayKeydownEvent = (event: any) => {
    const {
      unique_selector,
      properties: { value },
    } = event;

    updateInputValue(sessionPlayerState.activeIframe, unique_selector, (val) =>
      value ? value : val + "*"
    );
  };

  const clearAllInputs = (iframe: HTMLIFrameElement, keydownEvents: any[]) => {
    const uniqueSelectors = Array.from(
      new Set(keydownEvents.map((e) => e.unique_selector))
    );

    uniqueSelectors.forEach((selector) => {
      updateInputValue(iframe as HTMLIFrameElement, selector, () => "");
    });
  };

  const replaceAllBreaks = () => {
    const iframes = document.querySelectorAll("iframe.session-frame");

    iframes.forEach((iframe) => {
      (iframe as HTMLIFrameElement)?.contentWindow?.document
        ?.querySelectorAll("textarea")
        .forEach((textarea) => {
          textarea.value = textarea.value.replace(/<br>/gi, "\n");
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
    replaceAllBreaks,
  };
};
