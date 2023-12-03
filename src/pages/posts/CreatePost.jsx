import { Button } from "@components/ui/Button";
import { Dropdown } from "@components/ui/Dropdown";
import { FileInput } from "@components/ui/FileInput";
import { Input } from "@components/ui/Input";
import { Textarea } from "@components/ui/Textarea";
import { useAuth } from "@contexts/AuthContext";
import { db, storage } from "@utils/firebase";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { CheckCircle, FileText, Image, Loader2, Tags, X } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";

export const CreatePost = () => {

  const { userData } = useAuth();
  const location = useLocation();
  const { communityData } = location.state || {};
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [selectedFlair, setSelectedFlair] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [charLimit, setCharLimit] = useState(300);

  const selectFlair = (flair) => {
    setSelectedFlair(flair);
  };

  const handleContent = (value) => {
    setContent(value);
  }

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImageURL(URL.createObjectURL(file));
    }
  }

  const handleTitle = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setCharLimit(300 - newTitle.length);
  }

  const handleRemoveImage = () => {
    setImage(null);
    setImageURL("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Please enter a post title.");
      return;
    }
    if (communityData.flairs.length > 0 && !selectedFlair) {
      setError("Please select a flair.");
      return;
    }
    try {
      setLoading(true);
      let imageURL = "";
      if (image) {
        const storageRef = ref(storage, `post-images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageURL = await getDownloadURL(storageRef);
      }
      const posts = collection(db, "posts");
      const postDoc = await addDoc(posts, {
        title,
        content,
        createdAt: serverTimestamp(),
        createdBy: userData.uid,
        flair: selectedFlair,
        image: imageURL,
        comments: [],
        upvotes: [],
        downvotes: [],
        community: communityData.id
      })
      const postID = postDoc.id;
      await updateDoc(postDoc, { id: postID });

      await updateDoc(doc(db, "communities", communityData.id), {
        posts: arrayUnion(postID)
      });
      await updateDoc(doc(db, "users", userData.uid), {
        posts: arrayUnion(postDoc.id)
      });
      setError("");
      setSubmitted(true);
      setTimeout(() => {
        navigate(`/r/${communityData.url}`);
      }, 2500);
    } catch (error) {
      setError("Something went wrong. Please try again.")
      console.error("Could not create post:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Helmet>
      <title>Submit post - Reddit</title>
    </Helmet>
      {loading ? (
        <div className="flex items-center justify-center headerless w-full">
          <Loader2 className="animate-spin h-10 w-10" />
        </div>
      ) : submitted ? (
        <div className="flex items-center justify-center headerless w-full">
          <CheckCircle className="text-green-500 h-10 w-10" />
        </div>
      ) : (
        <div className="min-headerless pt-2 pb-6 px-2 min-[1152px]:px-0 min-[1152px]:pt-6 min-[1152px]:pb-12 grid grid-cols-12 gap-3 min-[1152px]:gap-6">
          <div className="col-span-full md:col-span-8">
            <h1 className="font-bold text-xl border-b border-border pb-2">Create a post</h1>
            <form className="pt-3 flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="text-sm font-medium flex items-center gap-2">
                  <img src={communityData.avatar} alt="" className="avatar-md" />
                  <span>r/{communityData.url}</span>
                </div>
                <FileInput
                  label="Upload Image"
                  icon={<Image className="icon-xs" />}
                  onChange={handleImage}
                />
              </div>
              <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={handleTitle}
                maxLength={300}
                description={`${charLimit} characters remaining.`}
              />
              {imageURL && (
                <div className="relative">
                  <img src={imageURL} alt="" className="rounded-md" />
                  <button onClick={handleRemoveImage} className="absolute -top-3 -right-3 bg-primary rounded-full p-1 border border-border"><X className="icon-xs" /></button>
                </div>
              )}
              <Textarea
                placeholder="Text (optional)"
                value={content}
                onChange={handleContent}
              />

              {error && <span className="error">{error}</span>}
            </form>
            <div className="flex justify-between items-center mt-3">
              <Dropdown
                trigger={
                  <span className="flex items-center gap-2">
                    <Tags className="icon-sm" />
                    <span>
                      {selectedFlair ? selectedFlair : "Flair"}
                    </span>
                  </span>
                }
                align="left"
                top="top-10"
              >
                <div className="w-60">
                  {communityData.flairs.length > 0 ? (
                    <ul>
                      {communityData.flairs.map((flair, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 py-1"
                          onClick={() => selectFlair(flair)}
                        >
                          <input
                            type="radio"
                            id={`flair-${index}`}
                            name="flair"
                            value={flair}
                            onChange={() => selectFlair(flair)}
                          />
                          <label htmlFor={`flair-${index}`}>{flair}</label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No flairs available for this community.</p>
                  )}
                </div>
              </Dropdown>
              <div className="space-x-2">
                <Button type="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="primary" onClick={handleSubmit}>Submit</Button>
              </div>
            </div>
          </div>
          <div className="hidden md:flex md:col-span-4 flex-col gap-8">
            <div className="border border-border h-fit p-6 rounded-md flex-col divide-y divide-border">
              <h2 className="flex items-center gap-2 font-medium pb-3">
                <FileText className="icon-sm" />
                Posting to Reddit
              </h2>
              <ul className="pt-3 divide-y divide-border text-sm font-medium space-y-2">
                <li>1. Remember the human</li>
                <li className="pt-2">2. Behave like you would in real life</li>
                <li className="pt-2">3. Look for the original source of content</li>
                <li className="pt-2">4. Search for duplicates before posting</li>
                <li className="pt-2">5. Read the community’s rules</li>
              </ul>
            </div>
            <p className="text-sm font-medium text-faint">
              Please be mindful of reddit's content policy and practice good reddiquette.
            </p>
          </div>
        </div>
      )}

    </>
  )
}
