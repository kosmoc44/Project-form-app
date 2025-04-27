import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <SignUp />
    </div>
  );
}
