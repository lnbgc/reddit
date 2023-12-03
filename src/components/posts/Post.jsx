import { Vote } from "@components/votes/Vote";
import { useAuth } from "@contexts/AuthContext";
import { db } from "@utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { MessageSquare } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SavePost } from "./SavePost";

export const Post = ({ post, type }) => {
    const { userData } = useAuth();
    const [creatorData, setCreatorData] = useState(null);
    const [communityData, setCommunityData] = useState(null);

    const style = type === "full" ? "full" : "preview";

    const fetchPostData = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", post.createdBy));
            if (userDoc.exists()) {
                setCreatorData(userDoc.data());
            }
            const communityDoc = await getDoc(doc(db, "communities", post.community));
            setCommunityData(communityDoc.data());
        } catch (error) {
            console.error("Error fetching post data:", error);
        }
    };

    useEffect(() => {
        fetchPostData();
    }, [post.createdBy, post.community, userData?.uid]);

    const PreviewTitle = () => {
        return (
            <Link to={`/r/${communityData?.url}/${post.id}`} className="font-bold text-lg">
                {post.flair && (
                    <span className="flair mr-2">{post.flair}</span>
                )}
                {post.title}
            </Link>
        )
    }

    const PreviewContent = () => {
        return (
            <Link to={`/r/${communityData?.url}/${post.id}`} className="truncate-lines">
                <p className="text-sm">
                    {post.content}
                </p>
            </Link>
        )
    }

    const PreviewImage = () => {
        return (
            <Link to={`/r/${communityData?.url}/${post.id}`}>
                <img src={post.image} alt={post.title} className="w-full max-h-96 self-center rounded-md object-cover" />
            </Link>
        )
    }

    const PreviewInfo = () => {
        return (
            <div className="flex items-center justify-between text-sm w-full">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <img src={communityData?.avatar} alt="" className="avatar-md" />
                        <Link to={`/r/${communityData?.url}`} className="bg-secondary px-2 py-1 rounded-md font-semibold hover:bg-secondaryHover">r/{communityData?.url}</Link>
                    </div>
                    <div className="flex gap-1 text-xs text-muted">
                        <span className="hidden md:block">posted by</span>
                        {communityData && communityData.moderators.includes(post.createdBy) ? (
                            <span className="select-none">MODERATORS</span>
                        ) : (
                            <Link to={`/u/${creatorData?.username}`} className="underline underline-offset-4">u/{creatorData ? creatorData.username : "deleted-user"}</Link>
                        )}
                    </div>
                </div>
                <div className="items-center gap-2 flex">
                    <span className="w-2 h-2 bg-loading block rounded-full" />
                    <span className="text-muted">{moment(post.createdAt.toDate()).fromNow()}</span>
                </div>
            </div>
        )
    }

    const PreviewMore = () => {
        return (
            <div className="flex items-center justify-between text-muted font-medium">
                <div className="flex gap-4">
                    <Vote type="post" id={post.id} upvotes={post.upvotes} downvotes={post.downvotes} />
                    <div className="flex text-sm items-center gap-1">
                        <MessageSquare className="icon-sm" />
                        <p>{post.comments.length} </p>
                        <span className="hidden md:block">comments</span>
                    </div>
                    <SavePost postID={post.id} />
                </div>
            </div>
        )
    }



    const Preview = () => {
        if (post.image && post.content) {
            return (
                <div className="flex flex-col gap-3 py-6 font-medium">
                    <PreviewInfo />
                    <PreviewTitle />
                    <PreviewContent />
                    <PreviewImage />
                    <PreviewMore />
                </div>
            );
        } else if (post.image && !post.content) {
            return (
                <div className="flex flex-col gap-3 py-6 font-medium">
                    <PreviewInfo />
                    <PreviewTitle />
                    <PreviewImage />
                    <PreviewMore />
                </div>
            );
        } else if (!post.image && post.content) {
            return (
                <div className="flex flex-col gap-3 py-6 font-medium">
                    <PreviewInfo />
                    <PreviewTitle />
                    <PreviewContent />
                    <PreviewMore />
                </div>
            );
        } else {
            return (
                <div className="flex flex-col gap-3 py-6 font-medium">
                    <PreviewInfo />
                    <PreviewTitle />
                    <PreviewMore />
                </div>
            );
        }
    };

    return (
        <div className={style}>
            {type === 'preview' && Preview()}
            {type === 'full' && (
                <div className="flex flex-col gap-4">
                    <PreviewInfo />
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-bold" >
                            {post.flair && (
                                <span className="text-sm font-medium bg-loading text-white rounded-full px-3.5 py-1 mr-2">{post.flair}</span>
                            )}
                            {post.title}
                        </h1>
                    </div>
                    <p className="font-medium text-base">{post.content}</p>
                    {post.image && <img src={post.image} alt={post.title} className="rounded-md" />}
                    <PreviewMore />
                </div>
            )}
        </div>
    )
}