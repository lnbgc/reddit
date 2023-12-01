import { Button } from "@components/ui/Button";
import { Modal, ModalBody, ModalHeader } from "@components/ui/Modal";
import { Vote } from "@components/votes/Vote";
import { useAuth } from "@contexts/AuthContext";
import { db } from "@utils/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { MessageCircle, Share2, Shield, ShieldEllipsis, Trash } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Post = ({ post, type }) => {
    const { userData } = useAuth();
    const [creatorData, setCreatorData] = useState(null);
    const [communityData, setCommunityData] = useState(null);
    const [isModerator, setIsModerator] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const style = type === "full" ? "full" : "preview";

    const fetchPostData = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", post.createdBy));
            if (userDoc.exists()) {
                setCreatorData(userDoc.data());
            }
            const communityDoc = await getDoc(doc(db, "communities", post.community));
            if (communityDoc.exists()) {
                setCommunityData(communityDoc.data());
                const isUserModerator = communityDoc.data().moderators.includes(userData.uid);
                setIsModerator(isUserModerator);
            }
        } catch (error) {
            console.error("Error fetching post data:", error);
        }
    };

    useEffect(() => {
        fetchPostData();
    }, [post.createdBy, post.community, userData?.uid]);

    const handleDelete = async () => {
        try {
            if (isModerator || userData.uid === post.createdBy) {
                await deleteDoc(doc(db, "posts", post.id));
                const updatedPosts = communityData.posts.filter((postId) => postId !== post.id);
                await updateDoc(doc(db, "communities", post.community), {
                    posts: updatedPosts,
                });
            }
        } catch (error) {
            console.error("Could not delete post;", error)
        }
    }

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
            <div className="flex justify-between text-muted font-medium">
                <div className="flex gap-4">
                    <Vote type="post" id={post.id} upvotes={post.upvotes} downvotes={post.downvotes} />
                    <div className="flex text-sm items-center gap-1">
                        <MessageCircle className="icon-sm" />
                        <p>{post.comments.length} </p>
                        <span className="hidden md:block">comments</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <Share2 className="icon-sm" />
                        <span className="hidden md:block">Share</span>
                    </div>
                </div>
                {isModerator || userData?.uid === post.createdBy ? (
                    <Trash className="icon-xs cursor-pointer" onClick={() => setShowModal(true)} />
                ) : null}
                <Modal show={showModal} setShow={setShowModal}>
                    <ModalHeader>
                        <h2>Delete this post?</h2>
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-8 w-80">
                            <p className="text-sm">This action will permanently delete this post from its community and your user profile. Are you sure you want to proceed?</p>
                            <div className="space-y-2">
                                <Button type="primary" width="full" onClick={handleDelete}>
                                    Yes, delete this post
                                </Button>
                                <Button type="secondary" width="full" onClick={() => setShowModal(false)}>
                                    No, I changed my mind
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
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