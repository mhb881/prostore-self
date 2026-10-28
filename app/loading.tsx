import Spinner from "@/components/spinner";

const LoadingPage = () => {
  return (
    <div className="flex h-screen w-screen flex-1 items-center justify-center">
      <Spinner />
    </div>
  );
};

export default LoadingPage;
