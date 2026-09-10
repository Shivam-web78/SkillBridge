import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Send, MessageSquare } from 'lucide-react'
import {
  fetchConversations, fetchThread, sendMessage, fetchMessagablePeople, setActivePartner
} from '../features/messages/messageSlice'
import EmptyState from '../components/EmptyState'

export default function Messages({ role }) {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { conversations, activeThread, activePartnerId, messagablePeople } = useSelector((s) => s.messages)
  const [text, setText] = useState('')
  const [showPeople, setShowPeople] = useState(false)

  useEffect(() => {
    if (!user) return
    dispatch(fetchConversations(user.id))
    dispatch(fetchMessagablePeople(role))
  }, [user, role, dispatch])

  function handleSelectConversation(partnerId) {
    dispatch(setActivePartner(partnerId))
    dispatch(fetchThread({ userId: user.id, partnerId }))
    setShowPeople(false)
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim() || !activePartnerId) return
    await dispatch(sendMessage({ from: user.id, to: activePartnerId, text }))
    setText('')
  }

  function startNewConversation(person) {
    handleSelectConversation(person.id)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] gap-4 max-w-5xl mx-auto">
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="w-64 shrink-0 border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-white hidden sm:flex">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-800">Messages</h3>
            <button onClick={() => setShowPeople(!showPeople)} className="text-teal-600 hover:underline text-xs font-medium">
              {showPeople ? 'Conversations' : 'New'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {showPeople ? (
              messagablePeople.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No one to message</p>
              ) : (
                messagablePeople.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => startNewConversation(p)}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 border-b border-slate-50 text-xs"
                  >
                    <p className="font-medium text-slate-800">{p.name}</p>
                    <p className="text-slate-400 text-xs">{p.role}</p>
                  </button>
                ))
              )
            ) : conversations.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No conversations yet</p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.partnerId}
                  onClick={() => handleSelectConversation(c.partnerId)}
                  className={`w-full text-left px-3 py-2.5 border-b border-slate-50 text-xs ${activePartnerId === c.partnerId ? 'bg-teal-50' : 'hover:bg-slate-50'}`}
                >
                  <p className="font-medium text-slate-800">{c.partnerName}</p>
                  <p className="text-slate-400 truncate text-xs">{c.lastMessage || '...'}</p>
                  {c.unread > 0 && <span className="inline-block mt-1 h-1.5 w-1.5 rounded-full bg-teal-500" />}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-white">
          {activePartnerId ? (
            <>
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="font-semibold text-slate-800">
                  {conversations.find((c) => c.partnerId === activePartnerId)?.partnerName || 'Loading...'}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {activeThread.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No messages yet. Start the conversation!</p>
                ) : (
                  activeThread.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs rounded-lg px-3 py-2 text-sm ${msg.from === user.id ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSend} className="px-4 py-3 border-t border-slate-100 flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="btn-primary">
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <EmptyState icon={MessageSquare} title="Select a conversation" description="Choose someone to start messaging." />
          )}
        </div>
      </div>
    </div>
  )
}
