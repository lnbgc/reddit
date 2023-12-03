import { Signin } from "@components/auth/Signin"
import { Logo } from "@components/ui/Logo"
import { REGISTER } from "@routes/routes"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

export const Login = () => {
    return (
        <>
        <Helmet>
            <title>Log into Reddit</title>
        </Helmet>
            <div className="bg-primary text-normal fixed z-50 top-0 left-0 w-screen h-screen">
                <div className="flex justify-center items-center headerless p-4">
                    <div className="flex flex-col w-full gap-8 max-w-sm">
                        <div className="self-center">
                            <Logo type="small" className="h-12" />
                        </div>
                        <h2 className="text-xl font-bold self-center">Log into Reddit</h2>
                        <Signin />
                        <div className="text-sm text-muted self-center">
                            <span>Don’t have an account?</span>
                            <Link to={REGISTER} className="text-normal font-bold ml-1 underline underline-offset-1">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}