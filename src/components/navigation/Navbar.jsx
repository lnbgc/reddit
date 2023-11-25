import { Logo } from "@components/ui/Logo"
import { ThemeToggle } from "./items/ThemeToggle"
import { Auth } from "./items/Auth"
import { useAuth } from "@contexts/AuthContext"
import { Button } from "@components/ui/Button"
import { ProfileMenu } from "./items/ProfileMenu"

export const Navbar = () => {

  const { userData } = useAuth();
  return (
    <header className="bg-primary text-normal border-b border-border p-2">
      <nav className="flex items-center justify-between">
        <Logo type="responsive" className="h-8" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {userData ? (
            <ProfileMenu userData={userData} />
          ) : (
            <Auth />
          )}
        </div>
      </nav>
    </header>
  )
}
