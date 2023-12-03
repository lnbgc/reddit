import { db } from "@utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FollowUser } from "../FollowUser";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export const FollowersTab = ({ profile }) => {
    const [followers, setFollowers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const fetchFollowers = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "in", profile.followers));
            const querySnapshot = await getDocs(q);
            const followersData = querySnapshot.docs.map((doc) => doc.data());

            setFollowers(followersData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (profile && profile.followers && profile.followers.length > 0) {
            fetchFollowers();
        }
    }, [profile]);

    return (
        <div className="flex flex-col gap-1">
            <div className="pb-6 pt-2">
                <h2 className="font-bold">Followers</h2>
                <p className="text-sm">This list is only visible to you.</p>
            </div>
            <div className="bg-secondaryHover text-sm font-medium rounded-md flex items-center gap-2 p-2">
                <Search className="icon-xs text-muted" />
                <input
                    type="text"
                    placeholder="Filter"
                    className="outline-none bg-transparent w-full placeholder:text-muted"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
            <ul className="divide-y divide-border ml-1 text-sm font-medium">
                {followers.map((follower) => (
                    <li
                        key={follower.uid}
                        className={`flex items-center justify-between py-2 ${follower.username && follower.username.toLowerCase().includes(searchQuery)
                            ? ""
                            : "hidden"
                            }`}
                    >
                        <Link to={`/u/${follower.username}`} >
                            <div className="flex items-center gap-2">
                                <img src={follower.avatar} className="avatar-sm" alt="" />
                                {follower.username}
                            </div>
                        </Link>
                        <div>
                            <FollowUser profileID={follower.uid} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
