import { Dropdown } from "@components/ui/Dropdown"
import { useAuth } from "@contexts/AuthContext";
import { CREATECOMMUNITY } from "@routes/routes";
import { Cog, FileText, InfoIcon, LogOut, Plus, UserCircle2 } from "lucide-react"
import moment from "moment/moment";
import { Link } from "react-router-dom"

export const ProfileMenu = ({ userData }) => {

  const { logOut } = useAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Could not log out:", error);
    }
  }

  const currentYear = moment().format('YYYY');

  return (
    <Dropdown trigger={<img src={userData.avatar} alt="" className="avatar-sm" />} top="top-14">
      <div className="w-60 divide-y divide-border">
        <ul className="flex items-center ml-2 pb-3 gap-2">
          <img src={userData.avatar} className="avatar-sm" alt="" />
          <span className="text-muted">{userData.username}</span>
        </ul>
        <ul className="flex flex-col py-2">
          <Link to={`/u/${userData.username}`} className="flex items-center gap-2 py-2 pl-2 rounded-md hover:bg-secondary">
            <UserCircle2 className="icon-sm" />
            Profile
          </Link>
          <Link className="flex items-center gap-2 py-2 pl-2 rounded-md hover:bg-secondary">
            <Cog className="icon-sm" />
            User Settings
          </Link>
        </ul>
        <ul className="flex flex-col py-2">
          <Link to={CREATECOMMUNITY} className="dropdown-link">
            <li className="flex items-center gap-2 py-2 pl-2 rounded-md hover:bg-secondary">
              <Plus className="icon-sm" />
              Create a community
            </li>
          </Link>
          <li className="flex items-center gap-2 py-2 pl-2 rounded-md hover:bg-secondary">
            <InfoIcon className="icon-sm" />
            More
          </li>
          <li className="flex items-center gap-2 py-2 pl-2 rounded-md hover:bg-secondary">
            <FileText className="icon-sm" />
            Terms & Policies
          </li>
        </ul>
        <ul className="py-2">
          <li onClick={handleLogOut} className="flex items-center gap-2 py-2 pl-2 rounded-md hover:bg-secondary cursor-pointer">
            <LogOut className="icon-sm" />
            Log Out
          </li>
          <li className="pl-2 mt-2 text-xs text-faint">Lena Bageac. © {currentYear}. Almost no rights reserved. Please read the terms of use though.</li>
        </ul>
      </div>
    </Dropdown>
  )
}
