import LoginForm from '@/components/LoginForm'
import WalletPanel from '@/components/WalletPanel'

export default function Page() {
  return (
    <div className="space-y-8">
      <LoginForm />
      <WalletPanel />
    </div>
  )
}
