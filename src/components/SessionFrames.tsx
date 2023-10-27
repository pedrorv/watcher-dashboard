function SessionFrames({ uiEvents }: { uiEvents: any[] }) {
  const event = uiEvents[0];

  return (
    <iframe
      id={"session-frame"}
      style={{ border: "none", margin: "0 auto" }}
      width={event.properties.innerWidth}
      height={event.properties.innerHeight}
      srcdoc={event.properties.screenshot}
    />
  );
}

export default SessionFrames;
