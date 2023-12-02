import { db } from "@utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { PostsTab } from "./tabs/PostsTab";
import { UpvotedTab } from "./tabs/UpvotedTab";
import { DownvotedTab } from "./tabs/DownvotedTab";
import { Cake, ChevronDownCircle, ChevronUpCircle, FileBadge, GalleryHorizontalEnd, Loader2, MessageSquare, UserCircle2 } from "lucide-react";
import { OverviewTab } from "./tabs/OverviewTab";
import { Button } from "@components/ui/Button";
import moment from "moment";

export const Profile = () => {

    const { username } = useParams();

    const [profile, setProfile] = useState(null);
    const [upvoted, setUpvoted] = useState([]);
    const [downvoted, setDownvoted] = useState([]);
    const [posts, setPosts] = useState([]);

    const [activeTab, setActiveTab] = useState("Overview");


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

    const fetchPosts = async () => {
        try {
            const q = query(collection(db, "posts"), where("id", "in", profile.posts));
            const querySnapshot = await getDocs(q);
            const postsData = querySnapshot.docs.map((doc) => doc.data());
            setPosts(postsData);
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
        if (profile && profile.posts && profile.posts.length > 0) {
            fetchPosts();
        }
    }, [profile]);


    const tabContent = () => {
        switch (activeTab) {
            case "Overview":
                return <OverviewTab />;
            case "Posts":
                return <PostsTab posts={posts} username={profile.username} />;
            case "Upvoted":
                return <UpvotedTab upvoted={upvoted} username={profile.username} />;
            case "Downvoted":
                return <DownvotedTab downvoted={downvoted} username={profile.username} />;
            default:
                return null;
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

    return (
        <div className="min-headerless ">
            <ul className="py-2 flex font-medium uppercase gap-2">
                <li onClick={() => setActiveTab("Overview")} className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Overview" ? "bg-secondary hover:no-underline" : ""
                    }`}>
                    <GalleryHorizontalEnd className="icon-sm" />
                    Overview
                </li>
                <li onClick={() => setActiveTab("Posts")} className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Posts" ? "bg-secondary hover:no-underline" : ""
                    }`}>
                    <FileBadge className="icon-sm" />
                    Posts
                </li>
                <li onClick={() => setActiveTab("Comments")} className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Comments" ? "bg-secondary hover:no-underline" : ""
                    }`}>
                    <MessageSquare className="icon-sm" />
                    Comments
                </li>
                <li onClick={() => setActiveTab("Upvoted")} className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Upvoted" ? "bg-secondary hover:no-underline" : ""
                    }`}>
                    <ChevronUpCircle className="icon-sm" />
                    Upvoted
                </li>
                <li onClick={() => setActiveTab("Downvoted")} className={`cursor-pointer hover:underline underline-offset-2 rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2 hover-bg-secondary ${activeTab === "Downvoted" ? "bg-secondary hover:no-underline" : ""
                    }`}>
                    <ChevronDownCircle className="icon-sm" />
                    Downvoted
                </li>
            </ul>
            <div className="grid grid-cols-12 gap-6">

                <div className="col-span-full md:col-span-8">
                    <div className="py-2">
                        {tabContent()}
                    </div>
                </div>
                <div className="hidden md:col-span-4 pt-2 md:block">
                    <div className="border border-border rounded-md font-medium text-sm shadow-sm flex flex-col gap-4 p-6">
                        <div className="flex flex-col">
                            <img src={profile.avatar} alt="" className="avatar-lg" />
                            <span>u/{profile.username}</span>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <span className="font-bold">Followers</span>
                                <div className="flex items-center gap-2">
                                    <UserCircle2 className="icon-sm" />
                                    <p>{followersCount}</p>
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

                        <Button type="primary" width="full">
                            Follow
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    )
}
