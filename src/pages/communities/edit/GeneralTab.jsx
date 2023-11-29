import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@utils/firebase";
import { Input } from "@components/ui/Input";
import { Textarea } from "@components/ui/Textarea";
import { Button } from "@components/ui/Button";
import { CheckCircle, Loader2, Pen } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FileInput } from "@components/ui/FileInput";

export const GeneralTab = ({ communityData }) => {

  const [name, setName] = useState(communityData.name || "");
  const [description, setDescription] = useState(communityData.description || "");

  const [nameCounter, setNameCounter] = useState(50 - name.length);
  const [descriptionCounter, setDescriptionCounter] = useState(350 - description.length);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    setName(communityData.name || "");
    setDescription(communityData.description || "");
  }, [communityData]);

  const updateName = (e) => {
    const newName = e.target.value;
    setName(newName);
    setNameCounter(50 - newName.length);
  }

  const updateDescription = (value) => {
    setDescription(value);
    setDescriptionCounter(350 - value.length)
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const previewURL = URL.createObjectURL(file);
      setAvatarPreview(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (name === "") {
        setError("Community name cannot be empty.")
        return;
      }
      const communityDoc = doc(db, "communities", communityData.id);
      await updateDoc(communityDoc, {
        name,
        description,
      });

      if (avatar) {
        const avatarRef = ref(storage, `community_avatars/${communityData.url}`);
        await uploadBytes(avatarRef, avatar);
        const avatarURL = await getDownloadURL(avatarRef);
        await updateDoc(communityDoc, { avatar: avatarURL });
      }
      setChangesSaved(true);
    } catch (error) {
      console.error("Error updating community data:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <form className="flex flex-col gap-6">
        <div className="border-b border-border pb-6">
          <h2 className="text-lg font-bold">General Settings</h2>
          <p className="text-sm text-muted">Update your community details.</p>
        </div>
        <div className="flex items-center gap-3">
          {avatarPreview ? (
            <img src={avatarPreview} className="w-10 h-10 object-cover rounded-full" />
          ) : (
            <img src={communityData.avatar} className="w-10 h-10 object-cover rounded-full" />

          )}
          <FileInput
            label="Edit Avatar"
            icon={<Pen className="icon-xs" />}
            onChange={handleFileChange}
          />
        </div>
        <Input
          type="text"
          label="Name"
          value={name}
          error={error}
          onChange={updateName}
          maxLength={50}
          description={`${nameCounter} characters remaining.`}
        />
        <Textarea
          label="Description"
          value={description}
          onChange={updateDescription}
          maxLength={350}
          description={`${descriptionCounter} characters remaining.`}
        />
      </form>
      <div className="mt-6">
        <Button
          onClick={handleSubmit}
          type={loading ? "loading" : (changesSaved ? "success" : "primary")}
        >
          {loading ? (
            <>
              <Loader2 className="icon-xs animate-spin" />
              Loading...
            </>
          ) : changesSaved ? (
            <>
              <CheckCircle className="icon-xs" />
              Changes Saved!
            </>
          ) : (
            <>Update Community</>
          )}
        </Button>
      </div>
    </>
  );
};

