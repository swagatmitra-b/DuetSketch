import Join from "@/components/Join";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Join />
      <div className="absolute bottom-3 right-3 italic">
        <p>
          created by
          <a
            href="https://github.com/swagatmitra-b/duetsketch"
            target="_blank"
            className=" text-blue-700 mx-1 font-semibold"
          >
            swagat
          </a>
        </p>
      </div>
    </div>
  );
}
