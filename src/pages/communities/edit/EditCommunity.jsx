import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@utils/firebase";
import { GeneralTab } from "./GeneralTab";
import { Cog, FileText, Loader2, LogOut, TagsIcon, UserCircle2 } from "lucide-react";
import { Button } from "@components/ui/Button";
import { FlairsTab } from "./FlairsTab";
import { RulesTab } from "./RulesTab";
import { UsersTab } from "./UsersTab";
import { useAuth } from "@contexts/AuthContext";

export const EditCommunity = () => {
  const { communityURL } = useParams();
  const [communityData, setCommunityData] = useState(null);
  const [activeTab, setActiveTab] = useState("General");
  const { userData } = useAuth();

  const fetchCommunityData = async () => {
    try {
      const q = query(collection(db, "communities"), where("url", "==", communityURL));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.error("Community not found");
        return;
      }
      const communityDoc = querySnapshot.docs[0];
      const communityData = communityDoc?.data();
      setCommunityData(communityData);
    } catch (error) {
      console.error("Could not fetch community data:", error);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, [communityURL]);

  const tabContent = () => {
    switch (activeTab) {
      case "General":
        return <GeneralTab communityData={communityData} />;
      case "Users":
        return <UsersTab communityData={communityData} />;
      case "Flairs":
        return <FlairsTab communityData={communityData} />;
      case "Rules":
        return <RulesTab communityData={communityData} />;
      default:
        return null;
    }
  };

  if (!communityData) {
    return (
      <div className="flex items-center headerless justify-center w-full">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    )
  }

  const isModerator = communityData && communityData.moderators.includes(userData?.uid);

  if (!isModerator) {
    return <Navigate to={`/r/${communityURL}`} />;
  }

  return (
    <div className="min-headerless px-2 min-[1152px]:px-0">
      <div className="border-b border-border flex justify-between items-center pt-2 min-[1152px]:pt-6 pb-3">
        <div>
          <h1 className="text-xl font-bold">Mod Tools</h1>
          <p className="font-medium text-muted text-sm">Manage community settings.</p>
        </div>
        <Link to={`/r/${communityURL}`}>
          <Button>
            <LogOut className="icon-sm" />
            <span className="hidden md:block">
              Exit Mod Tools
            </span>
          </Button>
        </Link>
      </div>

      <div className="pt-2 pb-6 min-[1152px]:pt-4 min-[1152px]:pb-12 flex md:grid grid-cols-12 gap-4">
        <div className="md:col-span-3">
          <ul className="flex flex-col gap-2">
            <li className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-2 px-3 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "General" ? "bg-secondary hover:no-underline" : ""
              }`} onClick={() => setActiveTab("General")}>
              <Cog className="icon-sm" />
              <span className="hidden md:block">General Settings</span>
            </li>
            <li className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-2 px-3 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Users" ? "bg-secondary hover:no-underline" : ""
              }`} onClick={() => setActiveTab("Users")}>
              <UserCircle2 className="icon-sm" />
              <span className="hidden md:block">Users Management</span>
            </li>
            <li className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-2 px-3 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Flairs" ? "bg-secondary hover:no-underline" : ""
              }`} onClick={() => setActiveTab("Flairs")}>
              <TagsIcon className="icon-sm" />
              <span className="hidden md:block">Post Flairs</span>
            </li>
            <li className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-2 px-3 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Rules" ? "bg-secondary hover:no-underline" : ""
              }`} onClick={() => setActiveTab("Rules")}>
              <FileText className="icon-sm" />
              <span className="hidden md:block">Community Rules</span>
            </li>
          </ul>
        </div>
        <div className="md:col-span-9 w-full">
          {tabContent()}
        </div>
      </div>
    </div>
  )
}
