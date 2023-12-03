import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { useAuth } from "@contexts/AuthContext";
import { useState } from "react";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ROOT } from "@routes/routes";
import { Modal, ModalBody, ModalHeader } from "@components/ui/Modal";
import { Trash } from "lucide-react";

export const Settings = () => {
    const { user, updatePasscode, deleteAccount } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordChangeError, setPasswordChangeError] = useState(null);
    const [deleteConfirmationPassword, setDeleteConfirmationPassword] = useState("");
    const [deleteError, setDeleteError] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate();

    const handleUpdatePassword = async () => {
        if (newPassword === confirmNewPassword) {
            try {
                const credentials = EmailAuthProvider.credential(user.email, oldPassword);
                await reauthenticateWithCredential(user, credentials);

                await updatePasscode(newPassword);

                setOldPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
                setPasswordChangeError(null);
            } catch (error) {
                setPasswordChangeError("Error updating password. Please try again.");
            }
        } else {
            setPasswordChangeError("New passwords do not match.");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const credentials = EmailAuthProvider.credential(user.email, deleteConfirmationPassword);
            await reauthenticateWithCredential(user, credentials);

            await deleteAccount();
            navigate(ROOT)
        } catch (error) {
            setDeleteError("Error deleting account. Please check your password.");
        }
    };

    const isGoogleProvider = user?.providerData.some((provider) => provider.providerId === "google.com");

    return (
        <>
            <div className="min-headerless pt-2 pb-6 px-2 min-[1152px]:px-0 min-[1152px]:pt-6 min-[1152px]:pb-12 flex flex-col gap-12">
                <h1 className="font-bold text-xl">Account settings</h1>
                <div className="space-y-4">
                    <div className="border-b border-border">
                        <span className="uppercase text-xs font-medium text-muted">Account preferences</span>
                    </div>
                    <div className="space-y-2">
                        {
                            isGoogleProvider ? (
                                <>
                                    <h2 className="font-bold">Google account</h2>
                                    <p className="text-sm max-w-4xl">As you're logged in with a Google account there's no need in changing your password here. Cool, right? If you need to change your password for any reason, you can do it directly in your Google account settings.</p>
                                </>) : (
                                <>
                                    <h2 className="font-bold">Email address</h2>
                                    <p className="text-sm max-w-4xl">Sadly there is no way to update email addresses without verification in Firebase Authentification. And since this mostly for fun and testing purposes, I'm not really keen on sending emails to fake email addresses that I won't be able to confirm anyway. So yeah, no email change. Sorry?</p>
                                    <div className="space-y-2">
                                        <h2 className="font-bold">Password</h2>
                                        <p className="text-sm max-w-4xl">Password must be at least 6 characters long.</p>
                                        <Button onClick={() => setShowPasswordModal(true)}>Change password</Button>
                                    </div>
                                </>
                            )}
                    </div>

                </div>
                <div className="flex flex-col gap-4">
                    <div className="border-b border-border">
                        <span className="uppercase text-xs font-medium text-muted">Delete account</span>
                    </div>                    <div>
                        <Button type="danger" onClick={() => setShowDeleteModal(true)}>
                            <Trash className="icon-xs" />
                            Delete my account
                        </Button>
                    </div>
                </div>

            </div>


            <Modal show={showPasswordModal} setShow={setShowPasswordModal}>
                <ModalHeader>
                    Change password
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-8 w-80">
                        {passwordChangeError && <span className="error">{passwordChangeError}</span>}
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </div>
                        <Button type="primary" onClick={handleUpdatePassword}>Update Password</Button>
                    </div>
                </ModalBody>
            </Modal>

            <Modal show={showDeleteModal} setShow={setShowDeleteModal}>
                <ModalHeader>
                    Sad to see you go :(
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-8 w-80">
                        <p className="text-sm">Once you delete your account, your profile and username are permanently removed from Reddit and your posts and comments are disassociated (not deleted) from your account unless you delete them beforehand. Deleted accounts aren't recoverable.</p>
                        {deleteError && <span className="error">{deleteError}</span>}
                        <Input
                            type="password"
                            label="Enter your password to confirm deletion"
                            placeholder="Password"
                            value={deleteConfirmationPassword}
                            onChange={(e) => setDeleteConfirmationPassword(e.target.value)}
                        />
                        <Button type="primary" onClick={handleDeleteAccount}>Delete Account</Button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};
