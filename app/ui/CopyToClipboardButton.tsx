"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyToClipboardButtonProps = {
  text: string;
};

export default function CopyToClipboardButton({
  text,
}: CopyToClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="absolute -top-2 -right-2">
      <div
        onClick={() => {
          window.navigator.clipboard.writeText(text);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        }}
        className="group transition-colors cursor-pointer p-2 rounded-full hover:bg-zinc-800"
      >
        <span className="relative flex size-4 items-center justify-center">
          <Copy
            className={`absolute inset-0 size-4 transition-all duration-300 text-zinc-400 group-hover:text-white ${
              isCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          <Check
            className={`absolute inset-0 size-4 transition-all duration-300 text-emerald-400 ${
              isCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
        </span>
      </div>
    </div>
  );
}
