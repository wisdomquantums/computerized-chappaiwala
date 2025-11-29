import { useEffect, useRef } from "react";

const useScrollReveal = ({ threshold = 0.15, once = true } = {}) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const node = elementRef.current;
        if (!node || typeof IntersectionObserver !== "function") {
            if (node) {
                node.classList.add("is-visible");
            }
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    if (once) {
                        observer.unobserve(entry.target);
                    }
                } else if (!once) {
                    entry.target.classList.remove("is-visible");
                }
            });
        }, { threshold });

        observer.observe(node);

        return () => observer.disconnect();
    }, [threshold, once]);

    return elementRef;
};

export default useScrollReveal;
