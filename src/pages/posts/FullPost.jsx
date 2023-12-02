import { Comment } from "@components/comments/Comment";
import { CreateComment } from "@components/comments/CreateComment";
import { Favorite } from "@components/communities/Favorite";
import { Join } from "@components/communities/Join";
import { Post } from "@components/posts/Post";
import { Accordion } from "@components/ui/Accordion";
import { db } from "@utils/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Cake, Loader2 } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

export const FullPost = () => {
    const { postID, communityURL } = useParams();
    const [post, setPost] = useState(null);
    const [communityData, setCommunityData] = useState(null);
    const [moderators, setModerators] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchCommunity = async () => {
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
            fetchCommunity();
        }
    }, [communityURL]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postDoc = await getDoc(doc(db, "posts", postID));
                if (postDoc.exists()) {
                    setPost(postDoc.data());
                } else {
                    console.error("Post not found");
                }
            } catch (error) {
                console.error("Could not fetch post data:", error);
            }
        };

        const fetchModerators = async () => {
            try {
                const moderatorsData = [];
                for (const moderatorID of communityData?.moderators || []) {
                    const userDoc = await getDoc(doc(db, "users", moderatorID));
                    if (userDoc.exists()) {
                        moderatorsData.push(userDoc.data());
                    } else {
                        console.error("Moderator not found:", moderatorID);
                        continue;
                    }
                }
                setModerators(moderatorsData);
            } catch (error) {
                console.error("Could not fetch moderators:", error);
            }
        };
        if (postID && communityData) {
            fetchPost();
            fetchModerators();
        }
    }, [postID, communityData]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const q = query(collection(db, "comments"), where("post_id", "==", postID));
                const querySnapshot = await getDocs(q);
                const commentsData = querySnapshot.docs.map(doc => doc.data());
                setComments(commentsData);
            } catch (error) {
                console.error("Could not fetch comments:", error);
            }
        };
        if (postID) {
            fetchComments();
        }
    }, [postID]);


    if (!post || !communityData) {
        return (
            <div className="flex items-center justify-center headerless w-full">
                <Loader2 className="animate-spin h-10 w-10" />
            </div>
        )
    }

    const followersCount = communityData.followers.length;
    return (
        <div className="min-headerless pt-2 pb-6 px-2 min-[1152px]:px-0 min-[1152px]:pt-6 min-[1152px]:pb-12 grid grid-cols-12 gap-3 min-[1152px]:gap-6">
            <div className="col-span-full md:col-span-8 flex flex-col gap-4">
                <Post post={post} type="full" />
                <CreateComment postID={postID} />
                {comments.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {comments.map(comment => (
                            <Comment key={comment.id} comment={comment} postID={postID} postAuthor={post.createdBy} createdAt={comment.createdAt} />
                        ))}
                    </div>
                ) : (
                    <span className="text-sm font-medium text-muted text-center">No comments yet. Be the first to share your opinion!</span>
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
        </div>
    )
}
