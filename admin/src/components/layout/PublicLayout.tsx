import { Outlet } from 'react-router-dom'
import MarketingBackground from '../marketing/MarketingBackground'
import MarketingNavbar from '../marketing/MarketingNavbar'

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen text-tsai-text">
      <MarketingBackground variant="auth" />
      <MarketingNavbar />
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  )
}
