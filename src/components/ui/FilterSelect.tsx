import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Option = { value: string; label: string };

export default function FilterSelect({
  label,
  value,
  onChange,
  options,
  className = "",
  placeholder = "All",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const list: Option[] = [
    { value: "all", label: placeholder },
    ...options.map((v) => ({ value: v, label: v })),
  ];
  const active = list.find((o) => o.value === value) ?? list[0];

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Keyboard support on the button
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    // NOTE: relative makes the dropdown absolute to THIS wrapper (no layout shift)
    <div className={`relative w-full ${className}`} ref={wrapRef}>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>

      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onKeyDown}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-sm shadow-sm outline-none focus:ring-2 focus:ring-[#1d4ed8] transition"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between">
          <span className="truncate">{active.label}</span>
          <span className="ml-3 text-gray-400">▾</span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            role="listbox"
            aria-activedescendant={active.value}
            // ⬇⬇⬇ Absolute overlay so it doesn't push layout
            className="absolute z-50 left-0 right-0 top-[calc(100%+8px)] max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
          >
            {list.map((opt) => {
              const isActive = opt.value === active.value;
              return (
                <li key={opt.value}>
                  <button
                    id={opt.value}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      btnRef.current?.focus();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
                      ${isActive ? "bg-[#eaf0ff] text-[#1d4ed8]" : "hover:bg-gray-50"}`}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
