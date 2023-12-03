import { db, storage } from "@utils/firebase";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { PostsTab } from "./tabs/PostsTab";
import { UpvotedTab } from "./tabs/UpvotedTab";
import { DownvotedTab } from "./tabs/DownvotedTab";
import { Bookmark, Cake, ChevronDownCircle, ChevronRight, ChevronUpCircle, FileBadge, Loader2, MessageSquare, Pen, UserCircle2 } from "lucide-react";
import moment from "moment";
import { SavedTab } from "./tabs/SavedTab";
import { FollowUser } from "./FollowUser";
import { FollowersTab } from "./tabs/FollowersTab";
import { useAuth } from "@contexts/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { SavedTest } from "./tabs/SavedTest";

export const Profile = () => {

    const { username } = useParams();

    const { userData } = useAuth();

    const [profile, setProfile] = useState(null);
    const [upvoted, setUpvoted] = useState([]);
    const [downvoted, setDownvoted] = useState([]);

    const [activeTab, setActiveTab] = useState("Posts");

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [moderating, setModerating] = useState([]);






    const fetchUser = async () => {
        try {
            const q = query(collection(db, "users"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                console.error("User not found");
                // navigate to 404 page
                return;
            }
            const userDoc = querySnapshot.docs[0];
            const profileData = userDoc?.data();
            setProfile(profileData);
        } catch (error) {
            console.error("Could not fetch community data:", error);
        }
    }

    const fetchUpvoted = async () => {
        try {
            const q = query(collection(db, "posts"), where("id", "in", profile.upvoted));
            const querySnapshot = await getDocs(q);
            const upvotedData = querySnapshot.docs.map((doc) => doc.data());
            setUpvoted(upvotedData);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchDownvoted = async () => {
        try {
            const q = query(collection(db, "posts"), where("id", "in", profile.downvoted));
            const querySnapshot = await getDocs(q);
            const downvotedData = querySnapshot.docs.map((doc) => doc.data());
            setDownvoted(downvotedData);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchModerating = async () => {
        try {
            const q = query(collection(db, "communities"), where("id", "in", profile.moderating));
            const querySnapshot = await getDocs(q);
            const communityData = querySnapshot.docs.map((doc) => doc.data());
            setModerating(communityData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log("Effect: Fetching user");
        fetchUser();
    }, [username]);

    useEffect(() => {
        console.log("Effect: Fetching upvoted and downvoted posts");
        if (profile && profile.upvoted && profile.upvoted.length > 0) {
            fetchUpvoted();
        }
        if (profile && profile.downvoted && profile.downvoted.length > 0) {
            fetchDownvoted();
        }
        if (profile && profile.moderating && profile.moderating.length > 0) {
            fetchModerating();
        }
    }, [profile]);


    const tabContent = () => {
        switch (activeTab) {
            case "Posts":
                return <PostsTab profile={profile} />;
            case "Upvoted":
                return <UpvotedTab upvoted={upvoted} username={profile.username} />;
            case "Saved":
                return <SavedTest profile={profile} />;
            case "Downvoted":
                return <DownvotedTab downvoted={downvoted} username={profile.username} />;
            case "Followers":
                return <FollowersTab profileID={profile.uid} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (avatar) {
            updateAvatar();
        }
    }, [avatar]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewURL = e.target.result;
                setAvatarPreview(previewURL);
            };

            reader.readAsDataURL(file);
        }
    };

    const updateAvatar = async () => {
        try {
            const userDoc = doc(db, "users", userData.uid);
            if (avatar) {
                const avatarRef = ref(storage, `users_avatars/${userData.uid}`);
                await uploadBytes(avatarRef, avatar);
                const avatarURL = await getDownloadURL(avatarRef);
                await updateDoc(userDoc, { avatar: avatarURL });
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!profile) {
        return (
            <div className="flex items-center headerless justify-center w-full">
                <Loader2 className="animate-spin h-10 w-10" />
            </div>
        )
    }

    const followersCount = profile.followers.length;

    const userIsProfile = userData.uid === profile.uid;

    return (
        <div className="min-headerless pt-2 pb-6 px-2 min-[1152px]:px-0 min-[1152px]:pt-6 min-[1152px]:pb-12">
            <ul className="flex font-medium uppercase gap-2">
                <li onClick={() => setActiveTab("Posts")} className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Posts" ? "bg-secondary hover:no-underline" : ""
                    }`}>
                    <FileBadge className="icon-sm" />
                    <span className="hidden md:block">Posts</span>
                </li>
                <li onClick={() => setActiveTab("Comments")} className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Comments" ? "bg-secondary hover:no-underline" : ""
                    }`}>
                    <MessageSquare className="icon-sm" />
                    <span className="hidden md:block">Comments</span>
                </li>
                <li onClick={() => setActiveTab("Saved")} className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Saved" ? "bg-secondary hover:no-underline" : ""
                    }`}>
                    <Bookmark className="icon-sm" />
                    <span className="hidden md:block">Saved</span>
                </li>
                <li onClick={() => setActiveTab("Upvoted")} className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Upvoted" ? "bg-secondary hover:no-underline" : ""
                    }`}>
                    <ChevronUpCircle className="icon-sm" />
                    <span className="hidden md:block">Upvoted</span>
                </li>
                <li onClick={() => setActiveTab("Downvoted")} className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Downvoted" ? "bg-secondary hover:no-underline" : ""
                    }`}>
                    <ChevronDownCircle className="icon-sm" />
                    <span className="hidden md:block">Downvoted</span>
                </li>
            </ul>
            <div className="grid grid-cols-12 gap-6">

                <div className="col-span-full md:col-span-8">
                    <div className="py-2">
                        {tabContent()}
                    </div>
                </div>
                <div className="hidden md:col-span-4 pt-2 md:flex flex-col gap-4">
                    <div className="border border-border rounded-md font-medium text-sm shadow-sm flex flex-col gap-4 p-6">
                        <span className="">u/{profile.username}</span>
                        <div className="flex flex-col">
                            <div className="relative w-fit">
                                <img
                                    src={avatarPreview || profile.avatar}
                                    className="w-16 h-16 object-cover rounded-full"
                                />
                                {userIsProfile && (
                                    <div className="absolute bg-primary rounded-md p-1 -right-1 -bottom-0 border border-border shadow-sm">
                                        <label className="cursor-pointer">
                                            <Pen className="w-3 h-3" />
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <span className="font-bold">Followers</span>
                                <div className="flex items-center gap-2">
                                    <UserCircle2 className="icon-sm" />
                                    <p>{followersCount}</p>
                                    {profile.followers.length > 0 && (
                                        <ChevronRight className="icon-sm cursor-pointer" onClick={() => setActiveTab("Followers")} />
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="font-bold">Cake Day</span>
                                <div className="flex items-center gap-2">
                                    <Cake className="icon-sm" />
                                    <p>{moment(profile.createdAt.toDate()).format('MMM D, YYYY')}.</p>
                                </div>
                            </div>
                        </div>
                        <FollowUser profileID={profile.uid} />
                    </div>

                    {moderating.length > 0 && (
                        <div className="border border-border rounded-md font-medium text-sm shadow-sm flex flex-col gap-4 p-6">
                            <span className="uppercase text-faint text-xs">{userData ? "You are" : `u/${profile.username} is`} moderating these communities</span>
                            <ul className="space-y-1">
                                {moderating.map(community => (
                                    <li key={community.id}>
                                        <Link to={`/r/${community.url}`} className="flex items-center gap-2 hover:bg-secondary p-1 rounded-md">
                                            <img src={community.avatar} className="avatar-sm" alt="" />
                                            {community.url}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
