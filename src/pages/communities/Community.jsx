import { Favorite } from "@components/communities/Favorite";
import { Join } from "@components/communities/Join";
import { Post } from "@components/posts/Post";
import { Accordion } from "@components/ui/Accordion";
import { Button } from "@components/ui/Button";
import { useAuth } from "@contexts/AuthContext";
import { CREATEPOST } from "@routes/routes";
import { db } from "@utils/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { Cake, Cog, Image, Loader2 } from "lucide-react";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

export const Community = () => {

    const { userData } = useAuth();
    const { communityURL } = useParams();

    const [communityData, setCommunityData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [moderators, setModerators] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, "communities"), where("url", "==", communityURL));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    console.error("Community not found");
                    // navigate to 404 page
                    return;
                }

                const communityDoc = querySnapshot.docs[0];
                const communityData = communityDoc?.data();
                setCommunityData(communityData);

            } catch (error) {
                console.error("Could not fetch community data:", error);
                // navigate to 404 page
            }
        };

        if (communityURL) {
            fetchData();
        }
    }, [communityURL]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (communityData) {
                    const q = query(collection(db, "posts"), where("community", "==", communityData.id));
                    const querySnapshot = await getDocs(q);
                    const postsData = querySnapshot.docs.map(doc => doc.data());
                    const sortedPosts = postsData.sort((a, b) => b.createdAt - a.createdAt);
                    setPosts(sortedPosts);
                }
            } catch (error) {
                console.error("Could not fetch posts:", error);
            }
        };

        const fetchModerators = async () => {
            try {
                if (communityData) {
                    const moderatorsData = [];
                    for (const moderatorID of communityData.moderators) {
                        const userDoc = await getDoc(doc(db, "users", moderatorID));
                        if (userDoc.exists()) {
                            moderatorsData.push(userDoc.data());
                        } else {
                            console.error("Moderator not found:", moderatorID);
                            continue;
                        }
                    }
                    setModerators(moderatorsData);

                }
            } catch (error) {
                console.error("Could not fetch moderators:", error);
            }
        };

        fetchPosts();
        fetchModerators();
    }, [communityData]);


    if (communityData == null) {
        return (
            <div className="flex items-center justify-center headerless w-full">
                <Loader2 className="animate-spin h-10 w-10" />
            </div>
        );
    }

    const followersCount = communityData.followers.length;

    const isModerator = userData && communityData.moderators.includes(userData?.uid);

    const isFollowing = userData?.following_communities.includes(communityData.id);

    return (
        <div className="min-headerless">
            <div className="pt-2 pb-6 px-2 min-[1152px]:px-0 min-[1152px]:pt-6 min-[1152px]:pb-12 grid grid-cols-12 gap-3 min-[1152px]:gap-6">
                <div className="col-span-full md:col-span-8">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                            <img src={communityData.avatar} className="avatar-lg" />
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <h1 className="font-bold text-lg">{communityData.name}</h1>
                                    <p className="text-sm font-medium text-muted">r/{communityData.url}</p>
                                </div>
                            </div>
                        </div>
                        {isModerator && (
                            <Link to={`/r/${communityData.url}/edit`}>
                                <Button>
                                    <Cog className="icon-sm" />
                                    Mod Tools
                                </Button>
                            </Link>
                        )}
                    </div>
                    {isFollowing ? (
                        <Link to={CREATEPOST} state={{ communityData }} className="mt-4 flex items-center gap-2 w-full border border-border rounded-md shadow-sm p-2">
                            <img src={userData.avatar} className="avatar-md" alt="" />
                            <input type="text" placeholder="Create post" className="text-sm font-medium outline-none bg-transparent placeholder:text-faint rounded-md w-full border border-border py-2 px-3" />
                            <Button>
                                <Image className="icon-sm text-muted" />
                            </Button>
                        </Link>
                    ) : (
                        <div className="mt-4 text-sm font-medium border border-border rounded-md shadow-sm p-4">
                            Join r/{communityData.url} to start posting.
                        </div>
                    )}

                    {posts.length > 0 ? (
                        <div className="divide-y divide-border">
                            {posts.map(post => (
                                <Post type="preview" key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="pt-6 flex justify-center">
                            <span className="text-sm font-medium text-muted">No posts yet.</span>
                        </div>
                    )}

                </div>
                <div className="col-span-4 hidden text-sm md:flex flex-col gap-3">
                    <div className="border border-border rounded-md shadow-sm p-6 flex flex-col gap-3">
                        <span className="text-xs text-faint uppercase font-medium">About community</span>
                        {communityData.description && (
                            <p>{communityData.description}</p>
                        )}

                        <div className="border-y border-border py-4 flex items-center font-medium gap-2">
                            <Cake className="icon-sm" />
                            <p>Created {moment(communityData.createdAt.toDate()).format('MMM D, YYYY')}.</p>
                        </div>
                        <div className="flex justify-between items-center font-medium">
                            <span className="">
                                Followers:
                            </span>
                            <p className="py-2 px-3 border-border border rounded-md shadow-sm">
                                {followersCount
                                    ? (followersCount === 1
                                        ? `${followersCount} follower`
                                        : `${followersCount} followers`)
                                    : "0 followers"}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Join communityID={communityData.id} />
                            <Favorite communityID={communityData.id} />
                        </div>
                    </div>

                    {communityData.flairs && communityData.flairs.length > 0 && (
                        <div className="border border-border rounded-md shadow-sm p-6 flex flex-col gap-3">
                            <span className="text-xs text-faint uppercase font-medium">Flairs</span>
                            <div className="flex flex-wrap gap-1">
                                {communityData.flairs.map((flair) => (
                                    <span key={flair.id} className="flair">{flair}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {communityData.rules && communityData.rules.length > 0 && (
                        <div className="border border-border rounded-md shadow-sm p-6 flex flex-col gap-3">
                            <span className="text-xs text-faint uppercase font-medium">r/{communityData.url} rules</span>
                            <div className="flex flex-wrap gap-1">
                                <Accordion counter={true} items={communityData.rules} />
                            </div>
                        </div>
                    )}

                    <div className="border border-border rounded-md shadow-sm p-6 flex flex-col gap-3">
                        <span className="text-xs text-faint uppercase font-medium">Moderators</span>
                        <ul className="flex flex-col gap-2 font-medium underline underline-offset-2">
                            {moderators.map((moderator, index) => (
                                <li key={index}>
                                    <Link to={`/u/${moderator.username}`}>
                                        u/{moderator.username}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div >
        </div>
    )
}