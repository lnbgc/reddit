import { Logo } from "@components/ui/Logo"
import { ThemeToggle } from "./items/ThemeToggle"
import { Auth } from "./items/Auth"
import { useAuth } from "@contexts/AuthContext"
import { Button } from "@components/ui/Button"

export const Navbar = () => {

  const { userData, logOut } = useAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Could not log out:", error);
    }
  }
  return (
    <header className="bg-primary text-normal border-b border-border p-2">
      <nav className="flex items-center justify-between">
        <Logo type="responsive" className="h-8" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {userData ? (
            <>
              <img src={userData.avatar} alt="" className="avatar" />
              <Button onClick={handleLogOut} className="secondary">
                Log Out
              </Button>
            </>
          ) : (
            <Auth />
          )}
        </div>
      </nav>
    </header>
  )
}
