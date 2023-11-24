import { Button } from "@components/ui/Button"
import { Input } from "@components/ui/Input"
import { Google } from "./Google"

export const Signup = ({ closeModal }) => {
    return (
        <div className="flex flex-col gap-6">
            <Google closeModal={closeModal} />
            <div className="flex items-center gap-2">
                <span className="h-px w-1/2 bg-faint" />
                <span className="text-xs text-faint">OR</span>
                <span className="h-px w-1/2 bg-faint" />
            </div>
            <form className="space-y-2">
                <Input
                    type="text"
                    label="Username"
                    placeholder="CoolRedditor"
                />
                <Input
                    type="text"
                    label="Email address"
                    placeholder="cool.redditor@mail.com"
                />
                <Input
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                />
                <Input
                    type="password"
                    label="Confirm password"
                    placeholder="••••••••"
                />
            </form>
            <Button type="primary">
                Register
            </Button>
        </div>
    )
}