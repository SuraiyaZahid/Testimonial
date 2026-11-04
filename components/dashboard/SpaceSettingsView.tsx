"use client";

import { useState } from "react";
import { Settings, Save, Check, Loader2, Plus, Trash2 } from "lucide-react";

interface SpaceSettingsViewProps {
  space: any;
  onRefresh: () => void;
}

export default function SpaceSettingsView({ space, onRefresh }: SpaceSettingsViewProps) {
  const [name, setName] = useState(space.name || "");
  const [headerTitle, setHeaderTitle] = useState(space.headerTitle || "");
  const [customMessage, setCustomMessage] = useState(space.customMessage || "");
  const [logoUrl, setLogoUrl] = useState(space.logoUrl || "");
  const [collectionType, setCollectionType] = useState(space.collectionType || "ALL");
  const [theme, setTheme] = useState(space.theme || "dark");
  const [primaryColor, setPrimaryColor] = useState(space.primaryColor || "#5D5FEF");
  const [thankYouTitle, setThankYouTitle] = useState(space.thankYouTitle || "");
  const [thankYouMessage, setThankYouMessage] = useState(space.thankYouMessage || "");
  const [redirectUrl, setRedirectUrl] = useState(space.redirectUrl || "");
  const [maxVideoDuration, setMaxVideoDuration] = useState(space.maxVideoDuration || 180);

  // Questions
  let initialQuestions: string[] = [];
  try {
    initialQuestions = JSON.parse(space.questions || "[]");
  } catch {
    initialQuestions = [
      "Who are you and what company do you represent?",
      "What problem did our product solve for you?",
    ];
  }
  const [questions, setQuestions] = useState<string[]>(initialQuestions);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  function handleAddQuestion() {
    setQuestions([...questions, ""]);
  }

  function handleUpdateQuestion(index: number, val: string) {
    const copy = [...questions];
    copy[index] = val;
    setQuestions(copy);
  }

  function handleRemoveQuestion(index: number) {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/v1/spaces/${space.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          headerTitle,
          customMessage,
          logoUrl,
          collectionType,
          theme,
          primaryColor,
          thankYouTitle,
          thankYouMessage,
          redirectUrl,
          maxVideoDuration: Number(maxVideoDuration),
          questions: JSON.stringify(questions.filter((q) => q.trim().length > 0)),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update space settings");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Basic Space Info */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Space Brand & Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Space Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Logo / Avatar URL
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Header Title (Shown at top of submission page)
          </label>
          <input
            type="text"
            value={headerTitle}
            onChange={(e) => setHeaderTitle(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Custom Message / Description
          </label>
          <textarea
            rows={2}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Guiding Questions */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Guiding Questions (Prompts for Reviewers)
          </h3>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Question
          </button>
        </div>

        <div className="space-y-2.5">
          {questions.map((q, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-400">
                {idx + 1}
              </span>
              <input
                type="text"
                value={q}
                onChange={(e) => handleUpdateQuestion(idx, e.target.value)}
                placeholder="Question prompt..."
                className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveQuestion(idx)}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Collection Settings */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Collection Rules & Media
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Submission Mode
            </label>
            <select
              value={collectionType}
              onChange={(e) => setCollectionType(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">Both Video & Text</option>
              <option value="VIDEO">Video Only</option>
              <option value="TEXT">Text Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Max Video Duration
            </label>
            <select
              value={maxVideoDuration}
              onChange={(e) => setMaxVideoDuration(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="60">1 Minute (60s)</option>
              <option value="120">2 Minutes (120s)</option>
              <option value="180">3 Minutes (180s - Recommended)</option>
              <option value="300">5 Minutes (300s)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-9 w-12 rounded-lg bg-transparent cursor-pointer border-0"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Note & Redirect */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Thank You Page & Redirection
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Thank You Title
            </label>
            <input
              type="text"
              value={thankYouTitle}
              onChange={(e) => setThankYouTitle(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Optional Redirect URL (After submission)
            </label>
            <input
              type="url"
              placeholder="https://yourwebsite.com/welcome"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Thank You Message
          </label>
          <textarea
            rows={2}
            value={thankYouMessage}
            onChange={(e) => setThankYouMessage(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Space Settings</span>
            </>
          )}
        </button>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-fade-in">
            <Check className="h-4 w-4" />
            Changes saved successfully!
          </span>
        )}
      </div>
    </form>
  );
}

