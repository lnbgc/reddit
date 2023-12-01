import { useEffect, useState } from "react";
import { db } from "@utils/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { ReplyButton, ReplyForm } from "./CreateReply";
import { Reply } from "./Reply";
import { Vote } from "@components/votes/Vote";

export const Comment = ({ comment, postAuthor, postID }) => {
    const [creatorData, setCreatorData] = useState(null);
    const [replies, setReplies] = useState([]);
    const [show, setShow] = useState(false);

    const fetchCommentData = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", comment.createdBy));
            if (userDoc.exists()) {
                setCreatorData(userDoc.data());
            }
        } catch (error) {
            console.error("Could not fetch comment data:", error);
        }
    };

    const fetchReplies = async () => {
        try {
            const replies = collection(db, "replies");
            const q = query(replies, where("parent_id", "==", comment.id));
            const querySnapshot = await getDocs(q);
            const repliesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReplies(repliesData);
        } catch (error) {
            console.error("Could not fetch replies:", error);
        }
    }

    useEffect(() => {
        fetchCommentData();
        fetchReplies();
    }, [comment.createdBy, comment.id]);

    return (
        <div className="flex flex-col gap-4">
            {creatorData && (
                <>
                    <div className="flex items-center">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <img src={creatorData.avatar} alt="" className="avatar-sm" />
                            {comment.createdBy === postAuthor ? (
                                <div className="space-x-1">
                                    <span className="font-bold">OP</span>
                                    <span>u/{creatorData.username}</span>
                                </div>
                            ) : (
                                <span>{creatorData.username}</span>
                            )}
                            <span className="w-1 h-1 bg-loading rounded-full" />
                            <span className="text-muted font-normal">moment</span>
                        </div>
                    </div>
                    <div className="flex border-l-1.5 border-border flex-col gap-4 ml-3 pl-[18px]">
                        <p className="text-sm">
                            {comment.content}
                        </p>
                        <div className="flex items-center gap-4">
                            <Vote type="comment" id={comment.id} upvotes={comment.upvotes} downvotes={comment.downvotes} />
                            <ReplyButton setShow={setShow} />
                        </div>
                        <ReplyForm
                            commentID={comment.id}
                            postID={postID}
                            show={show}
                            setShow={setShow}
                        />
                        {replies.map((reply) => (
                            <Reply key={reply.id} reply={reply} postID={postID} postAuthor={postAuthor} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};