import { Signin } from "@components/auth/Signin";
import { Signup } from "@components/auth/Signup";
import { Button } from "@components/ui/Button";
import { Modal, ModalBody, ModalHeader } from "@components/ui/Modal";
import { useState } from "react";

export const Auth = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    return (
        <>
            <div id="desktop-auth" className="hidden md:flex items-center gap-2">
                <Button
                    type="primary"
                    onClick={() => setShowLoginModal(true)}>
                    Log In
                </Button>
                <Button
                    type="secondary"
                    onClick={() => setShowRegisterModal(true)}>
                    Register
                </Button>

                <Modal show={showLoginModal} setShow={setShowLoginModal}>
                    <ModalHeader>
                        <h2>Login</h2>
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-8 w-80">
                            <Signin />
                            <span className="text-sm text-muted font-medium self-center">Don't have an account?
                                <a
                                    onClick={() => {
                                        setShowLoginModal(false);
                                        setShowRegisterModal(true);
                                    }}
                                    className="font-bold underline underline-offset-2 ml-1 cursor-pointer text-normal">
                                    Register
                                </a>
                            </span>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal show={showRegisterModal} setShow={setShowRegisterModal}>
                    <ModalHeader>
                        <h2>Register</h2>
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-8 w-80">
                            <Signup />
                            <span className="text-sm text-muted font-medium self-center">Already a Redditor?
                                <a
                                    onClick={() => {
                                        setShowLoginModal(true);
                                        setShowRegisterModal(false);
                                    }}
                                    className="font-bold underline underline-offset-2 ml-1 cursor-pointer text-normal">
                                    Log In
                                </a>
                            </span>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </>
    )
}