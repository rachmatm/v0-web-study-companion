import { Header } from '@/components/header'
import { ChatInterface } from '@/components/chat-interface'

export default function StudyPage() {
  return (
    <div className="h-dvh flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  )
}
