import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { qaApi, type ChatMessage as ApiChatMessage } from "../lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-forest-800 dark:bg-forest-700 flex-shrink-0 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

const EXAMPLE_QUESTIONS = [
  "Is investing in S&P 500 ETFs permissible?",
  "What is murabaha and how does it work?",
  "Can I use a mortgage if there's no halal alternative?",
  "Is conventional life insurance haram?",
  "How do I calculate my zakat?",
];

export default function QAChat() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  const send = async (question?: string) => {
    const q = (question ?? input).trim();
    if (!q || loading) return;

    const userMessage: Message = { role: "user", content: q };
    const updatedHistory = [...messages, userMessage];

    setInput("");
    setError(null);
    setMessages(updatedHistory);
    setLoading(true);
    scrollToBottom();

    try {
      // Send previous messages as history so the AI has context
      const history: ApiChatMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await qaApi.ask(q, i18n.language, history);
      const { answer } = res.data;

      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } }).response?.status;
      if (status === 429) {
        setError(t("qa.limit_reached"));
      } else {
        setError(t("common.error"));
      }
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setError(null);
    textareaRef.current?.focus();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1.5">{t("qa.title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t("qa.subtitle")}</p>
        </div>

        {/* Disclaimer banner — always visible */}
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl px-4 py-3 mb-6">
          <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-700 dark:text-amber-400">{t("qa.disclaimer")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-forest-800 dark:bg-forest-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{t("qa.advisor")}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">GPT-4o · Islamic Finance</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Trained on Islamic finance principles. Answers in Arabic, French, or English based on your language setting.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                Try asking
              </p>
              <ul className="space-y-2">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <li key={q}>
                    <button
                      onClick={() => send(q)}
                      disabled={loading}
                      className="text-xs text-left rtl:text-right w-full text-gray-600 dark:text-gray-400 hover:text-forest-700 dark:hover:text-forest-400 hover:underline underline-offset-2 transition-colors disabled:opacity-40"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {!isEmpty && (
              <button
                onClick={clearConversation}
                className="text-xs text-gray-400 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors text-center py-1"
              >
                {t("qa.clear")}
              </button>
            )}
          </aside>

          {/* ── Chat panel ───────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col">
            <div
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden"
              style={{ minHeight: "520px", maxHeight: "72vh" }}
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
                {isEmpty && !loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-forest-50 dark:bg-forest-900/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-forest-700 dark:text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-600">{t("qa.empty_state")}</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end rtl:justify-start" : "justify-start rtl:justify-end"}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-forest-800 dark:bg-forest-700 flex-shrink-0 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                        )}

                        <div
                          className={`max-w-sm md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === "user"
                              ? "bg-forest-800 dark:bg-forest-700 text-white rounded-tr-sm rtl:rounded-tr-2xl rtl:rounded-tl-sm"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm rtl:rounded-tl-2xl rtl:rounded-tr-sm border border-gray-100 dark:border-gray-700"
                          }`}
                        >
                          {msg.content}
                        </div>

                        {msg.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                            {t("qa.you").slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                    ))}

                    {loading && <TypingIndicator />}

                    {error && (
                      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </div>
                    )}
                  </>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-gray-100 dark:border-gray-800 p-4">
                <div className="flex gap-3 items-end">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("qa.placeholder")}
                    rows={2}
                    className="flex-1 resize-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-forest-400 dark:focus:border-forest-600 focus:ring-1 focus:ring-forest-400 dark:focus:ring-forest-600 transition-colors"
                  />
                  <button
                    onClick={() => send()}
                    disabled={loading || !input.trim()}
                    className="flex-shrink-0 bg-forest-800 dark:bg-forest-700 text-white w-11 h-11 rounded-xl flex items-center justify-center hover:bg-forest-700 dark:hover:bg-forest-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label={t("qa.send")}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Mobile: clear button + hint */}
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-400 dark:text-gray-600">
                    Enter to send · Shift+Enter for new line
                  </p>
                  {!isEmpty && (
                    <button
                      onClick={clearConversation}
                      className="lg:hidden text-xs text-gray-400 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                    >
                      {t("qa.clear")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
