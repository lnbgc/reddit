import { db } from "@utils/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { MessageSquare } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const CommentsTab = ({ profile }) => {

    const [groupedComments, setGroupedComments] = useState({});

    const fetchComments = async () => {
        try {
            const commentsQuery = query(collection(db, "comments"), where("id", "in", profile.comments));
            const repliesQuery = query(collection(db, "replies"), where("id", "in", profile.comments));
            const [commentsSnapshot, repliesSnapshot] = await Promise.all([
                getDocs(commentsQuery),
                getDocs(repliesQuery),
            ]);
            const commentsData = await Promise.all(
                commentsSnapshot.docs.map(async (commentDoc) => {
                    const commentData = commentDoc.data();
                    const postDoc = await getDoc(doc(db, "posts", commentData.post_id));
                    const postData = postDoc.data();
                    const communityDoc = await getDoc(doc(db, "communities", postData.community));
                    const communityData = communityDoc.data();
                    return {
                        comment: commentData,
                        post: { ...postData, community: communityData },
                    };
                })
            );
            const repliesData = await Promise.all(
                repliesSnapshot.docs.map(async (replyDoc) => {
                    const replyData = replyDoc.data();
                    const postDoc = await getDoc(doc(db, "posts", replyData.post_id));
                    const postData = postDoc.data();
                    const communityDoc = await getDoc(doc(db, "communities", postData.community));
                    const communityData = communityDoc.data();
                    return {
                        comment: replyData,
                        post: { ...postData, community: communityData },
                    };
                })
            );
            const allData = [...commentsData, ...repliesData];
            const grouped = {};
            allData.forEach(({ comment, post }) => {
                const postID = post.id;
                if (!grouped[postID]) {
                    grouped[postID] = [];
                }
                grouped[postID].push({ comment, post });
            });
            setGroupedComments(grouped);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (profile && profile.comments && profile.comments.length > 0) {
            fetchComments();
        }
    }, [profile]);

    return (
        <>
            {profile.comments.length > 0 ? (
                <ul className="flex flex-col gap-4">
                    {Object.entries(groupedComments).map(([postID, comments]) => (
                        <li key={postID} className="border border-border rounded-md">
                            <div className="flex gap-2 border-b border-border p-4">
                                <MessageSquare className="icon-sm text-muted" />
                                <div className="text-sm flex flex-wrap items-center space-x-1.5">
                                    <p className="text-muted">
                                        <span className="font-bold">{profile.username} </span>
                                        commented on
                                    </p>
                                    <Link to={`/r/${comments[0].post.community.url}/${postID}`} className="font-bold text-muted hover:underline">
                                        {comments[0].post.title}
                                    </Link>
                                    {comments[0].post.flair && (
                                        <div className="text-xs bg-accent font-medium text-white dark:text-primary py-0.5 px-2 rounded-full">
                                            {comments[0].post.flair}
                                        </div>
                                    )}
                                    <span className="w-0.5 h-0.5 bg-faint block rounded-full" />
                                    <Link to={`/r/${comments[0].post.community.url}`} className="font-bold hover:underline">
                                        r/{comments[0].post.community.url}
                                    </Link>
                                </div>
                            </div>

                            <ul className="divide-y divide-border">
                                {comments.map(({ comment }) => (
                                    <li key={comment.id} className="text-sm p-4">
                                        <div className="border-l-2 border-dashed border-border pl-4">
                                            <div className="text-muted flex items-center gap-1.5">
                                                {profile.username}
                                                <span className="w-0.5 h-0.5 bg-faint block rounded-full" />
                                                <p>{moment(comment.createdAt.toDate()).fromNow()}</p>
                                            </div>
                                            <p className="font-medium">{comment.content}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="border border-border rounded-md text-sm font-medium p-4">
                    u/{profile.username} has not commented on anything yet.
                </div>
            )}

        </>
    );
};