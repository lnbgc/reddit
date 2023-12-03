import { Signup } from "@components/auth/Signup"
import { Logo } from "@components/ui/Logo"
import { LOGIN } from "@routes/routes"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

export const Register = () => {
    return (
        <>
        <Helmet>
            <title>Create a Reddit account</title>
        </Helmet>
            <div className="bg-primary text-normal fixed z-50 top-0 left-0 w-screen h-screen">
                <div className="flex justify-center items-center headerless p-4">
                    <div className="flex flex-col w-full gap-8 max-w-sm">
                        <div className="self-center">
                            <Logo type="small" className="h-12" />
                        </div>
                        <h2 className="text-xl font-bold self-center">Create your Reddit account</h2>
                        <Signup />
                        <div className="text-sm text-muted self-center">
                            <span>Already have an account?</span>
                            <Link to={LOGIN} className="text-normal font-bold ml-1 underline underline-offset-1">Log In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}