"use client";
import { useState } from "react";
import { PUBLIC_COCKPIT_API_URL } from "@/config/cockpit";
import { SendHorizontal } from "lucide-react";

function getInputName(label, idx) {
  // Use label as name, fallback to index
  return `data[${label?.toLowerCase().replace(/\s+/g, "_") || `field${idx}`}]`;
}

export default function FormComponent({ data }) {
  const { key, inputs = [] } = data || {};
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  if (!key || !Array.isArray(inputs) || !inputs.length) {
    return <div className="text-red-500">Form configuration missing.</div>;
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-green-100 text-green-800 px-4 py-3 mt-4">
        Thank you! Your message has been sent.
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(e.target);

    try {
      const url = `${PUBLIC_COCKPIT_API_URL}/inbox/submit/${key}`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setStatus("success");
        e.target.reset();
      } else {
        setStatus("error");
        setError(result.error || "Submission failed");
      }
    } catch (err) {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl bg-gray-50 p-10 md:p-16 rounded-4xl shadow-xl mt-5 mx-auto"
    >
      {inputs.map((input, idx) => {
        const name = getInputName(input.label, idx);
        const label = input.label || `Field ${idx + 1}`;
        const type = input.type || "text";
        const info = input.info;

        return (
          <div key={name} className="space-y-4">
            <label
              className="block text-foreground uppercase text-xs font-bold tracking-wide"
              htmlFor={name}
            >
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                name={name}
                id={name}
                placeholder={info}
                className="w-full rounded-xl border-none px-3 py-2 bg-card placeholder:text-slate-500 placeholder:text-xs placeholder:capitalize h-32"
                required
              />
            ) : type === "checkbox" ? (
              <input
                type="checkbox"
                name={name}
                id={name}
                className="mr-2 align-middle"
              />
            ) : (
              <input
                type={type}
                name={name}
                id={name}
                placeholder={info}
                className="w-full border-none rounded-xl border px-3 py-2 bg-card placeholder:text-slate-500 placeholder:text-xs placeholder:capitalize"
                required
              />
            )}
          </div>
        );
      })}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="flex items-center justify-center rounded-2xl w-full bg-gradient-to-r from-green-700 to-green-500 p-4 text-white font-semibold hover:bg-gradient-to-r hover:from-green-800 hover:to-green-600 disabled:opacity-60"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending..." : "Transmit Message"}
        <SendHorizontal className="ml-2" size={18} />
      </button>
    </form>
  );
}
