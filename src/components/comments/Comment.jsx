import { useEffect, useState } from "react";
import { db } from "@utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import moment from "moment";
import { CreateReply } from "./CreateReply";

export const Comment = ({ comment, postAuthor, postID }) => {
    const [creatorData, setCreatorData] = useState(null);

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

    useEffect(() => {
        fetchCommentData();
    }, [comment.createdBy, comment.id]);

    return (
        <div className="flex flex-col gap-4">
            {creatorData && (
                <>
                    <div className="flex items-center">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <img src={creatorData.avatar} alt="" className="w-6 h-6 rounded-full" />
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
                        <CreateReply commentID={comment.id} postID={postID} />
                    </div>
                </>
            )}
        </div>
    );
};