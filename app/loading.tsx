import Spinner from "@/components/spinner";

const LoadingPage = () => {
  return (
    <div className="flex flex-1 justify-center items-center h-screen w-screen">
      <Spinner />
    </div>
  );
};

export default LoadingPage;
