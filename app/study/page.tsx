import { Header } from '@/components/header'
import { QuizInterface } from '@/components/quiz-interface'

export default function StudyPage() {
  return (
    <div className="h-dvh flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">
        <QuizInterface />
      </main>
    </div>
  )
}
