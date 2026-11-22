import { useConversations } from "@/app/hook/useConversations";

export default function ChatThreadsList() {
  const { threads, activeThreadId, setActiveThreadId } = useConversations();

  return (
    <div
      className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex-col bg-gray-50/30 shrink-0 h-full min-h-0 ${
        activeThreadId ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="p-4 border-b border-gray-100 shrink-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
          Conversations
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
        {threads.length === 0 ? (
          <p className="text-[11px] text-gray-400 text-center py-6">
            No chat conversations yet.
          </p>
        ) : (
          threads.map((th) => (
            <button
              key={th.id}
              onClick={() => setActiveThreadId(th.id)}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeThreadId === th.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0 relative">
                {th.name.charAt(0) || "U"}
                {th.isOnline && (
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-primary border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-xs text-gray-900 truncate">
                    {th.name}
                  </h4>
                  <span className="text-[9px] text-gray-400 shrink-0">
                    {th.time}
                  </span>
                </div>
                <p className="text-[10px] truncate leading-normal text-gray-500">
                  {th.lastMessage}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
