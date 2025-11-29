import useScrollReveal from "../../hooks/useScrollReveal";

const Reveal = ({
  as: Component = "div",
  delay = 0,
  className = "",
  children,
  once,
  threshold,
  ...rest
}) => {
  const ref = useScrollReveal({
    threshold: typeof threshold === "number" ? threshold : undefined,
    once: typeof once === "boolean" ? once : true,
  });

  const mergedClassName = ["scroll-reveal", className]
    .filter(Boolean)
    .join(" ");
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Component ref={ref} className={mergedClassName} style={style} {...rest}>
      {children}
    </Component>
  );
};

export default Reveal;
