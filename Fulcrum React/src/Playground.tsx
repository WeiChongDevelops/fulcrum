import * as Frigade from "@frigade/react";

interface PlaygroundProps {}

export default function Playground({}: PlaygroundProps) {
  return (
    <div>
      <Frigade.Tour flowId="flow_cH9yTsMx" zIndex={10000} />
      <div className={"size-64 bg-red-500"} id={"tooltip-select-0"}></div>
      <div className={"size-64 bg-blue-500 absolute bottom-0 right-0"} id={"tooltip-select-1"}></div>
    </div>
  );
}
