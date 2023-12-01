import { Vote } from "@components/votes/Vote";
import { db } from "@utils/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ReplyButton, ReplyForm } from "./CreateReply";

export const Reply = ({ reply, postID, postAuthor }) => {
    const [creatorData, setCreatorData] = useState(null);
    const [replies, setReplies] = useState([]);
    const [show, setShow] = useState(false);
    
    const fetchReplyData = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", reply.createdBy));
            if (userDoc.exists()) {
                setCreatorData(userDoc.data());
            }
        } catch (error) {
            console.error("Could not fetch reply data:", error);
        }
    }

    const fetchReplies = async () => {
        try {
            const replies = collection(db, "replies");
            const q = query(replies, where("parent_id", "==", reply.id));
            const querySnapshot = await getDocs(q);
            const repliesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReplies(repliesData);
        } catch (error) {
            console.error("Could not fetch replies to replies:", error);
        }
    }

    useEffect(() => {
        fetchReplyData();
        fetchReplies();
    }, [reply.createdBy, reply.id]);
    return (
        <div className="flex flex-col gap-4">
            {creatorData && (
                <>
                    <div className="flex items-center">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <img src={creatorData.avatar} className="avatar-sm" />
                            {reply.createdBy === postAuthor ? (
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
                            {reply.content}
                        </p>
                        <div className="flex items-center gap-4">
                            <Vote type="reply" id={reply.id} upvotes={reply.upvotes} downvotes={reply.downvotes} />
                            <ReplyButton setShow={setShow} />
                        </div>
                        <ReplyForm
                            commentID={reply.id}
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