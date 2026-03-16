"use client";
import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type DropdownProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  labelStyle?: string;
};

export default function Dropdown({
  label,
  value,
  onChange,
  options,
  placeholder = "Seleccionar o escribir...",
  labelStyle = "ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const inputValue = selectedOption ? selectedOption.label : value;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex grow flex-col" ref={dropdownRef}>
      <label className={labelStyle}>
        <span>{label}</span>
      </label>
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            readOnly
            onChange={handleInputChange}
            onClick={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`h-11 w-full rounded-xl border bg-zinc-900 pr-16 pl-4 text-sm shadow-sm transition-all outline-none placeholder:text-zinc-400 ${
              isOpen
                ? "border-indigo-500 ring ring-indigo-500"
                : "border-zinc-700"
            }`}
          />
          <div
            onClick={toggleDropdown}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
          >
            <ChevronDown
              className={`h-4 w-4 text-zinc-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {isOpen && options.length > 0 && (
          <div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-lg">
            <ul className="max-h-60 overflow-y-auto px-1 py-1">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`flex cursor-pointer items-center justify-between rounded-md px-4 py-2.5 text-sm transition-colors  ${
                    value === option.value
                      ? "bg-zinc-800 font-medium text-indigo-300"
                      : "text-zinc-400 hover:bg-zinc-800/60"
                  }`}
                >
                  {option.label}
                  {value === option.value && (
                    <Check className="h-4 w-4 text-indigo-500" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
