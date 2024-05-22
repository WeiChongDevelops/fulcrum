import { categoryIconComponentMap } from "@/utility/util.ts";

interface DynamicIconComponentProps {
  componentName: string;
  props?: any;
  className?: string;
}

export default function DynamicIconComponent({ componentName, props, className }: DynamicIconComponentProps) {
  const Component = categoryIconComponentMap[componentName];
  const classNames = { className };
  if (!Component) {
    return <div>{componentName} not found</div>;
  }
  return <Component {...props} {...classNames} />;
}
